import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer" // ✅ استدعاء الفوتر

// Existing pages
import ProfilePage from "./pages/ProfilePage"
import AdminPage from "./pages/AdminPage"
import CartPage from "./pages/CartPage"
import ShippingPage from "./pages/ShippingPage"
import PaymentPage from "./pages/PaymentPage"
import PlaceOrderPage from "./pages/PlaceOrderPage"
import OrderPage from "./pages/OrderPage"
import MyOrdersPage from "./pages/MyOrdersPage"

// New pages for "Forgot Password" functionality
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"

// Protection components
import ProtectedRoute from "./components/ProtectedRoute"
import { useEffect } from "react"
import axios from "./api/axios"

function App() {
  useEffect(() => {
    const refreshToken = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      if (!userInfo?.token) return

      try {
        const { data } = await axios.post("/api/users/refresh")
        const updatedUserInfo = { ...userInfo, token: data.token }
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo))
        console.log("✅ Token refreshed")
      } catch (error) {
        console.error("❌ Token refresh failed", error)
        localStorage.removeItem("userInfo")
        window.location.href = "/login"
      }
    }

    refreshToken()
    const interval = setInterval(refreshToken, 900000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Router>
      <Navbar />
      <main className="py-3 flex-grow">
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route path="/resetpassword/:resettoken" element={<ResetPasswordPage />} />
            {/* Protected routes for logged-in users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/myorders" element={<MyOrdersPage />} />
            </Route>
            {/* Protected routes for admin */}
            <Route element={<ProtectedRoute admin={true} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </div>
      </main>
      <Footer /> 
    </Router>
  )
}

export default App