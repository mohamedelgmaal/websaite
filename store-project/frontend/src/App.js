import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import ProfilePage from "./pages/ProfilePage"
import AdminPage from "./pages/AdminPage"
import CartPage from "./pages/CartPage"
import ShippingPage from "./pages/ShippingPage"
import PaymentPage from "./pages/PaymentPage"
import PlaceOrderPage from "./pages/PlaceOrderPage"
import OrderPage from "./pages/OrderPage"
import MyOrdersPage from "./pages/MyOrdersPage"

import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"

import ProtectedRoute from "./components/ProtectedRoute"

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-sm tracking-[0.25em] uppercase text-[#927b5b] mb-3">
        404 - Page Not Found
      </p>

      <h1 className="text-4xl font-semibold text-[#25231f] mb-4">
        Page Not Found
      </h1>

      <p className="text-[#77736d] mb-7">
        Sorry, the page you are looking for does not exist.
      </p>

      <a
        href="/"
        className="bg-[#25231f] hover:bg-[#403b33] text-white px-7 py-3 rounded-lg transition-colors"
      >
        Back to Home
      </a>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Navbar />

      <main className="py-3 flex-grow">
        <div className="container mx-auto px-4">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Password recovery routes */}
            <Route
              path="/forgotpassword"
              element={<ForgotPasswordPage />}
            />
            <Route
              path="/resetpassword/:resettoken"
              element={<ResetPasswordPage />}
            />

            {/* Protected user routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/myorders" element={<MyOrdersPage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute admin={true} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* Not found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </Router>
  )
}

export default App