import { useState, useEffect, useContext, useCallback } from "react"
import axios, { BASE_BACKEND_URL } from "../../api/axios"
import { AuthContext } from "../../context/AuthContext"
import {
  Trash2,
  Edit,
  PlusCircle,
  X,
  Package,
  Upload,
  Image as ImageIcon,
} from "lucide-react"
import { useNotification } from "../../context/NotificationContext"

const initialFormData = {
  name: "",
  nameAr: "",
  price: "",
  image: "",
  brand: "",
  category: "",
  countInStock: "",
  description: "",
  descriptionAr: "",
}

const getImageUrl = (image) => {
  if (!image) return "/placeholder.svg"

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return image
  }

  if (image.startsWith("/uploads")) {
    return `${BASE_BACKEND_URL}${image}`
  }

  return image
}

function ProductListAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(initialFormData)

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const { userInfo } = useContext(AuthContext)
  const { addNotification } = useNotification()

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const { data } = await axios.get(
        `/api/products?pageNumber=${page}`
      )

      setProducts(Array.isArray(data.products) ? data.products : [])
      setPages(Math.max(1, Number(data.pages) || 1))
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load products"

      setError(message)
      addNotification(message, "error")
    } finally {
      setLoading(false)
    }
  }, [page, addNotification])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const resetForm = () => {
    setFormData(initialFormData)
    setEditingProduct(null)
    setShowForm(false)
  }

  const openAddForm = () => {
    setEditingProduct(null)
    setFormData(initialFormData)
    setShowForm(true)
  }

  const openEditForm = (product) => {
    setEditingProduct(product)

    setFormData({
      name: product.name || "",
      nameAr: product.nameAr || "",
      price: product.price ?? "",
      image: product.image || "",
      brand: product.brand || "",
      category: product.category || "",
      countInStock: product.countInStock ?? "",
      description: product.description || "",
      descriptionAr: product.descriptionAr || "",
    })

    setShowForm(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      addNotification("Please select a valid image file", "error")
      e.target.value = ""
      return
    }

    const uploadData = new FormData()
    uploadData.append("image", file)

    setUploading(true)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(
        "/api/upload",
        uploadData,
        config
      )

      const imagePath =
        typeof data === "string" ? data : data?.image || data?.url

      if (!imagePath) {
        throw new Error("The server did not return an image path")
      }

      setFormData((prev) => ({
        ...prev,
        image: imagePath,
      }))

      addNotification("Image uploaded successfully!", "success")
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Image upload failed"

      addNotification(message, "error")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (saving || uploading) return

    const price = Number(formData.price)
    const countInStock = Number(formData.countInStock)

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(countInStock) ||
      countInStock < 0
    ) {
      addNotification(
        "Please enter a valid price and stock quantity",
        "error"
      )
      return
    }

    const productData = {
      ...formData,
      name: formData.name.trim(),
      nameAr: formData.nameAr.trim(),
      brand: formData.brand.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      descriptionAr: formData.descriptionAr.trim(),
      price,
      countInStock,
    }

    if (
      !productData.name ||
      !productData.brand ||
      !productData.category ||
      !productData.description
    ) {
      addNotification("Please complete all required English fields", "error")
      return
    }

    setSaving(true)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      if (editingProduct) {
        await axios.put(
          `/api/products/${editingProduct._id}`,
          productData,
          config
        )

        addNotification("Product updated successfully!", "success")
      } else {
        await axios.post(
          "/api/products",
          productData,
          config
        )

        addNotification("Product added successfully!", "success")
        setPage(1)
      }

      resetForm()

      if (page === 1 || editingProduct) {
        await fetchProducts()
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to save product"

      addNotification(message, "error")
    } finally {
      setSaving(false)
    }
  }

  const deleteHandler = async (id) => {
    if (deletingId) return

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    )

    if (!confirmed) return

    setDeletingId(id)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.delete(`/api/products/${id}`, config)

      addNotification("Product deleted successfully!", "success")

      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
      } else {
        await fetchProducts()
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete product"

      addNotification(message, "error")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="text-gray-700" size={23} />
            <h2 className="text-2xl font-semibold text-gray-900">
              Manage Products
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Add, edit, and manage your store products.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          <PlusCircle size={18} />
          Add New Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={resetForm}
              disabled={saving || uploading}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              aria-label="Close form"
            >
              <X size={21} />
            </button>

            <h3 className="mb-6 pr-10 text-2xl font-semibold text-gray-900">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name (English)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  maxLength={120}
                  dir="ltr"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left outline-none transition focus:border-gray-900"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  اسم المنتج (بالعربية)
                </label>
                <input
                  type="text"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleFormChange}
                  maxLength={120}
                  dir="rtl"
                  lang="ar"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right outline-none transition focus:border-gray-900"
                  placeholder="اكتب اسم المنتج بالعربية"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleFormChange}
                    min="0"
                    step="1"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Image
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  className="mb-3 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                  placeholder="Enter image path or upload an image"
                />

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-4 text-sm font-medium text-gray-600 transition hover:border-gray-900 hover:bg-gray-50">
                  <Upload size={18} />
                  {uploading ? "Uploading..." : "Choose Image to Upload"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadFileHandler}
                    disabled={uploading || saving}
                    className="hidden"
                  />
                </label>

                {uploading && (
                  <p className="mt-2 text-center text-sm text-gray-500">
                    Please wait while your image is uploading...
                  </p>
                )}

                <div className="mt-4 flex justify-center">
                  {formData.image ? (
                    <img
                      src={getImageUrl(formData.image)}
                      alt="Product preview"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                      className="h-36 w-36 rounded-lg border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 text-gray-400">
                      <ImageIcon size={30} />
                      <span className="text-xs">Image Preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="Enter brand"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="e.g. Men, Women, Kids"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description (English)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                  required
                  dir="ltr"
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-left outline-none focus:border-gray-900"
                  placeholder="Describe the product..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  وصف المنتج (بالعربية)
                </label>
                <textarea
                  name="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={handleFormChange}
                  rows={4}
                  dir="rtl"
                  lang="ar"
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right outline-none focus:border-gray-900"
                  placeholder="اكتب وصف المنتج بالعربية..."
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving || uploading}
                  className="flex-1 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : uploading
                      ? "Uploading image..."
                      : editingProduct
                        ? "Update Product"
                        : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={fetchProducts}
            className="mt-4 rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-16 text-center">
          <Package className="mx-auto mb-3 text-gray-400" size={38} />
          <h3 className="font-semibold text-gray-800">
            No products found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first product to get started.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-gray-50">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                            className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                          />

                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            {product.nameAr && (
                              <p
                                className="mt-1 text-sm text-gray-600"
                                dir="rtl"
                              >
                                {product.nameAr}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                              {product.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        ${Number(product.price || 0).toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {product.countInStock}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            title="Edit product"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteHandler(product._id)}
                            disabled={deletingId === product._id}
                            title="Delete product"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: pages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      pageNumber === page
                        ? "bg-gray-900 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(pages, prev + 1))
                }
                disabled={page === pages}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductListAdmin