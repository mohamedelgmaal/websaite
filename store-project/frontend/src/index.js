import React from "react"
import ReactDOM from "react-dom/client"

import "./index.css"
import App from "./App"

import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { NotificationProvider } from "./context/NotificationContext"
import { LanguageProvider } from "./context/LanguageContext"

const root = ReactDOM.createRoot(
  document.getElementById("root")
)

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
)