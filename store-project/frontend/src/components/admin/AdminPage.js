"use client"

import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import ProductListAdmin from "../components/admin/ProductListAdmin"
import UserListAdmin from "../components/admin/UserListAdmin"
import OrderListAdmin from "../components/admin/OrderListAdmin" // جديد: استيراد OrderListAdmin

function AdminPage() {
  const { userInfo } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("products") // 'products', 'users', 'orders'

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login") // أو توجيه إلى صفحة 403 Forbidden
    }
  }, [userInfo, navigate])

  if (!userInfo || !userInfo.isAdmin) {
    return null // أو عرض رسالة "غير مصرح لك"
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">لوحة تحكم الأدمن</h1>
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-3 rounded-l-lg font-semibold ${activeTab === "products" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          onClick={() => setActiveTab("products")}
        >
          إدارة المنتجات
        </button>
        <button
          className={`px-6 py-3 font-semibold ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          onClick={() => setActiveTab("users")}
        >
          إدارة المستخدمين
        </button>
        <button
          className={`px-6 py-3 rounded-r-lg font-semibold ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          onClick={() => setActiveTab("orders")}
        >
          إدارة الطلبات
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === "products" && <ProductListAdmin />}
        {activeTab === "users" && <UserListAdmin />}
        {activeTab === "orders" && <OrderListAdmin />} {/* جديد: عرض OrderListAdmin */}
      </div>
    </div>
  )
}

export default AdminPage
