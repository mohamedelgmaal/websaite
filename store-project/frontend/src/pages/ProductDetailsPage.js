"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios, { BASE_BACKEND_URL } from "../api/axios" // New: Import BASE_BACKEND_URL
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { Star } from "lucide-react"
import { useNotification } from "../context/NotificationContext"

function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const { userInfo } = useContext(AuthContext)
  const { addNotification } = useNotification()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviewError, setReviewError] = useState("")
  const [reviewSuccess, setReviewSuccess] = useState("")
  const [reviewLoading, setReviewLoading] = useState(false)

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`)
      setProduct(data)
      setLoading(false)
    } catch (err) {
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const addToCartHandler = () => {
    addToCart(product, Number(qty))
    navigate("/cart")
  }

  const submitReviewHandler = async (e) => {
    e.preventDefault()
    setReviewError("")
    setReviewSuccess("")
    setReviewLoading(true)

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config)
      addNotification("Review added successfully!", "success")
      setRating(0)
      setComment("")
      setReviewLoading(false)
      fetchProduct()
    } catch (err) {
      setReviewLoading(false)
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
    }
  }

  // New: Construct full image path
  const imageUrl = product?.image?.startsWith("/uploads")
    ? `${BASE_BACKEND_URL}${product.image}`
    : product?.image || "/placeholder.svg"

  return (
    <div className="py-8">
      <Link to="/products" className="text-blue-600 hover:underline mb-4 inline-block">
        Go Back to Products
      </Link>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
          role="alert"
        >
          {error}
        </div>
      ) : product ? (
        <>
          <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="md:w-1/2">
              <img
                src={imageUrl || "/placeholder.svg"} // Use new imageUrl
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-700 text-lg mb-4">{product.description}</p>
              <p className="text-2xl font-semibold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
              <div className="mb-4 flex items-center">
                <span className="font-semibold mr-2">Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({product.numReviews} Reviews)</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Status: </span>
                {product.countInStock > 0 ? (
                  <span className="text-green-600">In Stock ({product.countInStock})</span>
                ) : (
                  <span className="text-red-600">Out Of Stock</span>
                )}
              </div>

              {product.countInStock > 0 && (
                <div className="mb-4 flex items-center">
                  <label htmlFor="qty" className="mr-2 font-semibold">
                    Quantity:
                  </label>
                  <select
                    id="qty"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={addToCartHandler}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ${product.countInStock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={product.countInStock === 0}
              >
                Add To Cart
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">Reviews</h2>
            {product.reviews.length === 0 && <p className="text-gray-600 mb-4">No reviews for this product yet.</p>}
            <div>
              {product.reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <strong className="mr-2">{review.name}</strong>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Add a Review</h3>
            {reviewLoading && (
              <div className="flex justify-center items-center h-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {reviewError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                {reviewError}
              </div>
            )}
            {userInfo ? (
              <form onSubmit={submitReviewHandler} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={reviewLoading}
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <p className="text-gray-600">
                Please{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  log in
                </Link>{" "}
                to add a review.
              </p>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default ProductDetailsPage
