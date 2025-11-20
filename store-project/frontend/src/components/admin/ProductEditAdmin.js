"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "../../api/axios"
import { AuthContext } from "../../context/AuthContext"
import { NotificationContext } from "../../context/NotificationContext"

const ProductEditAdmin = () => {
  const { id: productId } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { userInfo } = useContext(AuthContext)
  const { showNotification } = useContext(NotificationContext)

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login")
      showNotification("Not authorized as an admin", "error")
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        const { data } = await axios.get(`/api/products/${productId}`, config)
        setName(data.name)
        setPrice(data.price)
        setImage(data.image)
        setBrand(data.brand)
        setCategory(data.category)
        setCountInStock(data.countInStock)
        setDescription(data.description)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
        setLoading(false)
        showNotification(err.response?.data?.message || err.message, "error")
      }
    }

    fetchProduct()
  }, [productId, navigate, userInfo, showNotification])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("image", file)
    setUploading(true)

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post("/api/upload", formData, config)
      setImage(data)
      setUploading(false)
      showNotification("Image uploaded successfully!", "success")
    } catch (error) {
      console.error(error)
      setUploading(false)
      showNotification(error.response?.data?.message || error.message, "error")
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      await axios.put(
        `/api/products/${productId}`,
        {
          name,
          price,
          image,
          brand,
          category,
          countInStock,
          description,
        },
        config,
      )
      showNotification("Product updated successfully!", "success")
      navigate("/admin/products") // Go back to product list
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, "error")
    }
  }

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading product...</div>
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Link to="/admin/products" className="text-blue-600 hover:underline mb-4 inline-block">
        Go Back
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>
      <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
            Image
          </label>
          <input
            type="text"
            id="image"
            placeholder="Enter image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            required
          />
          <input
            type="file"
            id="image-file"
            onChange={uploadFileHandler}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && <div className="text-blue-600 mt-2">Uploading...</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="brand" className="block text-gray-700 text-sm font-bold mb-2">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            placeholder="Enter brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="countInStock" className="block text-gray-700 text-sm font-bold mb-2">
            Count In Stock
          </label>
          <input
            type="number"
            id="countInStock"
            placeholder="Enter count in stock"
            value={countInStock}
            onChange={(e) => setCountInStock(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <input
            type="text"
            id="category"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update
        </button>
      </form>
    </div>
  )
}

export default ProductEditAdmin
