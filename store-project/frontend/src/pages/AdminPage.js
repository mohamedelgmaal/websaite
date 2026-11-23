import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Package,
  Users,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react"

import { AuthContext } from "../context/AuthContext"
import ProductListAdmin from "../components/admin/ProductListAdmin"
import UserListAdmin from "../components/admin/UserListAdmin"
import OrderListAdmin from "../components/admin/OrderListAdmin"

function AdminPage() {
  const { userInfo } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("products")

  useEffect(() => {
    if (!userInfo?.token || !userInfo?.isAdmin) {
      navigate("/", { replace: true })
    }
  }, [userInfo, navigate])

  if (!userInfo?.token || !userInfo?.isAdmin) {
    return null
  }

  const tabs = [
    {
      id: "products",
      label: "Products",
      icon: Package,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
    },
  ]

  return (
    <main className="min-h-screen bg-[#f8f7f4] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
            <LayoutDashboard size={17} />
            <span>Store Management</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your store products, customers, and orders.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          {activeTab === "products" && <ProductListAdmin />}
          {activeTab === "users" && <UserListAdmin />}
          {activeTab === "orders" && <OrderListAdmin />}
        </section>
      </div>
    </main>
  )
}

export default AdminPage