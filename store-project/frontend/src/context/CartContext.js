import { createContext, useState, useEffect, useCallback } from "react"

export const CartContext = createContext()

const getSavedCart = () => {
  try {
    const storedCartItems = localStorage.getItem("cartItems")

    if (!storedCartItems) return []

    const parsedCart = JSON.parse(storedCartItems)

    return Array.isArray(parsedCart) ? parsedCart : []
  } catch (error) {
    console.error("Failed to load cartItems:", error)
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getSavedCart)

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
    } catch (error) {
      console.error("Failed to save cartItems:", error)
    }
  }, [cartItems])

  const addToCart = useCallback((product, qty) => {
    if (!product?._id) return

    const quantity = Number(qty)
    const price = Number(product.price)
    const stock = Number(product.countInStock)

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(stock) ||
      stock < 1
    ) {
      return
    }

    const safeQty = Math.min(quantity, stock)

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item._id === product._id
      )

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...product, qty: Math.min(existingItem.qty + safeQty, stock) }
            : item
        )
      }

      return [...prevItems, { ...product, qty: safeQty }]
    })
  }, [])

  const removeFromCart = useCallback((id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== id)
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  // Keep the existing store pricing unchanged.
  const itemsPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.qty),
    0
  )

  const shippingPrice = itemsPrice > 100 ? 0 : 10
  const taxPrice = 0.15 * itemsPrice
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