"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { AuthContext } from "../context/AuthContext"
import { useNotification } from "../context/NotificationContext"
import { PayPalButtons } from "@paypal/react-paypal-js" // New: Import PayPal components

function OrderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userInfo } = useContext(AuthContext)
  const { addNotification } = useNotification()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loadingDeliver, setLoadingDeliver] = useState(false)
  const [successDeliver, setSuccessDeliver] = useState(false)
  const [sdkReady, setSdkReady] = useState(false) // New: State for PayPal SDK

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.get(`/api/orders/${id}`, config)
      setOrder(data)
      setLoading(false)
    } catch (err) {
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login")
    } else {
      // Dynamically load PayPal SDK
      const addPayPalScript = async () => {
        try {
          const { data: clientId } = await axios.get("/api/config/paypal") // Fetch Client ID from backend
          const script = document.createElement("script")
          script.type = "text/javascript"
          script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`
          script.async = true
          script.onload = () => {
            setSdkReady(true)
          }
          script.onerror = () => {
            addNotification(
              "Failed to load PayPal SDK. Please check your internet connection or PayPal settings.",
              "error",
            )
            setSdkReady(false)
          }
          document.body.appendChild(script)
        } catch (err) {
          addNotification("Failed to fetch PayPal Client ID. Make sure it's configured in the backend.", "error")
          setSdkReady(false)
        }
      }

      if (!order || successDeliver) {
        fetchOrder()
        setSuccessDeliver(false)
      } else if (!order.isPaid && !window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [userInfo, id, navigate, order, successDeliver])

  // PayPal functions
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice.toFixed(2),
          },
        },
      ],
    })
  }

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        const { data: updatedOrder } = await axios.put(`/api/orders/${order._id}/pay`, details, config)
        setOrder(updatedOrder)
        addNotification("Payment successful!", "success")
      } catch (err) {
        addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
      }
    })
  }

  const onError = (err) => {
    addNotification(err.message || "Payment failed", "error")
  }

  const deliverHandler = async () => {
    try {
      setLoadingDeliver(true)
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      await axios.put(`/api/orders/${order._id}/deliver`, {}, config)
      setLoadingDeliver(false)
      setSuccessDeliver(true)
      addNotification("Delivery status updated successfully!", "success")
    } catch (err) {
      setLoadingDeliver(false)
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
    }
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Order: {order?._id}</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? null : order ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Shipping</h2>
            <p className="text-gray-700 mb-2">
              <strong>Name:</strong> {order.user.name}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong>{" "}
              <a href={`mailto:${order.user.email}`} className="text-blue-600 hover:underline">
                {order.user.email}
              </a>
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                Not Delivered
              </div>
            )}

            <h2 className="text-2xl font-bold mb-4 mt-6">Payment Method</h2>
            <p className="text-gray-700 mb-4">
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                Paid on {new Date(order.paidAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">Not Paid</div>
            )}

            <h2 className="text-2xl font-bold mb-4 mt-6">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <p className="text-red-500">Order is empty</p>
            ) : (
              <div>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center border-b border-gray-200 py-3 last:border-b-0">
                    <div className="w-16 h-16 mr-4 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-lg font-semibold text-gray-800 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-600">
                        {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="flex justify-between text-lg mb-2">
                <span>Items</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-lg mb-2">
                <span>Shipping</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-lg mb-2">
                <span>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </p>
            </div>
            <p className="flex justify-between text-2xl font-bold mb-6">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </p>

            {/* PayPal Button */}
            {!order.isPaid && order.paymentMethod === "PayPal" && (
              <div>
                {loading && (
                  <div className="flex justify-center items-center h-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
                {!sdkReady ? (
                  <div className="flex justify-center items-center h-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
                )}
              </div>
            )}

            {/* Deliver Button for Admin only */}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                onClick={deliverHandler}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg w-full mt-4"
                disabled={loadingDeliver}
              >
                {loadingDeliver ? "Updating..." : "Mark As Delivered"}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default OrderPage
