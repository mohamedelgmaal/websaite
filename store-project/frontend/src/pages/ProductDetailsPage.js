import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios, { BASE_BACKEND_URL } from "../api/axios"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { LanguageContext } from "../context/LanguageContext"
import { Star, ShoppingBag, ArrowLeft, PackageCheck } from "lucide-react"
import { useNotification } from "../context/NotificationContext"

function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const { userInfo } = useContext(AuthContext)
  const { language } = useContext(LanguageContext)
  const { addNotification } = useNotification()

  const isArabic = language === "ar"

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState("")
  const [comment, setComment] = useState("")
  const [reviewLoading, setReviewLoading] = useState(false)

  const text = {
    notFound: isArabic ? "المنتج غير موجود" : "Product Not Found",
    unavailable: isArabic
      ? "هذا المنتج غير متاح حاليًا."
      : "This product is currently unavailable.",
    back: isArabic ? "العودة إلى المنتجات" : "Back to Collection",
    selected: isArabic ? "من مجموعتنا المختارة" : "Selected Collection",
    reviews: isArabic ? "تقييم" : "reviews",
    stock: isArabic ? "متوفر في المخزون" : "In Stock",
    available: isArabic ? "قطعة متاحة" : "available",
    outOfStock: isArabic ? "نفدت الكمية" : "Currently Out of Stock",
    quantity: isArabic ? "الكمية" : "Quantity",
    addToCart: isArabic ? "أضف إلى السلة" : "Add To Cart",
    customerFeedback: isArabic ? "آراء العملاء" : "Customer Feedback",
    reviewsTitle: isArabic ? "التقييمات" : "Reviews",
    noReviews: isArabic
      ? "لا توجد تقييمات لهذا المنتج حتى الآن. كن أول من يشارك تجربته."
      : "No reviews for this product yet. Be the first to share your experience.",
    shareExperience: isArabic ? "شارك تجربتك" : "Share Your Experience",
    yourRating: isArabic ? "تقييمك" : "Your Rating",
    selectRating: isArabic ? "اختر تقييمك" : "Select your rating",
    poor: isArabic ? "ضعيف" : "Poor",
    fair: isArabic ? "مقبول" : "Fair",
    good: isArabic ? "جيد" : "Good",
    veryGood: isArabic ? "جيد جدًا" : "Very Good",
    excellent: isArabic ? "ممتاز" : "Excellent",
    yourReview: isArabic ? "مراجعتك" : "Your Review",
    reviewPlaceholder: isArabic
      ? "اكتب مراجعتك هنا..."
      : "Write your review here...",
    submitting: isArabic ? "جارٍ الإرسال..." : "Submitting...",
    submitReview: isArabic ? "إرسال التقييم" : "Submit Review",
    loginMessage: isArabic
      ? "يرجى تسجيل الدخول لإضافة تقييم."
      : "Please log in to add a review.",
    login: isArabic ? "تسجيل الدخول" : "log in",
    addRatingError: isArabic
      ? "يرجى اختيار تقييم وكتابة تعليق."
      : "Please select a rating and enter a comment.",
    reviewSuccess: isArabic
      ? "تمت إضافة التقييم بنجاح!"
      : "Review added successfully!",
    loadError: isArabic
      ? "تعذر تحميل المنتج."
      : "Unable to load product.",
    stockOutButton: isArabic ? "غير متوفر" : "Out Of Stock",
  }

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError("")

      const { data } = await axios.get(`/api/products/${id}`)
      setProduct(data)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        text.loadError

      setError(message)
      addNotification(message, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setQty(1)
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const addToCartHandler = () => {
    if (!product || product.countInStock <= 0) return

    addToCart(product, Number(qty))
    navigate("/cart")
  }

  const submitReviewHandler = async (e) => {
    e.preventDefault()

    if (!rating || !comment.trim()) {
      addNotification(text.addRatingError, "error")
      return
    }

    setReviewLoading(true)

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.post(
        `/api/products/${id}/reviews`,
        {
          rating: Number(rating),
          comment: comment.trim(),
        },
        config
      )

      addNotification(text.reviewSuccess, "success")
      setRating("")
      setComment("")
      await fetchProduct()
    } catch (err) {
      addNotification(
        err.response?.data?.message || err.message,
        "error"
      )
    } finally {
      setReviewLoading(false)
    }
  }

  const imageUrl = product?.image?.startsWith("/uploads")
    ? `${BASE_BACKEND_URL}${product.image}`
    : product?.image || "/placeholder.svg"

  const handleImageError = (e) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = "/placeholder.svg"
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7f6f2]">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#e5e2da] border-t-[#a58a5c]" />
      </main>
    )
  }

  if (error || !product) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-screen bg-[#f7f6f2] px-4 py-16"
      >
        <div className="mx-auto max-w-2xl border border-[#e5e2da] bg-white px-6 py-16 text-center">
          <h1 className="font-serif text-2xl text-[#292823]">
            {text.notFound}
          </h1>

          <p className="mt-3 text-sm text-[#77746d]">
            {error || text.unavailable}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 bg-[#292823] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#a58a5c]"
          >
            <ArrowLeft size={15} />
            {text.back}
          </Link>
        </div>
      </main>
    )
  }

  const reviews = product.reviews || []
  const stock = Number(product.countInStock || 0)
  const averageRating = Number(product.rating || 0)

  const productName =
    isArabic && product.nameAr?.trim()
      ? product.nameAr
      : product.name

  const productDescription =
    isArabic && product.descriptionAr?.trim()
      ? product.descriptionAr
      : product.description || (
          isArabic
            ? "اكتشف هذه القطعة من مجموعتنا."
            : "Discover this piece from our collection."
        )

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f7f6f2] px-4 py-8 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-[1280px]">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-[#77746d] transition hover:text-[#a58a5c]"
        >
          <ArrowLeft size={15} />
          {text.back}
        </Link>

        <section className="grid grid-cols-1 gap-8 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex min-h-[350px] items-center justify-center bg-[#f7f6f2] p-4 sm:min-h-[500px]">
            <img
              src={imageUrl}
              alt={productName}
              onError={handleImageError}
              className="max-h-[600px] w-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-center py-3 lg:py-8">
            <span className="mb-4 text-[10px] font-semibold uppercase tracking-[3px] text-[#a58a5c]">
              {product.brand || product.category || text.selected}
            </span>

            <h1 className="font-serif text-3xl font-medium leading-tight text-[#292823] sm:text-4xl">
              {productName}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(averageRating)
                        ? "fill-[#b39762] text-[#b39762]"
                        : "text-[#dedbd3]"
                    }
                  />
                ))}
              </div>

              <span className="text-xs text-[#77746d]">
                {averageRating.toFixed(1)} ({product.numReviews || 0} {text.reviews})
              </span>
            </div>

            <div className="my-6 border-y border-[#eae7df] py-5">
              <span className="font-serif text-3xl text-[#292823]">
                ${Number(product.price || 0).toFixed(2)}
              </span>
            </div>

            <p className="whitespace-pre-line text-sm leading-8 text-[#77746d]">
              {productDescription}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <PackageCheck size={18} className="text-[#a58a5c]" />

              {stock > 0 ? (
                <span className="text-xs font-medium text-[#58765b]">
                  {text.stock} ({stock} {text.available})
                </span>
              ) : (
                <span className="text-xs font-medium text-red-600">
                  {text.outOfStock}
                </span>
              )}
            </div>

            {stock > 0 && (
              <div className="mt-7">
                <label
                  htmlFor="qty"
                  className="mb-3 block text-xs font-semibold text-[#55534d]"
                >
                  {text.quantity}
                </label>

                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-28 border border-[#e5e2da] bg-[#faf9f6] px-4 py-3 text-sm text-[#292823] outline-none focus:border-[#a58a5c]"
                >
                  {Array.from(
                    { length: stock },
                    (_, index) => index + 1
                  ).map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={addToCartHandler}
              disabled={stock === 0}
              className="mt-7 flex w-full items-center justify-center gap-3 bg-[#292823] px-7 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#a58a5c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag size={17} />
              {stock > 0 ? text.addToCart : text.stockOutButton}
            </button>
          </div>
        </section>

        <section className="mt-10 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-8 border-b border-[#eae7df] pb-5">
            <span className="text-[10px] font-semibold uppercase tracking-[3px] text-[#a58a5c]">
              {text.customerFeedback}
            </span>

            <h2 className="mt-2 font-serif text-3xl text-[#292823]">
              {text.reviewsTitle}
            </h2>
          </div>

          {reviews.length === 0 ? (
            <p className="py-5 text-sm text-[#77746d]">
              {text.noReviews}
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className="border-b border-[#eae7df] pb-6 last:border-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <strong className="text-sm font-semibold text-[#292823]">
                      {review.name}
                    </strong>

                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "fill-[#b39762] text-[#b39762]"
                              : "text-[#dedbd3]"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] text-[#99958b]">
                    {new Date(review.createdAt).toLocaleDateString(
                      isArabic ? "ar-EG" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-[#77746d]">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          )}

          <div className="mt-10 border-t border-[#eae7df] pt-8">
            <h3 className="font-serif text-2xl text-[#292823]">
              {text.shareExperience}
            </h3>

            {userInfo ? (
              <form
                onSubmit={submitReviewHandler}
                className="mt-6 max-w-2xl space-y-5"
              >
                <div>
                  <label
                    htmlFor="rating"
                    className="mb-2 block text-xs font-semibold text-[#55534d]"
                  >
                    {text.yourRating}
                  </label>

                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full border border-[#e5e2da] bg-[#faf9f6] px-4 py-3 text-sm text-[#55534d] outline-none focus:border-[#a58a5c]"
                    required
                  >
                    <option value="">{text.selectRating}</option>
                    <option value="1">1 - {text.poor}</option>
                    <option value="2">2 - {text.fair}</option>
                    <option value="3">3 - {text.good}</option>
                    <option value="4">4 - {text.veryGood}</option>
                    <option value="5">5 - {text.excellent}</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="comment"
                    className="mb-2 block text-xs font-semibold text-[#55534d]"
                  >
                    {text.yourReview}
                  </label>

                  <textarea
                    id="comment"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={text.reviewPlaceholder}
                    dir={isArabic ? "rtl" : "ltr"}
                    className="w-full resize-y border border-[#e5e2da] bg-[#faf9f6] px-4 py-3 text-sm text-[#55534d] outline-none placeholder:text-[#aaa69b] focus:border-[#a58a5c]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="bg-[#292823] px-8 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#a58a5c] disabled:opacity-50"
                >
                  {reviewLoading ? text.submitting : text.submitReview}
                </button>
              </form>
            ) : (
              <p className="mt-4 text-sm text-[#77746d]">
                {text.loginMessage}{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#a58a5c] underline"
                >
                  {text.login}
                </Link>
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default ProductDetailsPage