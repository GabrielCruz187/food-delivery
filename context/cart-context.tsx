"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateItemQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cart", JSON.stringify(cart))

      // Calculate cart total
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setCartTotal(total)
    }
  }, [cart, isClient])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id)

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += 1
        return updatedCart
      } else {
        // Add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  const removeItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateItemQuantity = (id: number, quantity: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        updateItemQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

