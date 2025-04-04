"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useState } from "react"

type AddToCartButtonProps = {
  item: {
    id: number
    name: string
    price: number
    image: string
  }
}

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(item)

    // Visual feedback
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  return (
    <button className={`add-to-cart-button ${isAdding ? "adding" : ""}`} onClick={handleAddToCart}>
      <ShoppingCart size={16} />
      {isAdding ? "Added!" : "Add to Cart"}
    </button>
  )
}

