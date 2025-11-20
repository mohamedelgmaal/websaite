"use client"

import { createContext, useState, useEffect } from "react"
import axios from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null)

  const login = (data) => {
    setUserInfo(data)
    localStorage.setItem("userInfo", JSON.stringify(data))
  }

  const logout = () => {
    setUserInfo(null)
    localStorage.removeItem("userInfo")
  }

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo")

    // ✅ تحقق إن القيمة مش undefined أو null قبل التحويل
    if (storedUserInfo && storedUserInfo !== "undefined") {
      try {
        const parsedInfo = JSON.parse(storedUserInfo)
        setUserInfo(parsedInfo)

        const refreshToken = async () => {
          try {
            const { data } = await axios.post("/api/users/refresh")
            const updatedUserInfo = { ...parsedInfo, token: data.token }

            setUserInfo(updatedUserInfo)
            localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo))
            console.log("✅ Token refreshed (AuthContext)")
          } catch (error) {
            console.error("❌ Token refresh failed (AuthContext):", error)
            logout()
          }
        }

        refreshToken()
        const interval = setInterval(refreshToken, 15 * 60 * 1000) // كل 15 دقيقة
        return () => clearInterval(interval)

      } catch (error) {
        console.error("⚠ Failed to parse user info:", error)
        localStorage.removeItem("userInfo")
        logout()
      }
    } else {
      // في حال مفيش بيانات مستخدم
      logout()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}