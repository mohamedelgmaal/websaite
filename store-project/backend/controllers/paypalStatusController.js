import asyncHandler from "express-async-handler"
import mongoose from "mongoose"
import Order from "../models/Order.js"
import { paypalRequest } from "../utils/paypal.js"

const getPayPalOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!mongoose.isValidObjectId(id)) {
    res.status(400)
    throw new Error("Invalid order ID")
  }

  const order = await Order.findById(id)

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  const isOwner = order.user.toString() === req.user._id.toString()
  const isAdmin = req.user.isAdmin

  if (!isOwner && !isAdmin) {
    res.status(403)
    throw new Error("Not authorized to view this order")
  }

  if (!order.paypalOrderId) {
    res.status(404)
    throw new Error("No PayPal order is linked to this order")
  }

  const paypalOrder = await paypalRequest(
    `/v2/checkout/orders/${order.paypalOrderId}`
  )

  const purchaseUnits = (paypalOrder.purchase_units || []).map((unit) => ({
    reference_id: unit.reference_id,
    custom_id: unit.custom_id,
    amount: unit.amount,
    captures: (unit.payments?.captures || []).map((capture) => ({
      id: capture.id,
      status: capture.status,
      amount: capture.amount,
    })),
  }))

  res.json({
    localOrderId: order._id,
    localIsPaid: order.isPaid,
    paypalOrderId: paypalOrder.id,
    paypalStatus: paypalOrder.status,
    purchaseUnits,
  })
})

export { getPayPalOrderStatus }