import {
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react"

import { useParams, Link, useNavigate } from "react-router-dom"
import {
  Package,
  MapPin,
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react"

import axios, { BASE_BACKEND_URL } from "../api/axios"
import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext"
import { LanguageContext } from "../context/LanguageContext"
import { useNotification } from "../context/NotificationContext"

import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js"

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

const formatPrice = (value) => Number(value || 0).toFixed(2)

function OrderPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { userInfo } = useContext(AuthContext)
  const { clearCart } = useContext(CartContext)
  const { language } = useContext(LanguageContext)
  const { addNotification } = useNotification()

  const isArabic = language === "ar"

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loadingDeliver, setLoadingDeliver] = useState(false)
  const [clientId, setClientId] = useState("")
  const [paypalConfigLoading, setPaypalConfigLoading] = useState(false)
  const [paypalConfigError, setPaypalConfigError] = useState("")

  const t = (english, arabic) =>
    isArabic ? arabic : english

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const { data } = await axios.get(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      })

      setOrder(data)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load order"

      setError(message)
      addNotification(message, "error")
    } finally {
      setLoading(false)
    }
  }, [id, userInfo?.token, addNotification])

  const fetchPayPalConfig = useCallback(async () => {
    try {
      setPaypalConfigLoading(true)
      setPaypalConfigError("")

      const { data } = await axios.get("/api/config/paypal")

      if (!data || typeof data !== "string") {
        throw new Error("Invalid PayPal Client ID configuration")
      }

      setClientId(data)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load PayPal configuration"

      setPaypalConfigError(message)
      addNotification(message, "error")
    } finally {
      setPaypalConfigLoading(false)
    }
  }, [addNotification])

  useEffect(() => {
    if (!userInfo) {
      navigate("/login", { replace: true })
      return
    }

    fetchOrder()
  }, [userInfo, navigate, fetchOrder])

  useEffect(() => {
    if (
      userInfo &&
      order &&
      !order.isPaid &&
      order.paymentMethod === "PayPal"
    ) {
      fetchPayPalConfig()
    }
  }, [order, userInfo, fetchPayPalConfig])

  const createOrder = async () => {
    try {
      const { data } = await axios.post(
        `/api/paypal/${order._id}/create`,
        {},
        config
      )

      if (!data?.id) {
        throw new Error("PayPal did not return an order ID")
      }

      return data.id
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create PayPal order"

      addNotification(message, "error")
      throw err
    }
  }

  const onApprove = async (data) => {
    try {
      const { data: updatedOrder } = await axios.post(
        `/api/paypal/${order._id}/capture`,
        {
          paypalOrderId: data.orderID,
        },
        {
          ...config,
          headers: {
            ...config.headers,
            "Content-Type": "application/json",
          },
        }
      )

      if (!updatedOrder?.isPaid) {
        throw new Error(
          "Payment has not been confirmed by the server"
        )
      }

      clearCart()

      localStorage.removeItem("shippingAddress")
      localStorage.removeItem("paymentMethod")

      setOrder(updatedOrder)

      addNotification(
        t("Payment successful!", "تم الدفع بنجاح!"),
        "success"
      )
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Payment confirmation failed"

      addNotification(message, "error")
    }
  }

  const onError = (err) => {
    addNotification(
      err.message || "PayPal payment failed",
      "error"
    )
  }

  const deliverHandler = async () => {
    try {
      setLoadingDeliver(true)

      await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        config
      )

      addNotification(
        t(
          "Delivery status updated successfully!",
          "تم تحديث حالة التوصيل بنجاح!"
        ),
        "success"
      )

      await fetchOrder()
    } catch (err) {
      addNotification(
        err.response?.data?.message ||
          err.message ||
          "Failed to update delivery status",
        "error"
      )
    } finally {
      setLoadingDeliver(false)
    }
  }

  const itemsPrice =
    order?.itemsPrice ??
    order?.orderItems?.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.qty || 0),
      0
    ) ??
    0

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f8f7f4]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e5e0d7] border-t-[#292720]" />
      </main>
    )
  }

  if (error && !order) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-[60vh] bg-[#f8f7f4] px-4 py-16 text-center"
      >
        <p className="mb-5 text-sm text-red-600">{error}</p>

        <Link
          to="/products"
          className="font-semibold text-[#292720] underline underline-offset-4"
        >
          {t("Back to Shopping", "العودة للتسوق")}
        </Link>
      </main>
    )
  }

  if (!order) return null

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f8f7f4] px-4 py-10"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#918875]">
            {t("Order Details", "تفاصيل الطلب")}
          </p>

          <h1 className="font-serif text-3xl font-semibold text-[#292720] sm:text-4xl">
            {t("Your Order", "طلبك")}
          </h1>

          <p
            dir="ltr"
            className="mt-3 break-all text-xs text-[#918b80]"
          >
            {t("Order ID:", "رقم الطلب:")} {order._id}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                order.isPaid
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.isPaid ? (
                <CheckCircle size={15} />
              ) : (
                <Clock size={15} />
              )}

              {order.isPaid
                ? t("Paid", "تم الدفع")
                : t("Payment Pending", "في انتظار الدفع")}
            </span>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                order.isDelivered
                  ? "bg-green-100 text-green-800"
                  : "bg-[#eae5dc] text-[#625c51]"
              }`}
            >
              <Truck size={15} />

              {order.isDelivered
                ? t("Delivered", "تم التوصيل")
                : t("Not Delivered", "لم يتم التوصيل")}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-[#e9e5dd] bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3 border-b border-[#eeeae3] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f2ec] text-[#514b40]">
                  <MapPin size={19} />
                </div>

                <h2 className="font-semibold text-[#292720]">
                  {t("Shipping Information", "معلومات الشحن")}
                </h2>
              </div>

              <div className="space-y-2 text-sm text-[#625c51]">
                <p>
                  <strong className="text-[#292720]">
                    {t("Name:", "الاسم:")}
                  </strong>{" "}
                  {order.user?.name || t("Unknown", "غير معروف")}
                </p>

                <p>
                  <strong className="text-[#292720]">
                    {t("Email:", "البريد الإلكتروني:")}
                  </strong>{" "}
                  {order.user?.email ? (
                    <a
                      dir="ltr"
                      href={`mailto:${order.user.email}`}
                      className="underline underline-offset-4"
                    >
                      {order.user.email}
                    </a>
                  ) : (
                    t("Not available", "غير متاح")
                  )}
                </p>

                <p className="leading-7">
                  <strong className="text-[#292720]">
                    {t("Address:", "العنوان:")}
                  </strong>{" "}
                  {[
                    order.shippingAddress?.address,
                    order.shippingAddress?.city,
                    order.shippingAddress?.postalCode,
                    order.shippingAddress?.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || t("Not available", "غير متاح")}
                </p>
              </div>

              <div
                className={`mt-5 flex items-center gap-3 rounded-lg p-4 text-sm ${
                  order.isDelivered
                    ? "bg-green-50 text-green-800"
                    : "bg-[#f5f2ec] text-[#625c51]"
                }`}
              >
                {order.isDelivered ? (
                  <CheckCircle size={19} />
                ) : (
                  <Truck size={19} />
                )}

                {order.isDelivered
                  ? `${t("Delivered on", "تم التوصيل بتاريخ")} ${new Date(
                      order.deliveredAt
                    ).toLocaleDateString(isArabic ? "ar-EG" : "en-US")}`
                  : t(
                      "Your order has not been delivered yet.",
                      "لم يتم توصيل طلبك حتى الآن."
                    )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e9e5dd] bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3 border-b border-[#eeeae3] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f2ec] text-[#514b40]">
                  <CreditCard size={19} />
                </div>

                <h2 className="font-semibold text-[#292720]">
                  {t("Payment Information", "معلومات الدفع")}
                </h2>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#292720]">
                    {order.paymentMethod}
                  </p>

                  <p className="mt-1 text-xs text-[#918b80]">
                    {t("PayPal or Credit Card", "باي بال أو بطاقة ائتمان")}
                  </p>
                </div>

                <span
                  dir="ltr"
                  className="rounded-md bg-[#f5f2ec] px-4 py-2 text-sm font-bold text-[#2455a4]"
                >
                  PayPal
                </span>
              </div>

              <div
                className={`mt-5 flex items-center gap-3 rounded-lg p-4 text-sm ${
                  order.isPaid
                    ? "bg-green-50 text-green-800"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {order.isPaid ? (
                  <CheckCircle size={19} />
                ) : (
                  <Clock size={19} />
                )}

                {order.isPaid
                  ? `${t("Paid on", "تم الدفع بتاريخ")} ${new Date(
                      order.paidAt
                    ).toLocaleDateString(isArabic ? "ar-EG" : "en-US")}`
                  : t(
                      "Payment is awaiting confirmation.",
                      "الدفع في انتظار التأكيد."
                    )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e9e5dd] bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3 border-b border-[#eeeae3] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f2ec] text-[#514b40]">
                  <Package size={19} />
                </div>

                <h2 className="font-semibold text-[#292720]">
                  {t("Order Items", "منتجات الطلب")} (
                  {order.orderItems?.length || 0})
                </h2>
              </div>

              {!order.orderItems?.length ? (
                <p className="text-sm text-[#77736b]">
                  {t(
                    "No items found in this order.",
                    "لا توجد منتجات في هذا الطلب."
                  )}
                </p>
              ) : (
                <div className="divide-y divide-[#eeeae3]">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={item.product || index}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#f7f6f3] sm:h-24 sm:w-24">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name || "Product"}
                          onError={(event) => {
                            event.currentTarget.onerror = null
                            event.currentTarget.src = "/placeholder.svg"
                          }}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        {item.product ? (
                          <Link
                            to={`/product/${item.product}`}
                            className="font-semibold text-[#292720] hover:underline"
                          >
                            {item.nameAr?.trim() && isArabic
                              ? item.nameAr
                              : item.name}
                          </Link>
                        ) : (
                          <p className="font-semibold text-[#292720]">
                            {item.nameAr?.trim() && isArabic
                              ? item.nameAr
                              : item.name}
                          </p>
                        )}

                        <p className="mt-1 text-sm text-[#77736b]">
                          {t("Quantity:", "الكمية:")} {item.qty}
                        </p>

                        <p
                          dir="ltr"
                          className="mt-1 text-xs text-[#918b80]"
                        >
                          ${formatPrice(item.price)}{" "}
                          {t("each", "للقطعة")}
                        </p>
                      </div>

                      <p
                        dir="ltr"
                        className="whitespace-nowrap text-sm font-semibold text-[#292720]"
                      >
                        $
                        {(
                          Number(item.qty || 0) *
                          Number(item.price || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="rounded-2xl border border-[#e9e5dd] bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-[#292720]">
              {t("Order Summary", "ملخص الطلب")}
            </h2>

            <div className="space-y-4 border-b border-[#eeeae3] pb-5">
              <div className="flex justify-between gap-3 text-sm text-[#625c51]">
                <span>{t("Items", "المنتجات")}</span>
                <span dir="ltr">${formatPrice(itemsPrice)}</span>
              </div>

              <div className="flex justify-between gap-3 text-sm text-[#625c51]">
                <span>{t("Shipping", "الشحن")}</span>
                <span dir="ltr">
                  ${formatPrice(order.shippingPrice)}
                </span>
              </div>

              <div className="flex justify-between gap-3 text-sm text-[#625c51]">
                <span>{t("Tax", "الضريبة")}</span>
                <span dir="ltr">${formatPrice(order.taxPrice)}</span>
              </div>
            </div>

            <div className="flex justify-between gap-3 py-5 text-lg font-bold text-[#292720]">
              <span>{t("Total", "الإجمالي")}</span>
              <span dir="ltr">${formatPrice(order.totalPrice)}</span>
            </div>

            {!order.isPaid &&
              order.paymentMethod === "PayPal" && (
                <div className="space-y-3">
                  {paypalConfigLoading && (
                    <p className="py-4 text-center text-sm text-[#77736b]">
                      {t("Loading PayPal...", "جاري تحميل باي بال...")}
                    </p>
                  )}

                  {paypalConfigError && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                      {paypalConfigError}

                      <button
                        type="button"
                        onClick={fetchPayPalConfig}
                        className="mt-2 block font-semibold underline"
                      >
                        {t("Try again", "حاول مرة أخرى")}
                      </button>
                    </div>
                  )}

                  {clientId && (
                    <PayPalScriptProvider
                      options={{
                        clientId,
                        currency: "USD",
                        intent: "capture",
                      }}
                    >
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          shape: "rect",
                          label: "paypal",
                        }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </PayPalScriptProvider>
                  )}
                </div>
              )}

            {order.isPaid && (
              <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-semibold text-green-800">
                <CheckCircle className="mx-auto mb-2" size={23} />
                {t(
                  "Payment Completed Successfully",
                  "تم إتمام الدفع بنجاح"
                )}
              </div>
            )}

            {userInfo?.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <button
                  onClick={deliverHandler}
                  disabled={loadingDeliver}
                  className="mt-4 w-full rounded-lg bg-[#514b40] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#292720] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingDeliver
                    ? t("Updating...", "جاري التحديث...")
                    : t("Mark As Delivered", "تأكيد تسليم الطلب")}
                </button>
              )}

            <div className="mt-5 flex items-center justify-center gap-2 border-t border-[#eeeae3] pt-5 text-xs text-[#918b80]">
              <ShieldCheck size={16} />
              {t(
                "Secure checkout with PayPal",
                "دفع آمن باستخدام باي بال"
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default OrderPage