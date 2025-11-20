"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"

function ShippingPage() {
  const { userInfo } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext)
  const navigate = useNavigate()

  // Load shipping data from localStorage if available
  const [address, setAddress] = useState(
    localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")).address : "",
  )
  const [city, setCity] = useState(
    localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")).city : "",
  )
  const [postalCode, setPostalCode] = useState(
    localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")).postalCode : "",
  )
  const [country, setCountry] = useState(
    localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")).country : "",
  )

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/shipping")
    }
    if (cartItems.length === 0) {
      navigate("/cart") // Cannot ship if cart is empty
    }
  }, [userInfo, cartItems, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    const shippingAddress = { address, city, postalCode, country }
    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress))
    navigate("/payment")
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Shipping Address</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
              Country
            </label>
            <input
              type="text"
              id="country"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  )
}

export default ShippingPage
