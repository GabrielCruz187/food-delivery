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

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório"
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email é inválido"
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório"
    if (!formData.address.trim()) newErrors.address = "Endereço é obrigatório"
    if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória"
    if (!formData.zipCode.trim()) newErrors.zipCode = "CEP é obrigatório"

    if (formData.paymentMethod === "credit") {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Número do cartão é obrigatório"
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = "Data de validade é obrigatória"
      if (!formData.cardCvc.trim()) newErrors.cardCvc = "CVC é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
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
        total: cartTotal + 8.99 + cartTotal * 0.08,
        paymentMethod: formData.paymentMethod,
      }

      const order = await createOrder(orderData)

      // Limpar o carrinho após pedido bem-sucedido
      clearCart()

      // Redirecionar para página de confirmação
      router.push(`/order-confirmation?id=${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Houve um erro ao processar seu pedido. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <h1>Finalizar Pedido</h1>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Informações de Entrega</h2>

            <div className="form-group">
              <label htmlFor="name">Nome Completo</label>
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
                <label htmlFor="phone">Telefone</label>
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
              <label htmlFor="address">Endereço</label>
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
                <label htmlFor="city">Cidade</label>
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
                <label htmlFor="zipCode">CEP</label>
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
            <h2>Método de Pagamento</h2>

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
                <label htmlFor="credit">Cartão de Crédito</label>
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
                <label htmlFor="cash">Dinheiro na Entrega</label>
              </div>
            </div>

            {formData.paymentMethod === "credit" && (
              <div className="credit-card-fields">
                <div className="form-group">
                  <label htmlFor="cardNumber">Número do Cartão</label>
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
                    <label htmlFor="cardExpiry">Data de Validade</label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/AA"
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
            {loading ? "Processando..." : "Fazer Pedido"}
          </button>
        </form>

        <div className="order-summary">
          <h2>Resumo do Pedido</h2>

          <div className="summary-items">
            {cart.map((item) => (
              <div className="summary-item" key={item.id}>
                <span>
                  {item.quantity} x {item.name}
                </span>
                <span>R${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

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
        </div>
      </div>
    </div>
  )
}
