import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext" // New: Import CartProvider
import { NotificationProvider } from "./context/NotificationContext"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          {" "}
          {/* New: Wrap app with NotificationProvider */}
          <App />
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
