import {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import axios from "../api/axios"

export const AuthContext = createContext()

const getStoredUserInfo = () => {
  try {
    const storedUserInfo = localStorage.getItem("userInfo")

    if (!storedUserInfo || storedUserInfo === "undefined") {
      return null
    }

    const parsedInfo = JSON.parse(storedUserInfo)

    if (!parsedInfo?.token) {
      localStorage.removeItem("userInfo")
      return null
    }

    return parsedInfo
  } catch (error) {
    console.error("Failed to read user info:", error)

    localStorage.removeItem("userInfo")
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(getStoredUserInfo)

  const login = useCallback((data) => {
    if (!data?.token) {
      console.error("Login response does not contain a token")
      return
    }

    try {
      localStorage.setItem("userInfo", JSON.stringify(data))
      setUserInfo(data)
    } catch (error) {
      console.error("Failed to save user info:", error)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("userInfo")
    setUserInfo(null)
  }, [])

  useEffect(() => {
    if (!userInfo?.token) return

    let isActive = true

    const refreshToken = async () => {
      try {
        const { data } = await axios.post("/api/users/refreshtoken")

        if (!isActive || !data?.token) return

        const currentStoredInfo = localStorage.getItem("userInfo")

        if (!currentStoredInfo) return

        const currentUserInfo = JSON.parse(currentStoredInfo)

        if (currentUserInfo?.token !== userInfo.token) return

        const updatedUserInfo = {
          ...currentUserInfo,
          token: data.token,
        }

        localStorage.setItem(
          "userInfo",
          JSON.stringify(updatedUserInfo)
        )

        setUserInfo(updatedUserInfo)
      } catch (error) {
        console.error("Token refresh failed:", error)

        if (
          isActive &&
          (error.response?.status === 401 ||
            error.response?.status === 403)
        ) {
          logout()
        }
      }
    }

    const interval = setInterval(
      refreshToken,
      15 * 60 * 1000
    )

    return () => {
      isActive = false
      clearInterval(interval)
    }
  }, [userInfo?.token, logout])

  return (
    <AuthContext.Provider
      value={{ userInfo, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}