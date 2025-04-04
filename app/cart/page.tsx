"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { useCart } from "@/context/cart-context"
import "../../styles/cart.css"

export default function CartPage() {
  const { cart, updateItemQuantity, removeItem, clearCart, cartTotal } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="loading">Loading cart...</div>
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your Cart is Empty</h1>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link href="/menu" className="primary-button">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-image">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} width={100} height={80} />
              </div>

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
              </div>

              <div className="item-quantity">
                <button
                  className="quantity-button"
                  onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                >
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button className="quantity-button" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>

              <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>

              <button className="remove-button" onClick={() => removeItem(item.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>$3.99</span>
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <span>${(cartTotal * 0.08).toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${(cartTotal + 3.99 + cartTotal * 0.08).toFixed(2)}</span>
          </div>

          <Link href="/checkout" className="checkout-button">
            Proceed to Checkout
            <ArrowRight size={16} />
          </Link>

          <button className="clear-cart-button" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}

