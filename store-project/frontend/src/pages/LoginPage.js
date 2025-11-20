"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "../api/axios"
import { useNotification } from "../context/NotificationContext"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const { addNotification } = useNotification()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post("/api/users/login", { email, password })
      login(data) // Save user data and token to context and LocalStorage
      navigate("/") // Redirect to home page
    } catch (err) {
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            New Customer?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
          <p className="text-gray-600 mt-2">
            <Link to="/forgotpassword" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
