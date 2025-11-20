"use client"

import { createContext, useState, useEffect } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  // Fetch cart items from localStorage on initial load
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCartItems = localStorage.getItem("cartItems")
      return storedCartItems ? JSON.parse(storedCartItems) : []
    } catch (error) {
      console.error("Failed to parse cartItems from localStorage", error)
      return []
    }
  })

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x._id === product._id)

    if (existItem) {
      setCartItems(cartItems.map((x) => (x._id === existItem._id ? { ...product, qty } : x)))
    } else {
      setCartItems([...cartItems, { ...product, qty }])
    }
  }

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  // Calculate order prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  const shippingPrice = itemsPrice > 100 ? 0 : 10 // Free shipping for orders over $100
  const taxPrice = 0.15 * itemsPrice // 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
