"use client"

import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import axios from "../api/axios"
import { useNotification } from "../context/NotificationContext"

function PlaceOrderPage() {
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useContext(CartContext)
  const { userInfo } = useContext(AuthContext)
  const navigate = useNavigate()
  const { addNotification } = useNotification()

  const [shippingAddress, setShippingAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/placeorder")
    }
    if (cartItems.length === 0) {
      navigate("/cart")
    }

    const storedShippingAddress = localStorage.getItem("shippingAddress")
    const storedPaymentMethod = localStorage.getItem("paymentMethod")

    if (!storedShippingAddress) {
      navigate("/shipping")
    } else {
      setShippingAddress(JSON.parse(storedShippingAddress))
    }

    if (!storedPaymentMethod) {
      navigate("/payment")
    } else {
      setPaymentMethod(JSON.parse(storedPaymentMethod))
    }
  }, [userInfo, cartItems, navigate])

  const placeOrderHandler = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        },
        config,
      )

      setLoading(false)
      clearCart() // Clear cart after successful order
      localStorage.removeItem("shippingAddress")
      localStorage.removeItem("paymentMethod")
      navigate(`/order/${data._id}`) // Redirect to order details page
    } catch (err) {
      setLoading(false)
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
    }
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Place Order</h1>
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Shipping</h2>
          {shippingAddress ? (
            <p className="text-gray-700 mb-4">
              <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode},{" "}
              {shippingAddress.country}
            </p>
          ) : (
            <p className="text-red-500">
              Shipping address not set.{" "}
              <Link to="/shipping" className="text-blue-600 hover:underline">
                Add shipping address
              </Link>
            </p>
          )}

          <h2 className="text-2xl font-bold mb-4 mt-6">Payment Method</h2>
          {paymentMethod ? (
            <p className="text-gray-700 mb-4">
              <strong>Method:</strong> {paymentMethod}
            </p>
          ) : (
            <p className="text-red-500">
              Payment method not set.{" "}
              <Link to="/payment" className="text-blue-600 hover:underline">
                Choose payment method
              </Link>
            </p>
          )}

          <h2 className="text-2xl font-bold mb-4 mt-6">Order Items</h2>
          {cartItems.length === 0 ? (
            <p className="text-red-500">
              Your cart is empty.{" "}
              <Link to="/products" className="text-blue-600 hover:underline">
                Start Shopping
              </Link>
            </p>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center border-b border-gray-200 py-3 last:border-b-0">
                  <div className="w-16 h-16 mr-4 flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <Link to={`/product/${item._id}`} className="text-lg font-semibold text-gray-800 hover:underline">
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
              <span>${itemsPrice.toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-lg mb-2">
              <span>Shipping</span>
              <span>${shippingPrice.toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-lg mb-2">
              <span>Tax</span>
              <span>${taxPrice.toFixed(2)}</span>
            </p>
          </div>
          <p className="flex justify-between text-2xl font-bold mb-6">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </p>
          <button
            onClick={placeOrderHandler}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 w-full"
            disabled={cartItems.length === 0 || !shippingAddress || !paymentMethod || loading}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrderPage
