import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  ArrowLeft,
  UserRound,
  Mail,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react"

import { AuthContext } from "../context/AuthContext"
import { LanguageContext } from "../context/LanguageContext"
import axios from "../api/axios"
import { useNotification } from "../context/NotificationContext"

function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useContext(AuthContext)
  const { language } = useContext(LanguageContext)
  const navigate = useNavigate()
  const { addNotification } = useNotification()

  const isArabic = language === "ar"
  const direction = isArabic ? "rtl" : "ltr"

  const t = {
    community: isArabic ? "انضم إلى مجتمعنا" : "Join Our Community",
    createAccount: isArabic ? "إنشاء حساب" : "Create Account",
    description: isArabic
      ? "أنشئ حسابك واستمتع بتجربة تسوق أفضل."
      : "Create your account and enjoy a better shopping experience.",
    fullName: isArabic ? "الاسم بالكامل" : "Full Name",
    namePlaceholder: isArabic ? "أدخل اسمك" : "Enter your name",
    email: isArabic ? "البريد الإلكتروني" : "Email Address",
    emailPlaceholder: isArabic
      ? "أدخل بريدك الإلكتروني"
      : "Enter your email",
    password: isArabic ? "كلمة المرور" : "Password",
    passwordPlaceholder: isArabic
      ? "6 أحرف على الأقل"
      : "At least 6 characters",
    confirmPassword: isArabic
      ? "تأكيد كلمة المرور"
      : "Confirm Password",
    confirmPlaceholder: isArabic
      ? "أعد إدخال كلمة المرور"
      : "Confirm your password",
    creating: isArabic
      ? "جارٍ إنشاء الحساب..."
      : "Creating Account...",
    alreadyAccount: isArabic
      ? "لديك حساب بالفعل؟"
      : "Already have an account?",
    signIn: isArabic ? "تسجيل الدخول" : "Sign In",
    protected: isArabic
      ? "معلومات حسابك محمية."
      : "Your account information is protected.",
    passwordMismatch: isArabic
      ? "كلمتا المرور غير متطابقتين."
      : "Passwords do not match",
    passwordLength: isArabic
      ? "يجب ألا تقل كلمة المرور عن 6 أحرف."
      : "Password must be at least 6 characters",
    success: isArabic
      ? "تم إنشاء حسابك بنجاح."
      : "Your account has been created successfully.",
    error: isArabic
      ? "تعذر إنشاء حسابك. حاول مرة أخرى."
      : "Unable to create your account. Please try again.",
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (loading) return

    if (password !== confirmPassword) {
      addNotification(t.passwordMismatch, "warning")
      return
    }

    if (password.length < 6) {
      addNotification(t.passwordLength, "warning")
      return
    }

    try {
      setLoading(true)

      const { data } = await axios.post("/api/users/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      })

      login(data)
      addNotification(t.success, "success")
      navigate("/")
    } catch (err) {
      const message =
        err.response?.data?.message ||
        t.error

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
            <UserRound size={25} className="text-[#927b5b]" />
          </div>

          <p className="text-xs tracking-[0.25em] uppercase text-[#927b5b] mb-3">
            {t.community}
          </p>

          <h1 className="text-3xl font-semibold text-[#25231f]">
            {t.createAccount}
          </h1>

          <p className="text-sm text-[#77736d] mt-3">
            {t.description}
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#393630] mb-2"
            >
              {t.fullName}
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 text-[#99938a]`}
              />

              <input
                type="text"
                id="name"
                autoComplete="name"
                dir={direction}
                className={`w-full border border-[#e5e1da] rounded-lg py-3 ${inputPadding} text-sm text-[#25231f] outline-none focus:border-[#927b5b] transition-colors`}
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

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
                autoComplete="new-password"
                dir="ltr"
                className={`w-full border border-[#e5e1da] rounded-lg py-3 ${inputPadding} text-sm text-[#25231f] outline-none focus:border-[#927b5b] transition-colors text-left`}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#393630] mb-2"
            >
              {t.confirmPassword}
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 text-[#99938a]`}
              />

              <input
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                dir="ltr"
                className={`w-full border border-[#e5e1da] rounded-lg py-3 ${inputPadding} text-sm text-[#25231f] outline-none focus:border-[#927b5b] transition-colors text-left`}
                placeholder={t.confirmPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? (
              t.creating
            ) : (
              <>
                {t.createAccount}
                {isArabic ? (
                  <ArrowLeft size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#77736d] mt-7">
          {t.alreadyAccount}{" "}
          <Link
            to="/login"
            className="font-semibold text-[#927b5b] hover:underline"
          >
            {t.signIn}
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

export default RegisterPage