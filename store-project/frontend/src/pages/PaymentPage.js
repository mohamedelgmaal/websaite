import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  CreditCard,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"

import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext"
import { LanguageContext } from "../context/LanguageContext"

function PaymentPage() {
  const { userInfo } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext)
  const { language } = useContext(LanguageContext)

  const navigate = useNavigate()
  const isArabic = language === "ar"

  const t = {
    secureCheckout: isArabic
      ? "إتمام شراء آمن"
      : "Secure Checkout",
    title: isArabic ? "طريقة الدفع" : "Payment Method",
    description: isArabic
      ? "اختر الطريقة التي تريد استخدامها لدفع قيمة طلبك"
      : "Choose how you would like to pay for your order",
    available: isArabic
      ? "طرق الدفع المتاحة"
      : "Available Payment Method",
    selectMethod: isArabic
      ? "اختر طريقة الدفع المفضلة لديك"
      : "Select your preferred payment option",
    paypalCard: isArabic
      ? "باي بال أو بطاقة ائتمان"
      : "PayPal or Credit Card",
    secureMessage: isArabic
      ? "ستتم معالجة دفعتك بأمان من خلال PayPal. يمكنك أيضًا استخدام بطاقة ائتمان أو خصم مؤهلة."
      : "Your payment will be securely processed through PayPal. You can also use an eligible credit or debit card.",
    continue: isArabic
      ? "المتابعة إلى مراجعة الطلب"
      : "Continue to Order",
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/payment", { replace: true })
      return
    }

    if (cartItems.length === 0) {
      navigate("/cart", { replace: true })
      return
    }

    try {
      const savedAddress = JSON.parse(
        localStorage.getItem("shippingAddress") || "null"
      )

      if (
        !savedAddress ||
        !savedAddress.address?.trim() ||
        !savedAddress.city?.trim() ||
        !savedAddress.postalCode?.trim() ||
        !savedAddress.country?.trim()
      ) {
        navigate("/shipping", { replace: true })
      }
    } catch {
      navigate("/shipping", { replace: true })
    }
  }, [userInfo, cartItems.length, navigate])

  const submitHandler = (e) => {
    e.preventDefault()

    if (!userInfo || cartItems.length === 0) {
      return
    }

    try {
      const savedAddress = JSON.parse(
        localStorage.getItem("shippingAddress") || "null"
      )

      if (
        !savedAddress ||
        !savedAddress.address?.trim() ||
        !savedAddress.city?.trim() ||
        !savedAddress.postalCode?.trim() ||
        !savedAddress.country?.trim()
      ) {
        navigate("/shipping")
        return
      }
    } catch {
      navigate("/shipping")
      return
    }

    localStorage.setItem("paymentMethod", JSON.stringify("PayPal"))
    navigate("/placeorder")
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-80px)] bg-[#f8f7f4] px-4 py-12"
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eae5dc] text-[#292720]">
            <CreditCard size={25} />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#918875]">
            {t.secureCheckout}
          </p>

          <h1 className="font-serif text-3xl font-semibold text-[#292720] sm:text-4xl">
            {t.title}
          </h1>

          <p className="mt-3 text-sm text-[#77736b]">
            {t.description}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e5dd] bg-white p-6 shadow-sm sm:p-9">
          <div className="mb-7 border-b border-[#eeeae3] pb-5">
            <h2 className="font-semibold text-[#292720]">
              {t.available}
            </h2>

            <p className="mt-1 text-xs text-[#918b80]">
              {t.selectMethod}
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-[#292720] bg-[#faf9f6] p-5">
              <input
                type="radio"
                name="paymentMethod"
                value="PayPal"
                checked
                readOnly
                className="h-4 w-4 accent-[#292720]"
              />

              <div className="flex flex-1 items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#292720]" dir="ltr">
                    PayPal
                  </p>

                  <p className="mt-1 text-xs text-[#77736b]">
                    {t.paypalCard}
                  </p>
                </div>

                <span
                  dir="ltr"
                  className="rounded-md bg-white px-3 py-2 text-sm font-bold text-[#2455a4] shadow-sm"
                >
                  PayPal
                </span>
              </div>
            </label>

            <div className="flex items-start gap-3 rounded-lg bg-[#f5f2ec] p-4 text-sm text-[#625c51]">
              <ShieldCheck size={19} className="mt-0.5 shrink-0" />

              <p>{t.secureMessage}</p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#292720] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#494438] focus:outline-none focus:ring-2 focus:ring-[#918875] focus:ring-offset-2"
            >
              {t.continue}

              {isArabic ? (
                <ArrowLeft size={18} />
              ) : (
                <ArrowRight size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default PaymentPage