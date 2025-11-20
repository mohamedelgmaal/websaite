"use client"

import { useState, useEffect } from "react"
import axios from "../api/axios"
import ProductCard from "../components/ProductCard"
import { Search } from "lucide-react"
import { useNotification } from "../context/NotificationContext"

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const { addNotification } = useNotification()

  const categories = ["Electronics", "Audio", "Wearables", "Accessories", "Smart Home"]
  const brands = ["Apple", "Sony", "Samsung", "Logitech", "Amazon"]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError("")
        let url = `/api/products?pageNumber=${page}&`
        if (keyword) url += `keyword=${keyword}&`
        if (category) url += `category=${category}&`
        if (brand) url += `brand=${brand}&`

        const { data } = await axios.get(url)
        setProducts(data.products)
        setPage(data.page)
        setPages(data.pages)
        setLoading(false)
      } catch (err) {
        addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
        setLoading(false)
      }
    }
    fetchProducts()
  }, [keyword, category, brand, page, addNotification])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
  }

  const handleClearFilters = () => {
    setKeyword("")
    setCategory("")
    setBrand("")
    setPage(1)
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="category-filter" className="block text-gray-700 text-sm font-bold mb-2">
              Category:
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="brand-filter" className="block text-gray-700 text-sm font-bold mb-2">
              Brand:
            </label>
            <select
              id="brand-filter"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 text-xl">No products matching your search criteria.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setPage(x + 1)}
                  className={`px-4 py-2 rounded-md font-semibold ${
                    x + 1 === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductsPage
