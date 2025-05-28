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
    return <div className="loading">Carregando carrinho...</div>
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Seu Carrinho está Vazio</h1>
        <p>Parece que você ainda não adicionou nenhum item ao seu carrinho.</p>
        <Link href="/menu" className="primary-button">
          Ver Cardápio
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Seu Carrinho</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-image">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} width={100} height={80} />
              </div>

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">R${item.price.toFixed(2)}</p>
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

              <div className="item-total">R${(item.price * item.quantity).toFixed(2)}</div>

              <button className="remove-button" onClick={() => removeItem(item.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Resumo do Pedido</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>R${cartTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Taxa de Entrega</span>
            <span>R$8,99</span>
          </div>

          <div className="summary-row">
            <span>Impostos</span>
            <span>R${(cartTotal * 0.08).toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>R${(cartTotal + 8.99 + cartTotal * 0.08).toFixed(2)}</span>
          </div>

          <Link href="/checkout" className="checkout-button">
            Finalizar Pedido
            <ArrowRight size={16} />
          </Link>

          <button className="clear-cart-button" onClick={clearCart}>
            Limpar Carrinho
          </button>
        </div>
      </div>
    </div>
  )
}

