"use client"

import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

function ProtectedRoute({ admin }) {
  const { userInfo } = useContext(AuthContext)

  if (!userInfo) {
    return <Navigate to="/login" replace />
  }

  if (admin && !userInfo.isAdmin) {
    return <Navigate to="/" replace /> // Or 403 Forbidden page
  }

  return <Outlet />
}

export default ProtectedRoute
