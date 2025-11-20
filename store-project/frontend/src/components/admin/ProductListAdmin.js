"use client"

import { useState, useEffect, useContext } from "react"
import axios, { BASE_BACKEND_URL } from "../../api/axios"
import { AuthContext } from "../../context/AuthContext"
import { Trash2, Edit, PlusCircle } from "lucide-react"
import { useNotification } from "../../context/NotificationContext"

function ProductListAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { userInfo } = useContext(AuthContext)
  const { addNotification } = useNotification()

  // New: State for current page number in admin panel
  const [page, setPage] = useState(1)
  // New: State for total number of pages in admin panel
  const [pages, setPages] = useState(1)

  // State for Add/Edit Product Form
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null) // null for add, product object for edit
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
    description: "",
  })
  const [uploading, setUploading] = useState(false)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // New: Add pageNumber to fetch request
      const { data } = await axios.get(`/api/products?pageNumber=${page}`)
      setProducts(data.products) // Update products from received object
      setPage(data.page) // Update page number
      setPages(data.pages) // Update total number of pages
      setLoading(false)
    } catch (err) {
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page]) // Refetch when page number changes

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        await axios.delete(`/api/products/${id}`, config)
        fetchProducts() // Refetch products after deletion
        addNotification("Product deleted successfully!", "success")
      } catch (err) {
        addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
      }
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("image", file)
    setUploading(true)

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      const { data } = await axios.post("/api/upload", formData, config)
      setFormData((prev) => ({ ...prev, image: data }))
      setUploading(false)
      addNotification("Image uploaded successfully!", "success")
    } catch (err) {
      console.error(err)
      setUploading(false)
      addNotification("Image upload failed", "error")
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formData, config)
        addNotification("Product updated successfully!", "success")
      } else {
        await axios.post("/api/products", formData, config)
        addNotification("Product added successfully!", "success")
      }
      setShowForm(false)
      setEditingProduct(null)
      setFormData({
        name: "",
        price: 0,
        image: "",
        brand: "",
        category: "",
        countInStock: 0,
        description: "",
      })
      fetchProducts() // Refresh product list
    } catch (err) {
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
    }
  }

  const openAddForm = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      price: 0,
      image: "",
      brand: "",
      category: "",
      countInStock: 0,
      description: "",
    })
    setShowForm(true)
  }

  const openEditForm = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      category: product.category,
      countInStock: product.countInStock,
      description: product.description,
    })
    setShowForm(true)
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Products</h2>
      <button
        onClick={openAddForm}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center mb-4"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add New Product
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center">{editingProduct ? "Edit Product" : "Add Product"}</h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 pb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  placeholder="Or upload an image..."
                />
                <input
                  type="file"
                  id="image-file"
                  onChange={uploadFileHandler}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploading && (
                  <div className="flex justify-center items-center mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={
                        formData.image.startsWith("/uploads") ? `${BASE_BACKEND_URL}${formData.image}` : formData.image
                      }
                      alt="Image Preview"
                      className="w-32 h-32 object-cover rounded-md mx-auto"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Count In Stock</label>
                <input
                  type="number"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={uploading}
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Price</th>
                  <th className="py-3 px-6 text-left">Stock</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{product._id}</td>
                    <td className="py-3 px-6 text-left">{product.name}</td>
                    <td className="py-3 px-6 text-left">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-6 text-left">{product.countInStock}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button
                          onClick={() => openEditForm(product)}
                          className="w-8 h-8 mr-2 transform hover:text-blue-500 hover:scale-110"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="w-8 h-8 transform hover:text-red-500 hover:scale-110"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls for Admin Product List */}
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

export default ProductListAdmin
