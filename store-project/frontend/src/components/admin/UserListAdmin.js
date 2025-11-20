"use client"

import { useState, useEffect, useContext } from "react"
import axios from "../../api/axios"
import { AuthContext } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { Trash2, CheckCircle, XCircle } from "lucide-react"

function UserListAdmin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { userInfo } = useContext(AuthContext)
  const { addNotification } = useNotification()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.get("/api/users", config)
      setUsers(data)
      setLoading(false)
    } catch (err) {
      addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers()
    }
  }, [userInfo])

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        await axios.delete(`/api/users/${id}`, config)
        fetchUsers() // Refetch users after deletion
        addNotification("User deleted successfully!", "success")
      } catch (err) {
        addNotification(err.response && err.response.data.message ? err.response.data.message : err.message, "error")
      }
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Users</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-center">Admin</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{user._id}</td>
                  <td className="py-3 px-6 text-left">{user.name}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-center">
                    {user.isAdmin ? (
                      <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      {!user.isAdmin && ( // Do not allow deleting admin from here
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="w-8 h-8 transform hover:text-red-500 hover:scale-110"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UserListAdmin
