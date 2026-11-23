import { useState, useEffect, useCallback, useContext } from "react"
import axios from "../../api/axios"
import { AuthContext } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import {
  Trash2,
  CheckCircle,
  Users,
  ShieldCheck,
} from "lucide-react"

function UserListAdmin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState(null)

  const { userInfo } = useContext(AuthContext)
  const { addNotification } = useNotification()

  const fetchUsers = useCallback(async () => {
    if (!userInfo?.token || !userInfo?.isAdmin) {
      setUsers([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get("/api/users", config)

      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load users"

      setError(message)
      addNotification(message, "error")
    } finally {
      setLoading(false)
    }
  }, [userInfo?.token, userInfo?.isAdmin, addNotification])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const deleteHandler = async (id) => {
    if (deletingId) return

    const selectedUser = users.find((user) => user._id === id)

    if (!selectedUser || selectedUser.isAdmin) {
      addNotification("Admin accounts cannot be deleted here.", "error")
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedUser.name}?`
    )

    if (!confirmed) return

    setDeletingId(id)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.delete(`/api/users/${id}`, config)

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      )

      addNotification("User deleted successfully!", "success")
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete user"

      addNotification(message, "error")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Users size={23} className="text-gray-700" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Manage Users
          </h2>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          View registered customers and manage their accounts.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={fetchUsers}
            className="mt-4 rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-16 text-center">
          <Users
            size={38}
            className="mx-auto mb-3 text-gray-400"
          />

          <h3 className="font-semibold text-gray-800">
            No users found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Registered users will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Total users
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              {users.length}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-gray-50">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4 text-center">Role</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ID: {user._id}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            <ShieldCheck size={15} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            <CheckCircle size={15} />
                            Customer
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {user.isAdmin ? (
                          <span className="text-xs text-gray-400">
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => deleteHandler(user._id)}
                            disabled={deletingId === user._id}
                            title="Delete user"
                            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === user._id ? (
                              <span className="text-xs">
                                Deleting...
                              </span>
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default UserListAdmin