import { useContext } from "react"
import { Link } from "react-router-dom"
import { BASE_BACKEND_URL } from "../api/axios"
import { LanguageContext } from "../context/LanguageContext"
import { Star, ArrowUpRight } from "lucide-react"

function ProductCard({ product }) {
  const { language } = useContext(LanguageContext)
  const isArabic = language === "ar"

  const productName =
    isArabic && product.nameAr?.trim()
      ? product.nameAr
      : product.name

  const imageUrl = product.image?.startsWith("/uploads")
    ? `${BASE_BACKEND_URL}${product.image}`
    : product.image || "/placeholder.svg"

  const rating = Number(product.rating || 0)

  const handleImageError = (e) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = "/placeholder.svg"
  }

  return (
    <article className="premium-product-card">
      <Link
        to={`/product/${product._id}`}
        className="product-image-wrap"
      >
        <img
          src={imageUrl}
          alt={productName}
          loading="lazy"
          onError={handleImageError}
        />

        <span className="product-quick-view">
          <ArrowUpRight size={18} />
        </span>
      </Link>

      <div className="product-card-info">
        <div className="product-card-topline">
          <span>{product.brand || (isArabic ? "مختار لك" : "SELECTED FOR YOU")}</span>

          <span className="product-rating">
            <Star size={12} fill="currentColor" />
            {rating.toFixed(1)}
          </span>
        </div>

        <Link
          to={`/product/${product._id}`}
          className="product-card-name"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {productName}
        </Link>

        <div className="product-card-bottom">
          <strong>
            ${Number(product.price || 0).toFixed(2)}
          </strong>

          <span>
            {product.numReviews || 0} {isArabic ? "تقييم" : "reviews"}
          </span>
        </div>
      </div>
    </article>
  )
}

export default ProductCard