import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { LanguageContext } from "../context/LanguageContext"
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  PackageCheck,
} from "lucide-react"
import { BASE_BACKEND_URL } from "../api/axios"

function CartPage() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useContext(CartContext)

  const { userInfo } = useContext(AuthContext)
  const { language } = useContext(LanguageContext)

  const navigate = useNavigate()
  const isArabic = language === "ar"

  const t = (english, arabic) =>
    isArabic ? arabic : english

  const checkoutHandler = () => {
    if (userInfo) {
      navigate("/shipping")
    } else {
      navigate("/login?redirect=/shipping")
    }
  }

  const clearCartHandler = () => {
    const confirmed = window.confirm(
      t(
        "Are you sure you want to remove all products from your cart?",
        "هل أنت متأكد أنك تريد حذف جميع المنتجات من سلة المشتريات؟"
      )
    )

    if (confirmed) {
      clearCart()
    }
  }

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.svg"

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image
    }

    if (image.startsWith("/uploads")) {
      return `${BASE_BACKEND_URL}${image}`
    }

    return image.startsWith("/") ? image : `/${image}`
  }

  const handleImageError = (e) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = "/placeholder.svg"
  }

  const totalItems = cartItems.reduce(
    (acc, item) => acc + Number(item.qty || 0),
    0
  )

  const getProductName = (item) =>
    isArabic && item.nameAr?.trim()
      ? item.nameAr
      : item.name

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f7f6f2] px-4 py-10 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-[1280px]">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[3px] text-[#a58a5c]">
            <ShoppingBag size={14} />
            {t("Your Selection", "اختياراتك")}
          </span>

          <h1 className="font-serif text-4xl font-medium text-[#292823] sm:text-5xl">
            {t("Shopping Cart", "سلة المشتريات")}
          </h1>

          <p className="mt-3 text-sm text-[#77746d]">
            {t(
              "Review your selected pieces before checkout.",
              "راجع المنتجات التي اخترتها قبل إتمام الطلب."
            )}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="border border-[#e5e2da] bg-white px-6 py-20 text-center shadow-sm">
            <ShoppingBag
              size={42}
              className="mx-auto mb-5 text-[#b39762]"
            />

            <h2 className="font-serif text-2xl text-[#292823]">
              {t("Your Cart Is Empty", "سلة المشتريات فارغة")}
            </h2>

            <p className="mt-3 text-sm text-[#77746d]">
              {t(
                "You haven't added any products yet.",
                "لم تقم بإضافة أي منتجات حتى الآن."
              )}
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 bg-[#292823] px-8 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#a58a5c]"
            >
              <ArrowLeft
                size={15}
                className={isArabic ? "rotate-180" : ""}
              />
              {t("Explore Collection", "تصفح المنتجات")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

            {/* CART ITEMS */}
            <section className="bg-white p-5 shadow-sm sm:p-7 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between border-b border-[#eae7df] pb-5">
                <h2 className="font-serif text-2xl text-[#292823]">
                  {t("Your Items", "منتجاتك")}
                </h2>

                <span className="text-xs text-[#89857c]">
                  {totalItems} {t("items", "منتجات")}
                </span>
              </div>

              <div className="divide-y divide-[#eae7df]">
                {cartItems.map((item) => {
                  const stock = Number(item.countInStock)

                  const optionCount =
                    Number.isSafeInteger(stock) && stock > 0
                      ? Math.min(stock, 100)
                      : 0

                  return (
                    <article
                      key={item._id}
                      className="flex flex-col gap-4 py-6 first:pt-0 sm:flex-row sm:items-center"
                    >
                      <Link
                        to={`/product/${item._id}`}
                        className="h-32 w-full flex-shrink-0 overflow-hidden bg-[#f7f6f2] sm:h-32 sm:w-28"
                      >
                        <img
                          src={getImageUrl(item.image)}
                          alt={getProductName(item)}
                          onError={handleImageError}
                          className="h-full w-full object-contain"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/product/${item._id}`}
                          className="font-serif text-lg text-[#292823] transition hover:text-[#a58a5c]"
                        >
                          {getProductName(item)}
                        </Link>

                        <p
                          dir="ltr"
                          className="mt-2 text-sm font-medium text-[#a58a5c]"
                        >
                          ${Number(item.price || 0).toFixed(2)}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4">
                          <div>
                            <label
                              htmlFor={`qty-${item._id}`}
                              className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#89857c]"
                            >
                              {t("Quantity", "الكمية")}
                            </label>

                            <select
                              id={`qty-${item._id}`}
                              value={item.qty}
                              onChange={(e) =>
                                addToCart(item, Number(e.target.value))
                              }
                              disabled={optionCount === 0}
                              className="border border-[#e5e2da] bg-[#faf9f6] px-3 py-2 text-sm text-[#55534d] outline-none focus:border-[#a58a5c] disabled:opacity-50"
                            >
                              {optionCount > 0 ? (
                                Array.from(
                                  { length: optionCount },
                                  (_, index) => index + 1
                                ).map((qty) => (
                                  <option key={qty} value={qty}>
                                    {qty}
                                  </option>
                                ))
                              ) : (
                                <option value={item.qty}>
                                  {item.qty}
                                </option>
                              )}
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="mt-4 inline-flex items-center gap-2 text-xs text-[#99958b] transition hover:text-red-600"
                          >
                            <Trash2 size={15} />
                            {t("Remove", "حذف")}
                          </button>
                        </div>
                      </div>

                      <div className="text-right sm:min-w-[100px]">
                        <span className="text-[10px] uppercase tracking-wider text-[#99958b]">
                          {t("Subtotal", "الإجمالي الفرعي")}
                        </span>

                        <p
                          dir="ltr"
                          className="mt-1 font-serif text-lg text-[#292823]"
                        >
                          $
                          {(
                            Number(item.price || 0) *
                            Number(item.qty || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#eae7df] pt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#77746d] transition hover:text-[#a58a5c]"
                >
                  <ArrowLeft
                    size={15}
                    className={isArabic ? "rotate-180" : ""}
                  />
                  {t("Continue Shopping", "متابعة التسوق")}
                </Link>

                <button
                  type="button"
                  onClick={clearCartHandler}
                  className="inline-flex items-center gap-2 text-xs font-medium text-red-500 transition hover:text-red-700"
                >
                  <Trash2 size={15} />
                  {t("Clear Cart", "إفراغ السلة")}
                </button>
              </div>
            </section>

            {/* ORDER SUMMARY */}
            <aside className="bg-white p-6 shadow-sm sm:p-7">
              <h2 className="font-serif text-2xl text-[#292823]">
                {t("Order Summary", "ملخص الطلب")}
              </h2>

              <div className="my-6 space-y-4 border-y border-[#eae7df] py-6">
                <div className="flex justify-between gap-3 text-sm text-[#77746d]">
                  <span>
                    {t("Items", "المنتجات")} ({totalItems})
                  </span>
                  <span dir="ltr">
                    ${Number(itemsPrice).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm text-[#77746d]">
                  <span>{t("Shipping", "الشحن")}</span>
                  <span dir="ltr">
                    ${Number(shippingPrice).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm text-[#77746d]">
                  <span>{t("Tax", "الضريبة")}</span>
                  <span dir="ltr">
                    ${Number(taxPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mb-7 flex items-center justify-between gap-3">
                <span className="font-serif text-xl text-[#292823]">
                  {t("Total", "الإجمالي")}
                </span>

                <span
                  dir="ltr"
                  className="font-serif text-2xl text-[#a58a5c]"
                >
                  ${Number(totalPrice).toFixed(2)}
                </span>
              </div>

              <div className="mb-6 flex items-start gap-3 bg-[#f7f6f2] p-4">
                <PackageCheck
                  size={18}
                  className="mt-0.5 flex-shrink-0 text-[#a58a5c]"
                />

                <p className="text-xs leading-6 text-[#77746d]">
                  {t(
                    "Your order details will be reviewed before payment.",
                    "ستتم مراجعة تفاصيل طلبك قبل الدفع."
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full bg-[#292823] px-6 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#a58a5c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("Proceed to Checkout", "إتمام الشراء")}
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default CartPage