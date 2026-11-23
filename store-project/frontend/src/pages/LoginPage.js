import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  ArrowLeft,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react"

import { AuthContext } from "../context/AuthContext"
import { LanguageContext } from "../context/LanguageContext"
import axios from "../api/axios"
import { useNotification } from "../context/NotificationContext"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useContext(AuthContext)
  const { language } = useContext(LanguageContext)
  const navigate = useNavigate()
  const { addNotification } = useNotification()

  const isArabic = language === "ar"
  const direction = isArabic ? "rtl" : "ltr"

  const t = {
    welcome: isArabic ? "مرحباً بعودتك" : "Welcome Back",
    signIn: isArabic ? "تسجيل الدخول" : "Sign In",
    description: isArabic
      ? "سجّل الدخول لمتابعة التسوق معنا."
      : "Sign in to continue shopping with us.",
    email: isArabic ? "البريد الإلكتروني" : "Email Address",
    emailPlaceholder: isArabic
      ? "أدخل بريدك الإلكتروني"
      : "Enter your email",
    password: isArabic ? "كلمة المرور" : "Password",
    passwordPlaceholder: isArabic
      ? "أدخل كلمة المرور"
      : "Enter your password",
    forgotPassword: isArabic
      ? "نسيت كلمة المرور؟"
      : "Forgot Password?",
    signingIn: isArabic ? "جارٍ تسجيل الدخول..." : "Signing In...",
    or: isArabic ? "أو" : "OR",
    newCustomer: isArabic ? "عميل جديد؟" : "New Customer?",
    createAccount: isArabic
      ? "إنشاء حساب جديد"
      : "Create an Account",
    protected: isArabic
      ? "معلومات حسابك محمية."
      : "Your account information is protected.",
    welcomeNotification: isArabic
      ? "مرحباً بعودتك! تم تسجيل دخولك بنجاح."
      : "Welcome back! You are now signed in.",
    loginError: isArabic
      ? "تعذر تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى."
      : "Unable to sign in. Please check your details and try again.",
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (loading) return

    try {
      setLoading(true)

      const { data } = await axios.post("/api/users/login", {
        email: email.trim(),
        password,
      })

      login(data)
      addNotification(t.welcomeNotification, "success")
      navigate("/")
    } catch (err) {
      const message =
        err.response?.data?.message ||
        t.loginError

      addNotification(message, "error")
    } finally {
      setLoading(false)
    }
  }

  const iconPosition = isArabic ? "right-4" : "left-4"
  const inputPadding = isArabic ? "pr-11 pl-4" : "pl-11 pr-4"

  return (
    <main
      dir={direction}
      lang={isArabic ? "ar" : "en"}
      className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-[#f8f7f4]"
    >
      <div className="w-full max-w-md bg-white border border-[#eae7e1] rounded-2xl shadow-sm p-7 sm:p-9">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#f3f0e9] flex items-center justify-center">
            <LockKeyhole size={25} className="text-[#927b5b]" />
          </div>

          <p className="text-xs tracking-[0.25em] uppercase text-[#927b5b] mb-3">
            {t.welcome}
          </p>

          <h1 className="text-3xl font-semibold text-[#25231f]">
            {t.signIn}
          </h1>

          <p className="text-sm text-[#77736d] mt-3">
            {t.description}
          </p>
        </div>

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
                className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 text-[#99938a]`}
              />

              <input
                type="email"
                id="email"
                autoComplete="email"
                dir="ltr"
                className={`w-full border border-[#e5e1da] rounded-lg py-3 ${inputPadding} text-sm text-[#25231f] outline-none focus:border-[#927b5b] transition-colors text-left`}
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#393630] mb-2"
            >
              {t.password}
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 text-[#99938a]`}
              />

              <input
                type="password"
                id="password"
                autoComplete="current-password"
                dir="ltr"
                className={`w-full border border-[#e5e1da] rounded-lg py-3 ${inputPadding} text-sm text-[#25231f] outline-none focus:border-[#927b5b] transition-colors text-left`}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className={`mt-3 ${isArabic ? "text-left" : "text-right"}`}>
              <Link
                to="/forgotpassword"
                className="text-sm text-[#927b5b] hover:underline"
              >
                {t.forgotPassword}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#25231f] hover:bg-[#403b33] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
          >
            {loading ? (
              t.signingIn
            ) : (
              <>
                {t.signIn}
                {isArabic ? (
                  <ArrowLeft size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-7">
          <div className="flex-1 h-px bg-[#eae7e1]" />
          <span className="text-xs text-[#99938a]">{t.or}</span>
          <div className="flex-1 h-px bg-[#eae7e1]" />
        </div>

        <p className="text-center text-sm text-[#77736d]">
          {t.newCustomer}{" "}
          <Link
            to="/register"
            className="font-semibold text-[#927b5b] hover:underline"
          >
            {t.createAccount}
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 mt-7 text-xs text-[#99938a]">
          <ShieldCheck size={15} />
          <span>{t.protected}</span>
        </div>
      </div>
    </main>
  )
}

export default LoginPage