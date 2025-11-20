"use client"

import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import ProductListAdmin from "../components/admin/ProductListAdmin"
import UserListAdmin from "../components/admin/UserListAdmin"
import OrderListAdmin from "../components/admin/OrderListAdmin" // New: Import OrderListAdmin

function AdminPage() {
  const { userInfo } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("products") // 'products', 'users', 'orders'

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login") // Or redirect to 403 Forbidden page
    }
  }, [userInfo, navigate])

  if (!userInfo || !userInfo.isAdmin) {
    return null // Or display "Not authorized" message
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Panel</h1>
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-3 rounded-l-lg font-semibold ${activeTab === "products" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          onClick={() => setActiveTab("products")}
        >
          Manage Products
        </button>
        <button
          className={`px-6 py-3 font-semibold ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </button>
        <button
          className={`px-6 py-3 rounded-r-lg font-semibold ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          onClick={() => setActiveTab("orders")}
        >
          Manage Orders
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === "products" && <ProductListAdmin />}
        {activeTab === "users" && <UserListAdmin />}
        {activeTab === "orders" && <OrderListAdmin />} {/* New: Display OrderListAdmin */}
      </div>
    </div>
  )
}

export default AdminPage
