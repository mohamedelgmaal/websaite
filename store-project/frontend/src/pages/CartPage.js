"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { Trash2 } from "lucide-react"

function CartPage() {
  const { cartItems, addToCart, removeFromCart, clearCart, totalPrice } = useContext(CartContext)
  const navigate = useNavigate()

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping") // Redirect to login then shipping
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          Your cart is empty.{" "}
          <Link to="/products" className="text-blue-600 hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                <div className="w-20 h-20 mr-4 flex-shrink-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <Link to={`/product/${item._id}`} className="text-xl font-semibold text-gray-800 hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <select
                    value={item.qty}
                    onChange={(e) => addToCart(item, Number(e.target.value))}
                    className="border border-gray-300 rounded-md p-2 mr-4"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Clear Cart
            </button>
          </div>

          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="flex justify-between text-lg mb-2">
                <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                <span>${cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-lg mb-2">
                <span>Shipping</span>
                <span>
                  $
                  {(
                    totalPrice -
                    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) -
                    0.15 * cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
                  ).toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between text-lg mb-2">
                <span>Tax</span>
                <span>${(0.15 * cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)).toFixed(2)}</span>
              </p>
            </div>
            <p className="flex justify-between text-2xl font-bold mb-6">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </p>
            <button
              onClick={checkoutHandler}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 w-full"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
