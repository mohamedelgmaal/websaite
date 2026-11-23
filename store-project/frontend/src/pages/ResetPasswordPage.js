import { useState, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  LockKeyhole,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"

import axios from "../api/axios"
import { useNotification } from "../context/NotificationContext"
import { LanguageContext } from "../context/LanguageContext"

function ResetPasswordPage() {
  const { resettoken } = useParams()
  const navigate = useNavigate()
  const { addNotification } = useNotification()
  const { language } = useContext(LanguageContext)

  const isArabic = language === "ar"

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const t = {
    security: isArabic ? "أمان الحساب" : "Account Security",
    updated: isArabic ? "تم تحديث كلمة المرور" : "Password Updated",
    reset: isArabic ? "إعادة تعيين كلمة المرور" : "Reset Password",
    successDescription: isArabic
      ? "تم تغيير كلمة المرور بنجاح. سيتم تحويلك إلى صفحة تسجيل الدخول."
      : "Your password has been changed successfully. You will be redirected to sign in.",
    description: isArabic
      ? "اختر كلمة مرور جديدة لحسابك."
      : "Choose a new password for your account.",
    successMessage: isArabic
      ? "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة."
      : "You can now sign in using your new password.",
    goToLogin: isArabic ? "الانتقال لتسجيل الدخول" : "Go to Sign In",
    newPassword: isArabic ? "كلمة المرور الجديدة" : "New Password",
    confirmPassword: isArabic
      ? "تأكيد كلمة المرور الجديدة"
      : "Confirm New Password",
    passwordPlaceholder: isArabic
      ? "أدخل كلمة المرور الجديدة"
      : "Enter new password",
    confirmPlaceholder: isArabic
      ? "أعد إدخال كلمة المرور الجديدة"
      : "Confirm new password",
    updating: isArabic
      ? "جارٍ تحديث كلمة المرور..."
      : "Updating Password...",
    resetButton: isArabic
      ? "إعادة تعيين كلمة المرور"
      : "Reset Password",
    protected: isArabic
      ? "معلومات حسابك محمية."
      : "Your account information is protected.",
    invalidToken: isArabic
      ? "رابط إعادة التعيين غير صالح أو غير مكتمل."
      : "Invalid or missing reset token.",
    passwordLength: isArabic
      ? "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل."
      : "Password must be at least 6 characters.",
    passwordMismatch: isArabic
      ? "كلمتا المرور غير متطابقتين."
      : "Passwords do not match.",
    resetError: isArabic
      ? "تعذر تغيير كلمة المرور. قد يكون الرابط غير صالح أو منتهي الصلاحية."
      : "Unable to reset your password. The link may be invalid or expired.",
    resetSuccess: isArabic
      ? "تم تغيير كلمة المرور بنجاح."
      : "Password reset successfully.",
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (loading) return

    if (!resettoken) {
      addNotification(t.invalidToken, "error")
      return
    }

    if (password.length < 6) {
      addNotification(t.passwordLength, "warning")
      return
    }

    if (password !== confirmPassword) {
      addNotification(t.passwordMismatch, "warning")
      return
    }

    try {
      setLoading(true)

      const { data } = await axios.put(
        `/api/users/resetpassword/${resettoken}`,
        { password }
      )

      setSuccess(true)

      addNotification(
        data.message || t.resetSuccess,
        "success"
      )

      setTimeout(() => {
        navigate("/login", { replace: true })
      }, 3000)
    } catch (err) {
      const message =
        err.response?.data?.message || t.resetError

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
            {success ? (
              <CheckCircle2 size={26} className="text-[#927b5b]" />
            ) : (
              <LockKeyhole size={25} className="text-[#927b5b]" />
            )}
          </div>

          <p className="text-xs tracking-[0.25em] uppercase text-[#927b5b] mb-3">
            {t.security}
          </p>

          <h1 className="text-3xl font-semibold text-[#25231f]">
            {success ? t.updated : t.reset}
          </h1>

          <p className="text-sm text-[#77736d] mt-3 leading-6">
            {success ? t.successDescription : t.description}
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-[#f8f7f4] border border-[#eae7e1] rounded-lg p-5 mb-6">
              <p className="text-sm text-[#393630]">
                {t.successMessage}
              </p>
            </div>

            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 bg-[#25231f] hover:bg-[#403b33] text-white font-medium py-3 rounded-lg transition-colors"
            >
              {t.goToLogin}
              {isArabic ? (
                <ArrowLeft size={18} />
              ) : (
                <ArrowRight size={18} />
              )}
            </Link>
          </div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#393630] mb-2"
              >
                {t.newPassword}
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className={`absolute ${
                    isArabic ? "right-4" : "left-4"
                  } top-1/2 -translate-y-1/2 text-[#99938a]`}
                />

                <input
                  type="password"
                  id="password"
                  dir="ltr"
                  autoComplete="new-password"
                  className={`w-full border border-[#e5e1da] rounded-lg py-3 ${
                    isArabic ? "pr-11 pl-4" : "pl-11 pr-4"
                  } text-sm text-[#25231f] outline-none focus:border-[#927b5b] transition-colors`}
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
                  className={`absolute ${
                    isArabic ? "right-4" : "left-4"
                  } top-1/2 -translate-y-1/2 text-[#99938a]`}
                />

                <input
                  type="password"
                  id="confirmPassword"
                  dir="ltr"
                  autoComplete="new-password"
                  className={`w-full border border-[#e5e1da] rounded-lg py-3 ${
                    isArabic ? "pr-11 pl-4" : "pl-11 pr-4"
                  } text-sm text-[#25231f] outline-none focus:border-[#927b5b] transition-colors`}
                  placeholder={t.confirmPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
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
              {loading ? t.updating : t.resetButton}

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
      </div>
    </main>
  )
}

export default ResetPasswordPage