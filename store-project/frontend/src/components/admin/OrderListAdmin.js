"use client"

import { useState, useEffect, useContext } from "react"
import axios from "../../api/axios"
import { AuthContext } from "../../context/AuthContext"
import { Truck } from "lucide-react"
import { Link } from "react-router-dom"
import { useNotification } from "../../context/NotificationContext"

function OrderListAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { userInfo } = useContext(AuthContext)
  const { addNotification } = useNotification()

  const [filterUserEmail, setFilterUserEmail] = useState("")
  const [filterIsDelivered, setFilterIsDelivered] = useState("all")
  const [filterStartDate, setFilterStartDate] = useState("") // New: State for start date filter
  const [filterEndDate, setFilterEndDate] = useState("") // New: State for end date filter
  const [loadingDeliver, setLoadingDeliver] = useState(false)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      let url = "/api/orders?"
      if (filterUserEmail) {
        url += `userEmail=${filterUserEmail}&`
      }
      if (filterIsDelivered !== "all") {
        url += `isDelivered=${filterIsDelivered}&`
      }
      if (filterStartDate) {
        // New: Add start date to URL
        url += `startDate=${filterStartDate}&`
      }
      if (filterEndDate) {
        // New: Add end date to URL
        url += `endDate=${filterEndDate}&`
      }

      const { data } = await axios.get(url, config)
      setOrders(data)
      setLoading(false)
    } catch (err) {
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchOrders()
    }
  }, [userInfo, filterUserEmail, filterIsDelivered, filterStartDate, filterEndDate, loadingDeliver]) // Add date filters to dependency array

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    fetchOrders()
  }

  const handleClearFilters = () => {
    setFilterUserEmail("")
    setFilterIsDelivered("all")
    setFilterStartDate("") // Clear start date
    setFilterEndDate("") // Clear end date
  }

  const deliverHandler = async (orderId) => {
    if (window.confirm("Are you sure you want to mark this order as 'Delivered'?")) {
      try {
        setLoadingDeliver(true)
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        await axios.put(`/api/orders/${orderId}/deliver`, {}, config)
        setLoadingDeliver(false)
        addNotification("Delivery status updated successfully!", "success")
        fetchOrders()
      } catch (err) {
        setLoadingDeliver(false)
        addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
      }
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Orders</h2>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {" "}
          {/* Changed to 4 columns */}
          <div>
            <label htmlFor="userEmailFilter" className="block text-gray-700 text-sm font-bold mb-2">
              Search by User Email:
            </label>
            <input
              type="email"
              id="userEmailFilter"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter user email"
              value={filterUserEmail}
              onChange={(e) => setFilterUserEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="deliveryStatusFilter" className="block text-gray-700 text-sm font-bold mb-2">
              Delivery Status:
            </label>
            <select
              id="deliveryStatusFilter"
              value={filterIsDelivered}
              onChange={(e) => setFilterIsDelivered(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="all">All</option>
              <option value="true">Delivered</option>
              <option value="false">Not Delivered</option>
            </select>
          </div>
          {/* New: Date filters */}
          <div>
            <label htmlFor="startDateFilter" className="block text-gray-700 text-sm font-bold mb-2">
              From Date:
            </label>
            <input
              type="date"
              id="startDateFilter"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDateFilter" className="block text-gray-700 text-sm font-bold mb-2">
              To Date:
            </label>
            <input
              type="date"
              id="endDateFilter"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 col-span-full md:col-span-2">
            {" "}
            {/* Make buttons span across columns */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-grow"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-grow"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {loading || loadingDeliver ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">User</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Total</th>
                <th className="py-3 px-6 text-center">Paid</th>
                <th className="py-3 px-6 text-center">Delivered</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{order._id}</td>
                  <td className="py-3 px-6 text-left">{order.user ? order.user.name : "N/A"}</td>
                  <td className="py-3 px-6 text-left">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-left">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-6 text-center">
                    {order.isPaid ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {order.isDelivered ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Delivered
                      </span>
                    ) : order.isPaid ? ( // New: Pending status if paid but not delivered
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Not Delivered
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <Link to={`/order/${order._id}`} className="text-blue-600 hover:underline">
                        View
                      </Link>
                      {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <button
                          onClick={() => deliverHandler(order._id)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Mark as Delivered"
                          disabled={loadingDeliver}
                        >
                          <Truck className="w-5 h-5" />
                        </button>
                      )}
                    </div>
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

export default OrderListAdmin
