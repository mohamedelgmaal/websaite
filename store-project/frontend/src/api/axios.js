import axios from "axios"

export const BASE_BACKEND_URL = "http://localhost:5000"

const instance = axios.create({
  baseURL: BASE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

instance.interceptors.request.use(
  (config) => {
    try {
      const userInfo = localStorage.getItem("userInfo")

      if (userInfo && userInfo !== "undefined") {
        const parsedInfo = JSON.parse(userInfo)

        if (parsedInfo?.token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${parsedInfo.token}`
        }
      }
    } catch (error) {
      console.error("Failed to read authentication token:", error)
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default instance