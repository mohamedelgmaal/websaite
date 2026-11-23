import { useContext } from "react"
import { Link } from "react-router-dom"
import {
  FaFacebookF,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa"
import {
  ArrowUpRight,
  ShoppingBag,
  House,
  ClipboardList,
} from "lucide-react"

import { LanguageContext } from "../context/LanguageContext"

function Footer() {
  const { language } = useContext(LanguageContext)
  const ar = language === "ar"

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/1CduSePcx7/",
      icon: <FaFacebookF />,
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/201068466261",
      icon: <FaWhatsapp />,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/elpop_elmasry123?dmpr=d29zNXY4dzEzZ3lu",
      icon: <FaInstagram />,
    },
  ]

  const headingClass =
    "mb-6 text-sm font-bold tracking-[0.12em] text-[#302820]"

  const linkClass =
    "flex items-center gap-3 text-sm font-medium text-[#625747] transition-colors duration-300 hover:text-[#8A7052]"

  return (
    <footer
      className="premium-footer border-t border-[#D6CCBC] bg-[#EAE5DA] text-[#302820]"
      dir={ar ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-16">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="brand-mark footer-logo inline-block"
              aria-label="PROSHOP home"
            >
              <span>PRO</span>SHOP
              <small>CURATED GOODS</small>
            </Link>

            <p className="mt-6 max-w-md text-sm font-medium leading-8 text-[#625747]">
              {ar
                ? "منتجات مختارة بعناية لتجعل تفاصيل يومك أفضل. اكتشف تجربة تسوق تجمع بين الجودة والأناقة."
                : "Thoughtfully selected goods to make the everyday feel exceptional. Discover a shopping experience built around quality and style."}
            </p>

            {/* Social Media */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C8BBA7] bg-[#DED5C6] text-[#403629] transition-all duration-300 hover:border-[#8A7052] hover:bg-[#8A7052] hover:text-white"
                >
                  <span className="text-lg">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div>
            <h3 className={headingClass}>
              {ar ? "اكتشف المتجر" : "DISCOVER"}
            </h3>

            <div className="flex flex-col gap-5">
              <Link to="/" className={linkClass}>
                <House size={16} />
                {ar ? "الرئيسية" : "Home"}
              </Link>

              <Link to="/products" className={linkClass}>
                <ShoppingBag size={16} />
                {ar ? "كل المنتجات" : "All Products"}
              </Link>

              <Link to="/cart" className={linkClass}>
                <ShoppingBag size={16} />
                {ar ? "سلة التسوق" : "Shopping Bag"}
              </Link>

              <Link to="/myorders" className={linkClass}>
                <ClipboardList size={16} />
                {ar ? "طلباتي" : "My Orders"}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className={headingClass}>
              {ar ? "تواصل معنا" : "GET IN TOUCH"}
            </h3>

            <p className="mb-5 text-sm font-medium leading-7 text-[#625747]">
              {ar
                ? "يسعدنا تواصلك معنا عبر حساباتنا الرسمية."
                : "We would love to hear from you. Connect with us through our social channels."}
            </p>

            <a
              href="https://wa.me/201068466261"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#403629] transition-colors duration-300 hover:text-[#8A7052]"
            >
              <FaWhatsapp className="text-lg" />
              {ar ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-4 border-t border-[#D0C5B4] pt-7 text-xs font-semibold text-[#625747] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} PROSHOP.{" "}
            {ar ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </span>

          <span>
            {ar
              ? "اختيارات منتقاة بعناية · تجربة تسوق استثنائية"
              : "THOUGHTFULLY SELECTED · A CONSIDERED SHOPPING EXPERIENCE"}
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer