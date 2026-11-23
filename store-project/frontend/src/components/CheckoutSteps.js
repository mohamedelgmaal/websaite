import { Link } from "react-router-dom"
import { useContext } from "react"
import { LanguageContext } from "../context/LanguageContext"

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const { language } = useContext(LanguageContext)
  const ar = language === "ar"

  const steps = [
    {
      name: ar ? "تسجيل الدخول" : "Sign In",
      path: "/login",
      active: step1,
    },
    {
      name: ar ? "الشحن" : "Shipping",
      path: "/shipping",
      active: step2,
    },
    {
      name: ar ? "الدفع" : "Payment",
      path: "/payment",
      active: step3,
    },
    {
      name: ar ? "تأكيد الطلب" : "Place Order",
      path: "/placeorder",
      active: step4,
    },
  ]

  return (
    <nav
      className="w-full max-w-3xl mx-auto my-8 px-3"
      dir={ar ? "rtl" : "ltr"}
      aria-label={ar ? "خطوات إتمام الشراء" : "Checkout steps"}
    >
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => (
          <div
            key={step.path}
            className="flex flex-1 items-center min-w-0"
          >
            <div className="flex flex-col items-center gap-2 min-w-0 w-full">
              {step.active ? (
                <Link
                  to={step.path}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-[#8A7052] text-white font-semibold shadow-sm hover:bg-[#725A40] transition-colors"
                  aria-current="step"
                >
                  {index + 1}
                </Link>
              ) : (
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#EAE5DA] border border-[#C8BBA7] text-[#766956] font-semibold">
                  {index + 1}
                </span>
              )}

              <span
                className={`text-xs sm:text-sm text-center whitespace-nowrap ${
                  step.active
                    ? "font-semibold text-[#403629]"
                    : "text-[#938775]"
                }`}
              >
                {step.name}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div className="h-px flex-1 bg-[#D6CCBC] mx-1 sm:mx-2 mb-6" />
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

export default CheckoutSteps