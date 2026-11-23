import asyncHandler from "express-async-handler"
import Order from "../models/Order.js"
import { paypalRequest } from "../utils/paypal.js"

// تحويل المبلغ إلى سنتات لتجنب أخطاء الكسور العشرية
const toCents = (amount) => Math.round(Number(amount) * 100)

// التحقق من ملكية الطلب
const checkOrderPermission = (order, user) => {
  const isOwner = order.user.toString() === user._id.toString()
  const isAdmin = Boolean(user.isAdmin)

  return isOwner || isAdmin
}

// التحقق من بيانات طلب PayPal ومطابقتها بالطلب المحلي
const validatePayPalOrder = (order, paypalOrder) => {
  if (!paypalOrder || !paypalOrder.id) {
    return "PayPal order information is missing"
  }

  if (paypalOrder.id !== order.paypalOrderId) {
    return "PayPal order ID does not match"
  }

  if (paypalOrder.status !== "COMPLETED") {
    return `PayPal order is not completed. Current status: ${paypalOrder.status}`
  }

  const purchaseUnits = paypalOrder.purchase_units || []

  if (purchaseUnits.length !== 1) {
    return "Unexpected PayPal purchase units"
  }

  const unit = purchaseUnits[0]

  if (unit.reference_id !== order._id.toString()) {
    return "PayPal reference ID does not match"
  }

  if (unit.custom_id !== order._id.toString()) {
    return "PayPal custom ID does not match"
  }

  const captures = unit.payments?.captures || []

  if (captures.length === 0) {
    return "PayPal capture information is missing"
  }

  const completedCapture = captures.find(
    (capture) => capture.status === "COMPLETED"
  )

  if (!completedCapture) {
    return "No completed PayPal capture was found"
  }

  const expectedAmount = toCents(order.totalPrice)
  const capturedAmount = toCents(completedCapture.amount?.value)

  if (
    completedCapture.amount?.currency_code !== "USD" ||
    capturedAmount !== expectedAmount
  ) {
    return "PayPal captured amount or currency does not match the order"
  }

  if (
    unit.amount?.currency_code !== "USD" ||
    toCents(unit.amount?.value) !== expectedAmount
  ) {
    return "PayPal purchase amount does not match the order"
  }

  return null
}

// حفظ الدفع مرة واحدة فقط
const savePaidOrder = async (order, paypalOrder) => {
  const unit = paypalOrder.purchase_units[0]

  const capture = unit.payments.captures.find(
    (item) => item.status === "COMPLETED"
  )

  await Order.updateOne(
    {
      _id: order._id,
      isPaid: false,
    },
    {
      $set: {
        isPaid: true,
        paidAt: capture.update_time
          ? new Date(capture.update_time)
          : new Date(),
        paymentResult: {
          id: capture.id,
          status: capture.status,
          update_time: capture.update_time || capture.create_time,
          email_address: paypalOrder.payer?.email_address || "",
        },
      },
    }
  )

  return await Order.findById(order._id)
}

// إنشاء طلب PayPal
const createPayPalOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  if (!checkOrderPermission(order, req.user)) {
    res.status(403)
    throw new Error("Not authorized")
  }

  if (order.isPaid) {
    res.status(409)
    throw new Error("This order has already been paid")
  }

  if (order.paymentMethod !== "PayPal") {
    res.status(400)
    throw new Error("Invalid payment method")
  }

  if (
    order.currency !== "USD" ||
    !Number.isFinite(Number(order.totalPrice)) ||
    Number(order.totalPrice) <= 0
  ) {
    res.status(400)
    throw new Error("Invalid order amount or currency")
  }

  // إذا كان هناك طلب PayPal سابق، نفحصه قبل إنشاء طلب جديد
  if (order.paypalOrderId) {
    const existingPayPalOrder = await paypalRequest(
      `/v2/checkout/orders/${order.paypalOrderId}`
    )

    if (
      existingPayPalOrder.purchase_units?.length !== 1 ||
      existingPayPalOrder.purchase_units[0].reference_id !==
        order._id.toString() ||
      existingPayPalOrder.purchase_units[0].custom_id !==
        order._id.toString() ||
      existingPayPalOrder.purchase_units[0].amount?.currency_code !== "USD" ||
      toCents(existingPayPalOrder.purchase_units[0].amount?.value) !==
        toCents(order.totalPrice)
    ) {
      res.status(409)
      throw new Error("Existing PayPal order does not match this order")
    }

    if (existingPayPalOrder.status === "COMPLETED") {
      const validationError = validatePayPalOrder(
        order,
        existingPayPalOrder
      )

      if (validationError) {
        res.status(409)
        throw new Error(
          `PayPal reports a completed order, but verification failed: ${validationError}`
        )
      }

      await savePaidOrder(order, existingPayPalOrder)

      res.status(409)
      throw new Error(
        "Payment was already completed. Refresh the order page."
      )
    }

    if (
      existingPayPalOrder.status === "CREATED" ||
      existingPayPalOrder.status === "APPROVED"
    ) {
      return res.json({
        id: existingPayPalOrder.id,
      })
    }

    res.status(409)
    throw new Error(
      `Existing PayPal order cannot be reused. Status: ${existingPayPalOrder.status}`
    )
  }

  // إنشاء طلب جديد عندما لا يوجد طلب PayPal سابق
  const paypalOrder = await paypalRequest(
    "/v2/checkout/orders",
    "POST",
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order._id.toString(),
          custom_id: order._id.toString(),
          amount: {
            currency_code: "USD",
            value: Number(order.totalPrice).toFixed(2),
          },
        },
      ],
    }
  )

  if (!paypalOrder.id) {
    res.status(502)
    throw new Error("PayPal did not return an order ID")
  }

  order.paypalOrderId = paypalOrder.id
  await order.save()

  res.json({
    id: paypalOrder.id,
  })
})

