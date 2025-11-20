import { Link } from "react-router-dom"
import { BASE_BACKEND_URL } from "../api/axios" // New: Import BASE_BACKEND_URL

function ProductCard({ product }) {
  // New: Construct full image path
  const imageUrl = product.image.startsWith("/uploads")
    ? `${BASE_BACKEND_URL}${product.image}`
    : product.image || "/placeholder.svg"

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product._id}`}>
        <img src={imageUrl || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">
            {product.rating} Stars ({product.numReviews} Reviews)
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
