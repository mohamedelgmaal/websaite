import { useState, useEffect, useContext } from "react"
import {
  UserRound,
  Mail,
  LockKeyhole,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  LoaderCircle,
  Eye,
  EyeOff,
} from "lucide-react"

import { AuthContext } from "../context/AuthContext"
import { LanguageContext } from "../context/LanguageContext"
import { useNotification } from "../context/NotificationContext"
import axios from "../api/axios"

function ProfilePage() {
  const { userInfo, login } = useContext(AuthContext)
  const { language } = useContext(LanguageContext)
  const { addNotification } = useNotification()

  const isArabic = language === "ar"
  const direction = isArabic ? "rtl" : "ltr"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [profileError, setProfileError] = useState("")

  const t = {
    accountSettings: isArabic ? "إعدادات الحساب" : "Account Settings",
    myProfile: isArabic ? "ملفي الشخصي" : "My Profile",
    profileDescription: isArabic
      ? "إدارة معلوماتك الشخصية وأمان حسابك."
      : "Manage your personal information and account security.",
    loginRequired: isArabic
      ? "يرجى تسجيل الدخول لعرض ملفك الشخصي."
      : "Please log in to view your profile.",
    unableToLoad: isArabic
      ? "تعذر تحميل الملف الشخصي."
      : "Unable to load your profile.",
    tryAgain: isArabic ? "حاول مرة أخرى" : "Try Again",
    myAccount: isArabic ? "حسابي" : "My Account",
    accountInformation: isArabic
      ? "معلومات الحساب"
      : "Account Information",
    accountDescription: isArabic
      ? "احرص على تحديث معلوماتك لتسهيل تجربة التسوق."
      : "Keep your information up to date to make your shopping experience easier.",
    personalInformation: isArabic
      ? "المعلومات الشخصية"
      : "Personal Information",
    updateDetails: isArabic
      ? "قم بتحديث بيانات حسابك من هنا."
      : "Update your account details below.",
    fullName: isArabic ? "الاسم بالكامل" : "Full Name",
    enterName: isArabic ? "أدخل اسمك" : "Enter your name",
    emailAddress: isArabic ? "البريد الإلكتروني" : "Email Address",
    enterEmail: isArabic
      ? "أدخل بريدك الإلكتروني"
      : "Enter your email",
    changePassword: isArabic
      ? "تغيير كلمة المرور"
      : "Change Password",
    passwordDescription: isArabic
      ? "اترك الحقول التالية فارغة إذا لم تكن ترغب في تغيير كلمة المرور."
      : "Leave these fields empty if you don't want to change your password.",
    newPassword: isArabic ? "كلمة المرور الجديدة" : "New Password",
    enterPassword: isArabic
      ? "أدخل كلمة المرور الجديدة"
      : "Enter new password",
    confirmPassword: isArabic
      ? "تأكيد كلمة المرور الجديدة"
      : "Confirm New Password",
    confirmPasswordPlaceholder: isArabic
      ? "أعد إدخال كلمة المرور الجديدة"
      : "Confirm your new password",
    saveChanges: isArabic ? "حفظ التغييرات" : "Save Changes",
    updating: isArabic ? "جارٍ التحديث..." : "Updating...",
    required: isArabic
      ? "الاسم والبريد الإلكتروني مطلوبان."
      : "Name and email are required.",
    passwordLength: isArabic
      ? "يجب ألا تقل كلمة المرور عن 6 أحرف."
      : "Password must be at least 6 characters.",
    passwordMismatch: isArabic
      ? "كلمتا المرور غير متطابقتين."
      : "Passwords do not match.",
    updated: isArabic
      ? "تم تحديث الملف الشخصي بنجاح!"
      : "Profile updated successfully!",
    unableToUpdate: isArabic
      ? "تعذر تحديث الملف الشخصي."
      : "Unable to update your profile.",
    showPassword: isArabic ? "إظهار كلمة المرور" : "Show password",
    hidePassword: isArabic ? "إخفاء كلمة المرور" : "Hide password",
  }

  useEffect(() => {
    let cancelled = false

    const fetchProfile = async () => {
      if (!userInfo?.token) {
        setProfileError(t.loginRequired)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setProfileError("")

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }

        const { data } = await axios.get("/api/users/profile", config)

        if (!cancelled) {
          setName(data.name || "")
          setEmail(data.email || "")
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err.response?.data?.message ||
            err.message ||
            t.unableToLoad

          setProfileError(message)
          addNotification(message, "error")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [
    userInfo?.token,
    addNotification,
    t.loginRequired,
    t.unableToLoad,
  ])

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      addNotification(t.required, "warning")
      return
    }

    if (password && password.length < 6) {
      addNotification(t.passwordLength, "warning")
      return
    }

    if (password !== confirmPassword) {
      addNotification(t.passwordMismatch, "warning")
      return
    }

    try {
      setUpdateLoading(true)

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(
        "/api/users/profile",
        {
          name: name.trim(),
          email: email.trim(),
          password,
        },
        config
      )

      login(data)

      setName(data.name || name.trim())
      setEmail(data.email || email.trim())
      setPassword("")
      setConfirmPassword("")

      addNotification(t.updated, "success")
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        t.unableToUpdate

      addNotification(message, "error")
    } finally {
      setUpdateLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-100"

  const iconPosition = isArabic
    ? "right-4"
    : "left-4"

  const eyePosition = isArabic
    ? "left-4"
    : "right-4"

  const inputPadding = isArabic
    ? "pr-12"
    : "pl-12"

  return (
    <div
      dir={direction}
      lang={isArabic ? "ar" : "en"}
      className="min-h-[calc(100vh-80px)] bg-[#f7f6f2] px-4 py-12 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
            {t.accountSettings}
          </span>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {t.myProfile}
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            {t.profileDescription}
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-80 items-center justify-center rounded-2xl border border-stone-200 bg-white">
            <LoaderCircle className="h-8 w-8 animate-spin text-stone-500" />
          </div>
        ) : profileError ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <p className="text-sm text-red-600">{profileError}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              {t.tryAgain}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                <UserRound className="h-8 w-8 text-stone-700" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-stone-900">
                {name || t.myAccount}
              </h2>

              <p
                dir="ltr"
                className="mt-1 break-all text-sm text-stone-500 text-left"
              >
                {email}
              </p>

              <div className="mt-6 border-t border-stone-100 pt-5">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-stone-500" />
                  {t.accountInformation}
                </div>

                <p className="mt-2 text-xs leading-6 text-stone-400">
                  {t.accountDescription}
                </p>
              </div>
            </aside>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
              <div className="mb-7 border-b border-stone-100 pb-6">
                <h2 className="text-xl font-semibold text-stone-900">
                  {t.personalInformation}
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  {t.updateDetails}
                </p>
              </div>

              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    {t.fullName}
                  </label>

                  <div className="relative">
                    <UserRound
                      className={`absolute ${iconPosition} top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400`}
                    />

                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      dir={direction}
                      className={`${inputClass} ${inputPadding}`}
                      placeholder={t.enterName}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    {t.emailAddress}
                  </label>

                  <div className="relative">
                    <Mail
                      className={`absolute ${iconPosition} top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400`}
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      dir="ltr"
                      className={`${inputClass} pl-12 text-left`}
                      placeholder={t.enterEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-6">
                  <h3 className="text-lg font-semibold text-stone-900">
                    {t.changePassword}
                  </h3>

                  <p className="mt-1 text-sm text-stone-500">
                    {t.passwordDescription}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    {t.newPassword}
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      className={`absolute ${iconPosition} top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400`}
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      dir="ltr"
                      className={`${inputClass} ${isArabic ? "pr-12 pl-12" : "pl-12 pr-12"} text-left`}
                      placeholder={t.enterPassword}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? t.hidePassword : t.showPassword
                      }
                      className={`absolute ${eyePosition} top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-700`}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    {t.confirmPassword}
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      className={`absolute ${iconPosition} top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400`}
                    />

                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      dir="ltr"
                      className={`${inputClass} ${isArabic ? "pr-12 pl-12" : "pl-12 pr-12"} text-left`}
                      placeholder={t.confirmPasswordPlaceholder}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? t.hidePassword : t.showPassword
                      }
                      className={`absolute ${eyePosition} top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-700`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-6">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-stone-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-52"
                  >
                    {updateLoading ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        {t.updating}
                      </>
                    ) : (
                      <>
                        {t.saveChanges}
                        {isArabic ? (
                          <ArrowLeft className="h-4 w-4" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage