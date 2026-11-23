import { useContext, useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext"
import { LanguageContext } from "../context/LanguageContext"

import {
  ShoppingBag,
  UserRound,
  Menu,
  X,
  Globe2,
  ClipboardList,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react"

function Navbar() {
  const { userInfo, logout } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext)
  const { language, toggleLanguage } = useContext(LanguageContext)

  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const ar = language === "ar"

  const count = (cartItems || []).reduce(
    (total, item) => total + (Number(item.qty) || 0),
    0
  )

  useEffect(() => {
    setMenuOpen(false)
    setAccountOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        setAccountOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const closeMenus = () => {
    setMenuOpen(false)
    setAccountOpen(false)
  }

  const logoutHandler = () => {
    closeMenus()
    logout()
    navigate("/login", { replace: true })
  }

  const navLinks = [
    {
      name: ar ? "الرئيسية" : "Home",
      path: "/",
    },
    {
      name: ar ? "تسوق الآن" : "Shop",
      path: "/products",
    },
  ]

  if (userInfo) {
    navLinks.push({
      name: ar ? "طلباتي" : "My Orders",
      path: "/myorders",
    })
  }

  return (
    <>
      <div className="announcement-bar" dir={ar ? "rtl" : "ltr"}>
        {ar
          ? "اختيارات منتقاة بعناية · تجربة تسوق استثنائية"
          : "THOUGHTFULLY SELECTED · A MORE CONSIDERED WAY TO SHOP"}
      </div>

      <header className="premium-navbar" dir={ar ? "rtl" : "ltr"}>
        <div className="nav-inner">

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => {
              setMenuOpen((prev) => !prev)
              setAccountOpen(false)
            }}
            aria-label={
              menuOpen
                ? ar
                  ? "إغلاق القائمة"
                  : "Close navigation menu"
                : ar
                  ? "فتح القائمة"
                  : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            {menuOpen ? (
              <X size={23} strokeWidth={1.5} />
            ) : (
              <Menu size={23} strokeWidth={1.5} />
            )}
          </button>

          <nav
            id="main-navigation"
            className={`main-nav ${menuOpen ? "is-open" : ""}`}
            aria-label={ar ? "القائمة الرئيسية" : "Main navigation"}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenus}
                className={
                  location.pathname === link.path
                    ? "active-nav-link"
                    : ""
                }
                aria-current={
                  location.pathname === link.path ? "page" : undefined
                }
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <Link
            to="/"
            className="brand-mark"
            aria-label="PROSHOP home"
            onClick={closeMenus}
          >
            <span>PRO</span>SHOP
            <small>CURATED GOODS</small>
          </Link>

          <div className="nav-actions">

            <button
              type="button"
              className="language-button"
              onClick={toggleLanguage}
              aria-label={
                ar ? "Switch to English" : "التبديل إلى العربية"
              }
              title={ar ? "English" : "العربية"}
            >
              <Globe2 size={17} strokeWidth={1.6} />
              <span>{ar ? "EN" : "عربي"}</span>
            </button>

            {userInfo ? (
              <div
                className={`account-menu ${
                  accountOpen ? "account-open" : ""
                }`}
              >
                <button
                  type="button"
                  className="icon-button account-trigger"
                  onClick={() => {
                    setAccountOpen((prev) => !prev)
                    setMenuOpen(false)
                  }}
                  aria-label={ar ? "حسابي" : "My account"}
                  aria-expanded={accountOpen}
                  aria-haspopup="true"
                >
                  <UserRound size={20} strokeWidth={1.6} />
                  <ChevronDown size={12} strokeWidth={1.8} />
                </button>

                <div
                  className="account-dropdown"
                  aria-hidden={!accountOpen}
                >
                  <div className="account-dropdown-header">
                    <span>{ar ? "مرحبًا بك" : "Welcome"}</span>
                    <strong>{userInfo.name}</strong>
                  </div>

                  <Link to="/profile" onClick={closeMenus}>
                    <UserRound size={15} />
                    {ar ? "حسابي الشخصي" : "My Profile"}
                  </Link>

                  <Link to="/myorders" onClick={closeMenus}>
                    <ClipboardList size={15} />
                    {ar ? "طلباتي" : "My Orders"}
                  </Link>

                  {userInfo.isAdmin && (
                    <Link to="/admin" onClick={closeMenus}>
                      <ShieldCheck size={15} />
                      {ar ? "لوحة الإدارة" : "Admin Dashboard"}
                    </Link>
                  )}

                  <div className="account-dropdown-divider" />

                  <button type="button" onClick={logoutHandler}>
                    <LogOut size={15} />
                    {ar ? "تسجيل الخروج" : "Logout"}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="icon-button"
                aria-label={ar ? "تسجيل الدخول" : "Sign in"}
                title={ar ? "تسجيل الدخول" : "Sign in"}
                onClick={closeMenus}
              >
                <UserRound size={20} strokeWidth={1.6} />
              </Link>
            )}

            <Link
              to="/cart"
              className="icon-button cart-action"
              aria-label={
                ar
                  ? `سلة التسوق، ${count} منتجات`
                  : `Shopping cart, ${count} items`
              }
              title={ar ? "سلة التسوق" : "Shopping cart"}
              onClick={closeMenus}
            >
              <ShoppingBag size={20} strokeWidth={1.6} />

              {count > 0 && (
                <span className="cart-count">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar