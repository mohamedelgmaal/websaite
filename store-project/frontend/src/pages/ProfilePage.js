"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNotification } from "../context/NotificationContext"
import axios from "../api/axios"

function ProfilePage() {
  const { userInfo, login } = useContext(AuthContext)
  const { addNotification } = useNotification()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    if (!userInfo) {
      addNotification("Please log in to view your profile.", "error")
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        const { data } = await axios.get("/api/users/profile", config)
        setName(data.name)
        setEmail(data.email)
        setLoading(false)
      } catch (err) {
        addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
        setLoading(false)
      }
    }
    fetchProfile()
  }, [userInfo])

  const submitHandler = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      addNotification("Passwords do not match", "warning")
      return
    }

    try {
      setUpdateLoading(true)
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.put("/api/users/profile", { name, email, password }, config)
      login(data)
      setName(data.name)
      setEmail(data.email)
      addNotification("Profile updated successfully!", "success")
      setPassword("")
      setConfirmPassword("")
      setUpdateLoading(false)
    } catch (err) {
      setUpdateLoading(false)
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
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
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={updateLoading}
            >
              {updateLoading ? "Updating Profile..." : "Update Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
