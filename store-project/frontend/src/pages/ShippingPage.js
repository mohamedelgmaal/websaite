import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  MapPin,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react"

import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { LanguageContext } from "../context/LanguageContext"

function getSavedShippingAddress() {
  try {
    const saved = localStorage.getItem("shippingAddress")
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function ShippingPage() {
  const { userInfo } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext)
  const { language } = useContext(LanguageContext)

  const navigate = useNavigate()
  const isArabic = language === "ar"

  const [savedAddress] = useState(getSavedShippingAddress)

  const [address, setAddress] = useState(savedAddress.address || "")
  const [city, setCity] = useState(savedAddress.city || "")
  const [postalCode, setPostalCode] = useState(savedAddress.postalCode || "")
  const [country, setCountry] = useState(savedAddress.country || "")

  const t = {
    almostThere: isArabic ? "أوشكت على الانتهاء" : "Almost There",
    title: isArabic ? "عنوان الشحن" : "Shipping Address",
    description: isArabic
      ? "إلى أين تريد توصيل طلبك؟"
      : "Where should we deliver your order?",
    deliveryInfo: isArabic
      ? "معلومات التوصيل"
      : "Delivery Information",
    enterDetails: isArabic
      ? "أدخل بيانات التوصيل كاملة"
      : "Enter your complete delivery details",
    address: isArabic ? "عنوان الشارع" : "Street Address",
    addressPlaceholder: isArabic
      ? "أدخل عنوان الشارع"
      : "Enter your street address",
    city: isArabic ? "المدينة" : "City",
    cityPlaceholder: isArabic ? "أدخل المدينة" : "Enter city",
    postalCode: isArabic ? "الرمز البريدي" : "Postal Code",
    postalPlaceholder: isArabic
      ? "أدخل الرمز البريدي"
      : "Enter postal code",
    country: isArabic ? "الدولة" : "Country",
    countryPlaceholder: isArabic ? "أدخل الدولة" : "Enter country",
    continue: isArabic
      ? "المتابعة إلى الدفع"
      : "Continue to Payment",
    savedInfo: isArabic
      ? "يتم حفظ معلومات التوصيل لإتمام طلبك"
      : "Your delivery information is saved for checkout",
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/shipping", { replace: true })
      return
    }

    if (cartItems.length === 0) {
      navigate("/cart", { replace: true })
    }
  }, [userInfo, cartItems.length, navigate])

  const submitHandler = (e) => {
    e.preventDefault()

    const shippingAddress = {
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
    }

    localStorage.setItem(
      "shippingAddress",
      JSON.stringify(shippingAddress)
    )

    navigate("/payment")
  }

  const inputClass =
    "w-full rounded-lg border border-[#e3ded5] bg-[#fdfcfb] px-4 py-3 text-sm text-[#292720] outline-none transition focus:border-[#918875] focus:ring-2 focus:ring-[#918875]/10"

  const labelClass =
    "mb-2 block text-sm font-medium text-[#514b40]"

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-80px)] bg-[#f8f7f4] px-4 py-12"
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eae5dc] text-[#292720]">
            <MapPin size={25} />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#918875]">
            {t.almostThere}
          </p>

          <h1 className="font-serif text-3xl font-semibold text-[#292720] sm:text-4xl">
            {t.title}
          </h1>

          <p className="mt-3 text-sm text-[#77736b]">
            {t.description}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e5dd] bg-white p-6 shadow-sm sm:p-9">
          <div className="mb-7 flex items-center gap-3 border-b border-[#eeeae3] pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f2ec] text-[#514b40]">
              <MapPin size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-[#292720]">
                {t.deliveryInfo}
              </h2>

              <p className="text-xs text-[#918b80]">
                {t.enterDetails}
              </p>
            </div>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label
                htmlFor="address"
                className={labelClass}
              >
                {t.address}
              </label>

              <input
                type="text"
                id="address"
                dir={isArabic ? "rtl" : "ltr"}
                className={inputClass}
                placeholder={t.addressPlaceholder}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="city"
                  className={labelClass}
                >
                  {t.city}
                </label>

                <input
                  type="text"
                  id="city"
                  dir={isArabic ? "rtl" : "ltr"}
                  className={inputClass}
                  placeholder={t.cityPlaceholder}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="address-level2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className={labelClass}
                >
                  {t.postalCode}
                </label>

                <input
                  type="text"
                  id="postalCode"
                  dir="ltr"
                  className={inputClass}
                  placeholder={t.postalPlaceholder}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  autoComplete="postal-code"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className={labelClass}
              >
                {t.country}
              </label>

              <input
                type="text"
                id="country"
                dir={isArabic ? "rtl" : "ltr"}
                className={inputClass}
                placeholder={t.countryPlaceholder}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                autoComplete="country-name"
                required
              />
            </div>

            <div className="pt-3">
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
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#eeeae3] pt-5 text-xs text-[#918b80]">
            <ShieldCheck size={16} />
            <span>{t.savedInfo}</span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ShippingPage