import { useState, useEffect, useCallback, useContext } from "react"
import axios from "../../api/axios"
import { AuthContext } from "../../context/AuthContext"
import { Truck, ShoppingBag, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"
import { useNotification } from "../../context/NotificationContext"

const initialFilters = {
  userEmail: "",
  isDelivered: "all",
  startDate: "",
  endDate: "",
}

function OrderListAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loadingDeliver, setLoadingDeliver] = useState(false)
  const [deliveringOrderId, setDeliveringOrderId] = useState(null)

  const [filters, setFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)

  const { userInfo } = useContext(AuthContext)
  const { addNotification } = useNotification()

  const fetchOrders = useCallback(async () => {
    if (!userInfo?.token || !userInfo?.isAdmin) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")

      const params = new URLSearchParams()

      if (appliedFilters.userEmail.trim()) {
        params.set("userEmail", appliedFilters.userEmail.trim())
      }

      if (appliedFilters.isDelivered !== "all") {
        params.set("isDelivered", appliedFilters.isDelivered)
      }

      if (appliedFilters.startDate) {
        params.set("startDate", appliedFilters.startDate)
      }

      if (appliedFilters.endDate) {
        params.set("endDate", appliedFilters.endDate)
      }

      const queryString = params.toString()
      const url = queryString
        ? `/api/orders?${queryString}`
        : "/api/orders"

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(url, config)

      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load orders"

      setError(message)
      addNotification(message, "error")
    } finally {
      setLoading(false)
    }
  }, [
    userInfo?.token,
    userInfo?.isAdmin,
    appliedFilters,
    addNotification,
  ])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()

    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    ) {
      addNotification(
        "The end date must be after the start date.",
        "error"
      )
      return
    }

    setAppliedFilters({ ...filters })
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
    setAppliedFilters(initialFilters)
  }

  const deliverHandler = async (orderId) => {
    if (loadingDeliver) return

    const confirmed = window.confirm(
      "Are you sure you want to mark this order as Delivered?"
    )

    if (!confirmed) return

    setLoadingDeliver(true)
    setDeliveringOrderId(orderId)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.put(
        `/api/orders/${orderId}/deliver`,
        {},
        config
      )

      addNotification(
        "Delivery status updated successfully!",
        "success"
      )

      await fetchOrders()
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update delivery status"

      addNotification(message, "error")
    } finally {
      setLoadingDeliver(false)
      setDeliveringOrderId(null)
    }
  }

  const formatDate = (date) => {
    if (!date) return "N/A"

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A"
    }

    return parsedDate.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag size={23} className="text-gray-700" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Manage Orders
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Review orders, track payments, and manage deliveries.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading || loadingDeliver}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
        <h3 className="mb-4 font-semibold text-gray-900">
          Filter Orders
        </h3>

        <form
          onSubmit={handleFilterSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label
              htmlFor="userEmailFilter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Customer Email
            </label>

            <input
              type="email"
              id="userEmailFilter"
              name="userEmail"
              value={filters.userEmail}
              onChange={handleFilterChange}
              placeholder="Enter customer email"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="deliveryStatusFilter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Delivery Status
            </label>

            <select
              id="deliveryStatusFilter"
              name="isDelivered"
              value={filters.isDelivered}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-gray-900"
            >
              <option value="all">All Orders</option>
              <option value="true">Delivered</option>
              <option value="false">Not Delivered</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="startDateFilter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              From Date
            </label>

            <input
              type="date"
              id="startDateFilter"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="endDateFilter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              To Date
            </label>

            <input
              type="date"
              id="endDateFilter"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              min={filters.startDate || undefined}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-gray-900"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-4 sm:flex-row">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={fetchOrders}
            className="mt-4 rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-16 text-center">
          <ShoppingBag
            size={38}
            className="mx-auto mb-3 text-gray-400"
          />

          <h3 className="font-semibold text-gray-800">
            No orders found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your filters or check again later.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Orders found
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              {orders.length}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-gray-50">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4 text-center">Payment</th>
                    <th className="px-5 py-4 text-center">Delivery</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <span className="font-medium text-gray-800">
                          {order._id}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.user?.name || "N/A"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {order.user?.email || ""}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-900">
                        ${Number(order.totalPrice || 0).toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {order.isPaid ? (
                          <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                            Not Paid
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {order.isDelivered ? (
                          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            Delivered
                          </span>
                        ) : order.isPaid ? (
                          <span className="inline-flex rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            Not Delivered
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/order/${order._id}`}
                            className="text-sm font-semibold text-gray-700 underline-offset-4 hover:text-black hover:underline"
                          >
                            View
                          </Link>

                          {order.isPaid && !order.isDelivered && (
                            <button
                              type="button"
                              onClick={() => deliverHandler(order._id)}
                              disabled={loadingDeliver}
                              title="Mark as Delivered"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-purple-50 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {deliveringOrderId === order._id ? (
                                <span className="text-xs">
                                  Updating...
                                </span>
                              ) : (
                                <Truck size={19} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default OrderListAdmin