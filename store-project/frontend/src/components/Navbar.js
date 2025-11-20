"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext" // New: Import CartContext
import { ShoppingCart, User, ListOrdered } from "lucide-react" // New: ListOrdered icon

function Navbar() {
  const { userInfo, logout } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext) // New: Get cart items
  const navigate = useNavigate()

  const logoutHandler = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          E-commerce Store
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/cart" className="flex items-center hover:text-gray-300 relative">
                <ShoppingCart className="h-5 w-5 mr-1" />
                Cart
                {cartItems.length > 0 && ( // New: Display number of items in cart
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                )}
              </Link>
            </li>
            {userInfo ? (
              <li className="relative group">
                <span className="flex items-center cursor-pointer hover:text-gray-300">
                  <User className="h-5 w-5 mr-1" />
                  {userInfo.name}
                </span>
                <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200 invisible z-10">
                  <li>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/myorders" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <ListOrdered className="h-4 w-4 mr-2" />
                      My Orders
                    </Link>
                  </li>
                  {userInfo.isAdmin && (
                    <li>
                      <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={logoutHandler} className="block w-full text-right px-4 py-2 hover:bg-gray-100">
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li>
                <Link to="/login" className="flex items-center hover:text-gray-300">
                  <User className="h-5 w-5 mr-1" />
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
