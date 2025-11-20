"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext"

function PaymentPage() {
  const { userInfo } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext)
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState("PayPal") // Default

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/payment")
    }
    if (cartItems.length === 0) {
      navigate("/cart")
    }
    if (!localStorage.getItem("shippingAddress")) {
      navigate("/shipping") // Shipping address must be entered first
    }
  }, [userInfo, cartItems, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    localStorage.setItem("paymentMethod", JSON.stringify(paymentMethod))
    navigate("/placeorder")
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Payment Method</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <label htmlFor="paypal" className="ml-2 text-gray-700">
              PayPal or Credit Card
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="stripe"
              name="paymentMethod"
              value="Stripe"
              checked={paymentMethod === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <label htmlFor="stripe" className="ml-2 text-gray-700">
              Stripe (Experimental)
            </label>
          </div>
          {/* You can add more payment options here */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default PaymentPage
