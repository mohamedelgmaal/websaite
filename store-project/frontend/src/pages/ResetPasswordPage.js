"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { useNotification } from "../context/NotificationContext"

function ResetPasswordPage() {
  const { resettoken } = useParams()
  const navigate = useNavigate()
  const { addNotification } = useNotification()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // You can optionally validate the token here initially,
    // but the main validation will happen in the backend when submitting the form.
  }, [resettoken])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      addNotification("Passwords do not match", "warning")
      setLoading(false)
      return
    }

    try {
      const { data } = await axios.put(`/api/users/resetpassword/${resettoken}`, { password })
      addNotification(data.message, "success")
      setLoading(false)
      setTimeout(() => {
        navigate("/login") // Redirect to login page after success
      }, 3000)
    } catch (err) {
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>
        {loading && (
          <div className="flex justify-center items-center h-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
