"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { AuthContext } from "../context/AuthContext"
import { CheckCircle, XCircle } from "lucide-react"
import { useNotification } from "../context/NotificationContext"

function MyOrdersPage() {
  const navigate = useNavigate()
  const { userInfo } = useContext(AuthContext)
  const { addNotification } = useNotification()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState("") // Removed error state

  useEffect(() => {
    if (!userInfo) {
      navigate("/login")
    } else {
      const fetchMyOrders = async () => {
        try {
          setLoading(true)
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
          const { data } = await axios.get("/api/orders/myorders", config)
          setOrders(data)
          setLoading(false)
        } catch (err) {
          addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error") // Replaced setError with addNotification
          setLoading(false)
        }
      }
      fetchMyOrders()
    }
  }, [userInfo, navigate, addNotification])

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">My Orders</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        /*error ? ( // Removed error block
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
          role="alert"
        >
          {error}
        </div>
      ) :*/ <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Total</th>
                <th className="py-3 px-6 text-center">Paid</th>
                <th className="py-3 px-6 text-center">Delivered</th>
                <th className="py-3 px-6 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{order._id}</td>
                  <td className="py-3 px-6 text-left">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-left">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-6 text-center">
                    {order.isPaid ? (
                      <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {order.isDelivered ? (
                      <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Link to={`/order/${order._id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage
