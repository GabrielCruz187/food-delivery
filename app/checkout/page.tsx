"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { createOrder } from "@/lib/api"
import "../../styles/checkout.css"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "credit",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"

    if (formData.paymentMethod === "credit") {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = "Expiry date is required"
      if (!formData.cardCvc.trim()) newErrors.cardCvc = "CVC is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // In a real app, this would send the order to the backend
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        items: cart,
        total: cartTotal + 3.99 + cartTotal * 0.08,
        paymentMethod: formData.paymentMethod,
      }

      const order = await createOrder(orderData)

      // Clear the cart after successful order
      clearCart()

      // Redirect to order confirmation page
      router.push(`/order-confirmation?id=${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      // In a real app, show error message to user
      alert("There was an error processing your order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Delivery Information</h2>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "error" : ""}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? "error" : ""}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={errors.zipCode ? "error" : ""}
                />
                {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Payment Method</h2>

            <div className="payment-options">
              <div className="payment-option">
                <input
                  type="radio"
                  id="credit"
                  name="paymentMethod"
                  value="credit"
                  checked={formData.paymentMethod === "credit"}
                  onChange={handleChange}
                />
                <label htmlFor="credit">Credit Card</label>
              </div>

              <div className="payment-option">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === "cash"}
                  onChange={handleChange}
                />
                <label htmlFor="cash">Cash on Delivery</label>
              </div>
            </div>

            {formData.paymentMethod === "credit" && (
              <div className="credit-card-fields">
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className={errors.cardNumber ? "error" : ""}
                  />
                  {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardExpiry">Expiry Date</label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className={errors.cardExpiry ? "error" : ""}
                    />
                    {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardCvc">CVC</label>
                    <input
                      type="text"
                      id="cardCvc"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      placeholder="123"
                      className={errors.cardCvc ? "error" : ""}
                    />
                    {errors.cardCvc && <span className="error-message">{errors.cardCvc}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="place-order-button" disabled={loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            {cart.map((item) => (
              <div className="summary-item" key={item.id}>
                <span>
                  {item.quantity} x {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

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
        </div>
      </div>
    </div>
  )
}

