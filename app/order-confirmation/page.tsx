"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import "../../styles/order-confirmation.css"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <div className="loading">Processing your order...</div>
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">
          <CheckCircle size={64} />
        </div>

        <h1>Order Confirmed!</h1>
        <p className="order-id">Order ID: #{orderId}</p>

        <div className="confirmation-message">
          <p>Thank you for your order! We've received your order and will start preparing it shortly.</p>
          <p>You'll receive an email confirmation with your order details and tracking information.</p>
        </div>

        <div className="estimated-time">
          <h3>Estimated Delivery Time</h3>
          <p className="time">30-45 minutes</p>
        </div>

        <div className="action-buttons">
          <Link href="/menu" className="secondary-button">
            Order More
          </Link>
          <Link href="/" className="primary-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
