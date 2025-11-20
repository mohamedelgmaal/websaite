import axios from "axios"

// Base URL for the backend server
// Make sure this is the URL of your Node.js server
export const BASE_BACKEND_URL = "http://localhost:5000"

// Create an Axios instance with default settings
const instance = axios.create({
  baseURL: BASE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add an interceptor to send the token with every request if the user is logged in
instance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      const { token } = JSON.parse(userInfo)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default instance