// تأكيد الدفع
const capturePayPalOrder = asyncHandler(async (req, res) => {
  const { paypalOrderId } = req.body

  if (!paypalOrderId || typeof paypalOrderId !== "string") {
    res.status(400)
    throw new Error("Invalid PayPal order ID")
  }

  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  if (!checkOrderPermission(order, req.user)) {
    res.status(403)
    throw new Error("Not authorized")
  }

  // منع تكرار تسجيل الدفع
  if (order.isPaid) {
    return res.json(order)
  }

  if (order.paymentMethod !== "PayPal") {
    res.status(400)
    throw new Error("Invalid payment method")
  }

  if (order.paypalOrderId !== paypalOrderId) {
    res.status(400)
    throw new Error("PayPal order ID mismatch")
  }

  if (
    order.currency !== "USD" ||
    !Number.isFinite(Number(order.totalPrice)) ||
    Number(order.totalPrice) <= 0
  ) {
    res.status(400)
    throw new Error("Invalid order amount or currency")
  }

  // فحص حالة الطلب قبل محاولة Capture
  let paypalOrder = await paypalRequest(
    `/v2/checkout/orders/${paypalOrderId}`
  )

  // إذا اكتمل الدفع بالفعل، نتحقق منه ونحفظه دون Capture جديد
  if (paypalOrder.status === "COMPLETED") {
    const validationError = validatePayPalOrder(order, paypalOrder)

    if (validationError) {
      res.status(400)
      throw new Error(
        `PayPal payment verification failed: ${validationError}`
      )
    }

    const updatedOrder = await savePaidOrder(order, paypalOrder)
    return res.json(updatedOrder)
  }

  if (paypalOrder.status !== "APPROVED") {
    res.status(409)
    throw new Error(
      `PayPal order is not approved. Current status: ${paypalOrder.status}`
    )
  }

  // تنفيذ Capture
  try {
    await paypalRequest(
      `/v2/checkout/orders/${paypalOrderId}/capture`,
      "POST",
      {}
    )
  } catch (captureError) {
    // قد يكون PayPal أكمل العملية رغم حدوث خطأ في الاستجابة.
    // لذلك نعيد الاستعلام قبل اعتبار العملية فاشلة.
    try {
      paypalOrder = await paypalRequest(
        `/v2/checkout/orders/${paypalOrderId}`
      )
    } catch (verificationError) {
      console.error(
        "PayPal capture and verification errors:",
        captureError.message,
        verificationError.message
      )

      res.status(502)
      throw new Error(
        "Unable to confirm PayPal payment. Please do not retry payment yet."
      )
    }

    if (paypalOrder.status !== "COMPLETED") {
      console.error("PayPal capture error:", captureError.message)

      res.status(400)
      throw new Error(
        `PayPal capture failed. Current status: ${paypalOrder.status}`
      )
    }
  }

  // قراءة الحالة النهائية من PayPal بعد Capture
  paypalOrder = await paypalRequest(
    `/v2/checkout/orders/${paypalOrderId}`
  )

  const validationError = validatePayPalOrder(order, paypalOrder)

  if (validationError) {
    console.error("PayPal verification error:", validationError)

    res.status(400)
    throw new Error(
      `PayPal payment verification failed: ${validationError}`
    )
  }

  const updatedOrder = await savePaidOrder(order, paypalOrder)

  if (!updatedOrder || !updatedOrder.isPaid) {
    res.status(500)
    throw new Error("Payment was confirmed but order update failed")
  }

  res.json(updatedOrder)
})

export {
  createPayPalOrder,
  capturePayPalOrder,
}