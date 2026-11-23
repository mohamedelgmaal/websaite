import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

function ProtectedRoute({ admin = false }) {
  const { userInfo } = useContext(AuthContext)
  const location = useLocation()

  const isAuthenticated = Boolean(userInfo?.token)
  const isAdmin = Boolean(userInfo?.isAdmin)

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  if (admin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute