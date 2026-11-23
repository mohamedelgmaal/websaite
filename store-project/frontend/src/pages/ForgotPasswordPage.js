import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react"

import axios from "../api/axios"
import { useNotification } from "../context/NotificationContext"
import { LanguageContext } from "../context/LanguageContext"

function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { addNotification } = useNotification()
  const { language } = useContext(LanguageContext)

  const isArabic = language === "ar"

  const t = {
    recovery: isArabic ? "استعادة الحساب" : "Account Recovery",
    title: isArabic ? "نسيت كلمة المرور؟" : "Forgot Password?",
    description: isArabic
      ? "أدخل بريدك الإلكتروني وسنرسل إليك تعليمات إعادة تعيين كلمة المرور."
      : "Enter your email address and we will send you instructions to reset your password.",
    email: isArabic ? "البريد الإلكتروني" : "Email Address",
    emailPlaceholder: isArabic
      ? "أدخل بريدك الإلكتروني"
      : "Enter your email",
    sending: isArabic ? "جارٍ الإرسال..." : "Sending...",
    sendLink: isArabic ? "إرسال رابط إعادة التعيين" : "Send Reset Link",
    successMessage: isArabic
      ? "تم إرسال طلبك. تحقق من بريدك الإلكتروني لمعرفة الخطوات التالية."
      : "Your request has been submitted. Check your email for the next steps.",
    tryAnother: isArabic ? "تجربة بريد إلكتروني آخر" : "Try Another Email",
    protected: isArabic
      ? "معلومات حسابك محمية."
      : "Your account information is protected.",
    remember: isArabic
      ? "هل تتذكر كلمة المرور؟"
      : "Remember your password?",
    signIn: isArabic ? "تسجيل الدخول" : "Sign In",
    successNotification: isArabic
      ? "إذا كان الحساب موجودًا، فسيتم إرسال تعليمات إعادة التعيين إلى بريدك الإلكتروني."
      : "If the account exists, reset instructions will be sent.",
    errorNotification: isArabic
      ? "تعذر معالجة طلبك. حاول مرة أخرى."
      : "Unable to process your request. Please try again.",
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (loading) return

    try {
      setLoading(true)

      const { data } = await axios.post("/api/users/forgotpassword", {
        email: email.trim(),
      })

      addNotification(
        data.message || t.successNotification,
        "success"
      )

      setSubmitted(true)
    } catch (err) {
      const message =
        err.response?.data?.message || t.errorNotification

      addNotification(message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-[#f8f7f4]"
    >
      <div className="w-full max-w-md bg-white border border-[#eae7e1] rounded-2xl shadow-sm p-7 sm:p-9">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#f3f0e9] flex items-center justify-center">
            {submitted ? (
              <Mail size={25} className="text-[#927b5b]" />
            ) : (
              <LockKeyhole size={25} className="text-[#927b5b]" />
            )}
          </div>

          <p className="text-xs tracking-[0.25em] uppercase text-[#927b5b] mb-3">
            {t.recovery}
          </p>

          <h1 className="text-3xl font-semibold text-[#25231f]">
            {t.title}
          </h1>

          <p className="text-sm text-[#77736d] mt-3 leading-6">
            {t.description}
          </p>
        </div>

        {submitted ? (
          <div className="text-center">
            <div className="bg-[#f8f7f4] border border-[#eae7e1] rounded-lg p-5 mb-6">
              <p className="text-sm text-[#393630] leading-6">
                {t.successMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="w-full bg-[#25231f] hover:bg-[#403b33] text-white font-medium py-3 rounded-lg transition-colors"
            >
              {t.tryAnother}
            </button>
          </div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#393630] mb-2"
              >
                {t.email}
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className={`absolute ${
                    isArabic ? "right-4" : "left-4"
                  } top-1/2 -translate-y-1/2 text-[#99938a]`}
                />

                <input
                  type="email"
                  id="email"
                  dir="ltr"
                  autoComplete="email"
                  className={`w-full border border-[#e5e1da] rounded-lg py-3 ${
                    isArabic ? "pr-11 pl-4" : "pl-11 pr-4"
                  } text-sm text-[#25231f] outline-none focus:border-[#927b5b] transition-colors`}
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#25231f] hover:bg-[#403b33] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? t.sending : t.sendLink}

              {!loading &&
                (isArabic ? (
                  <ArrowLeft size={18} />
                ) : (
                  <ArrowRight size={18} />
                ))}
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-2 mt-7 text-xs text-[#99938a]">
          <ShieldCheck size={15} />
          <span>{t.protected}</span>
        </div>

        <p className="text-center text-sm text-[#77736d] mt-6">
          {t.remember}{" "}
          <Link
            to="/login"
            className="font-semibold text-[#927b5b] hover:underline"
          >
            {t.signIn}
          </Link>
        </p>
      </div>
    </main>
  )
}

export default ForgotPasswordPage