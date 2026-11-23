import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  MapPin,
  CreditCard,
  Package,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"

import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { LanguageContext } from "../context/LanguageContext"
import axios, { BASE_BACKEND_URL } from "../api/axios"
import { useNotification } from "../context/NotificationContext"

const getImageUrl = (image) => {
  if (!image) return "/placeholder.svg"

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return image
  }

  return `${BASE_BACKEND_URL}/${image.replace(/^\/+/, "")}`
}

function PlaceOrderPage() {
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useContext(CartContext)

  const { userInfo } = useContext(AuthContext)
  const { language } = useContext(LanguageContext)

  const navigate = useNavigate()
  const { addNotification } = useNotification()

  const isArabic = language === "ar"

  const [shippingAddress, setShippingAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [loading, setLoading] = useState(false)

  const t = {
    finalStep: isArabic ? "الخطوة الأخيرة" : "Final Step",
    title: isArabic ? "مراجعة طلبك" : "Review Your Order",
    description: isArabic
      ? "راجع تفاصيل طلبك قبل إتمام عملية الشراء"
      : "Check your order details before completing your purchase",
    shippingAddress: isArabic ? "عنوان الشحن" : "Shipping Address",
    editAddress: isArabic ? "تعديل العنوان" : "Edit address",
    addressNotSet: isArabic
      ? "لم يتم تحديد عنوان الشحن."
      : "Shipping address not set.",
    addAddress: isArabic
      ? "إضافة عنوان الشحن"
      : "Add shipping address",
    paymentMethod: isArabic ? "طريقة الدفع" : "Payment Method",
    paypalCard: isArabic
      ? "باي بال أو بطاقة ائتمان"
      : "PayPal or Credit Card",
    paymentNotSet: isArabic
      ? "لم يتم تحديد طريقة الدفع."
      : "Payment method not set.",
    choosePayment: isArabic
      ? "اختر طريقة الدفع"
      : "Choose payment method",
    orderItems: isArabic ? "منتجات الطلب" : "Order Items",
    quantity: isArabic ? "الكمية" : "Quantity",
    each: isArabic ? "للقطعة" : "each",
    emptyCart: isArabic ? "سلة التسوق فارغة." : "Your cart is empty.",
    startShopping: isArabic ? "ابدأ التسوق" : "Start Shopping",
    summary: isArabic ? "ملخص الطلب" : "Order Summary",
    items: isArabic ? "المنتجات" : "Items",
    shipping: isArabic ? "الشحن" : "Shipping",
    tax: isArabic ? "الضريبة" : "Tax",
    total: isArabic ? "الإجمالي" : "Total",
    processing: isArabic ? "جارٍ إنشاء الطلب..." : "Processing...",
    placeOrder: isArabic ? "تأكيد الطلب" : "Place Order",
    secureCheckout: isArabic
      ? "دفع آمن باستخدام PayPal"
      : "Secure checkout with PayPal",
    invalidCheckout: isArabic
      ? "بيانات إتمام الطلب غير صالحة. حاول مرة أخرى."
      : "Invalid checkout information. Please try again.",
    orderIdError: isArabic
      ? "تم إنشاء الطلب ولكن لم يتم استلام رقم الطلب."
      : "Order was created but no order ID was returned.",
    createOrderError: isArabic
      ? "تعذر إنشاء الطلب."
      : "Could not create order",
    product: isArabic ? "منتج" : "Product",
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/placeorder", { replace: true })
      return
    }

    if (cartItems.length === 0) {
      navigate("/cart", { replace: true })
      return
    }

    try {
      const storedShippingAddress = JSON.parse(
        localStorage.getItem("shippingAddress") || "null"
      )

      const storedPaymentMethod = JSON.parse(
        localStorage.getItem("paymentMethod") || "null"
      )

      if (
        !storedShippingAddress ||
        !storedShippingAddress.address?.trim() ||
        !storedShippingAddress.city?.trim() ||
        !storedShippingAddress.postalCode?.trim() ||
        !storedShippingAddress.country?.trim()
      ) {
        navigate("/shipping", { replace: true })
        return
      }

      if (storedPaymentMethod !== "PayPal") {
        navigate("/payment", { replace: true })
        return
      }

      setShippingAddress(storedShippingAddress)
      setPaymentMethod(storedPaymentMethod)
    } catch {
      addNotification(t.invalidCheckout, "error")
      navigate("/shipping", { replace: true })
    }
  }, [userInfo, cartItems.length, navigate, addNotification])

  const placeOrderHandler = async () => {
    if (
      loading ||
      !userInfo ||
      cartItems.length === 0 ||
      !shippingAddress ||
      paymentMethod !== "PayPal"
    ) {
      return
    }

    try {
      setLoading(true)

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        },
        config
      )

      if (!data?._id) {
        throw new Error(t.orderIdError)
      }

      navigate(`/order/${data._id}`)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        t.createOrderError

      addNotification(message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f8f7f4] px-4 py-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#918875]">
            {t.finalStep}
          </p>

          <h1 className="font-serif text-3xl font-semibold text-[#292720] sm:text-4xl">
            {t.title}
          </h1>

          <p className="mt-3 text-sm text-[#77736b]">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping Address */}
            <section className="rounded-2xl border border-[#e9e5dd] bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3 border-b border-[#eeeae3] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f2ec] text-[#514b40]">
                  <MapPin size={19} />
                </div>

                <h2 className="font-semibold text-[#292720]">
                  {t.shippingAddress}
                </h2>
              </div>

              {shippingAddress ? (
                <div className="text-sm leading-7 text-[#625c51]">
                  <p>{shippingAddress.address}</p>

                  <p>
                    {shippingAddress.city},{" "}
                    {shippingAddress.postalCode}
                  </p>

                  <p>{shippingAddress.country}</p>

                  <Link
                    to="/shipping"
                    className="mt-3 inline-block text-xs font-semibold text-[#77705f] underline underline-offset-4 hover:text-[#292720]"
                  >
                    {t.editAddress}
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  {t.addressNotSet}{" "}
                  <Link to="/shipping" className="underline">
                    {t.addAddress}
                  </Link>
                </p>
              )}
            </section>

            {/* Payment Method */}
            <section className="rounded-2xl border border-[#e9e5dd] bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3 border-b border-[#eeeae3] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f2ec] text-[#514b40]">
                  <CreditCard size={19} />
                </div>

                <h2 className="font-semibold text-[#292720]">
                  {t.paymentMethod}
                </h2>
              </div>

              {paymentMethod ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#292720]" dir="ltr">
                      PayPal
                    </p>

                    <p className="mt-1 text-xs text-[#918b80]">
                      {t.paypalCard}
                    </p>
                  </div>

                  <span
                    dir="ltr"
                    className="rounded-md bg-[#f5f2ec] px-4 py-2 text-sm font-bold text-[#2455a4]"
                  >
                    PayPal
                  </span>
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  {t.paymentNotSet}{" "}
                  <Link to="/payment" className="underline">
                    {t.choosePayment}
                  </Link>
                </p>
              )}
            </section>

            {/* Order Items */}
            <section className="rounded-2xl border border-[#e9e5dd] bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3 border-b border-[#eeeae3] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f2ec] text-[#514b40]">
                  <Package size={19} />
                </div>

                <h2 className="font-semibold text-[#292720]">
                  {t.orderItems} ({cartItems.length})
                </h2>
              </div>

              {cartItems.length === 0 ? (
                <p className="text-sm text-[#77736b]">
                  {t.emptyCart}{" "}
                  <Link
                    to="/products"
                    className="font-semibold underline"
                  >
                    {t.startShopping}
                  </Link>
                </p>
              ) : (
                <div className="divide-y divide-[#eeeae3]">
                  {cartItems.map((item) => {
                    const productName =
                      isArabic && item.nameAr?.trim()
                        ? item.nameAr
                        : item.name || t.product

                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#f7f6f3] sm:h-24 sm:w-24">
                          <img
                            src={getImageUrl(item.image)}
                            alt={productName}
                            onError={(event) => {
                              event.currentTarget.onerror = null
                              event.currentTarget.src = "/placeholder.svg"
                            }}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/product/${item._id}`}
                            className="font-semibold text-[#292720] hover:underline"
                          >
                            {productName}
                          </Link>

                          <p className="mt-1 text-sm text-[#77736b]">
                            {t.quantity}: {item.qty}
                          </p>

                          <p className="mt-1 text-xs text-[#918b80]">
                            ${Number(item.price).toFixed(2)} {t.each}
                          </p>
                        </div>

                        <p
                          dir="ltr"
                          className="whitespace-nowrap text-sm font-semibold text-[#292720]"
                        >
                          $
                          {(
                            Number(item.qty) * Number(item.price)
                          ).toFixed(2)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Order Summary */}
          <aside className="rounded-2xl border border-[#e9e5dd] bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-[#292720]">
              {t.summary}
            </h2>

            <div className="space-y-4 border-b border-[#eeeae3] pb-5">
              <div className="flex justify-between gap-3 text-sm text-[#625c51]">
                <span>{t.items}</span>
                <span dir="ltr">${itemsPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between gap-3 text-sm text-[#625c51]">
                <span>{t.shipping}</span>
                <span dir="ltr">${shippingPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between gap-3 text-sm text-[#625c51]">
                <span>{t.tax}</span>
                <span dir="ltr">${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between gap-3 py-5 text-lg font-bold text-[#292720]">
              <span>{t.total}</span>
              <span dir="ltr">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={placeOrderHandler}
              disabled={
                cartItems.length === 0 ||
                !shippingAddress ||
                paymentMethod !== "PayPal" ||
                loading
              }
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#292720] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#494438] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t.processing : t.placeOrder}

              {!loading &&
                (isArabic ? (
                  <ArrowLeft size={18} />
                ) : (
                  <ArrowRight size={18} />
                ))}
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#918b80]">
              <ShieldCheck size={16} />
              <span>{t.secureCheckout}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default PlaceOrderPage