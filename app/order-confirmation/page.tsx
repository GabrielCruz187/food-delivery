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
    // Simular carregamento
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <div className="loading">Processando seu pedido...</div>
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">
          <CheckCircle size={64} />
        </div>

        <h1>Pedido Confirmado!</h1>
        <p className="order-id">ID do Pedido: #{orderId}</p>

        <div className="confirmation-message">
          <p>Obrigado pelo seu pedido! Recebemos seu pedido e começaremos a prepará-lo em breve.</p>
          <p>Você receberá um email de confirmação com os detalhes do seu pedido e informações de rastreamento.</p>
        </div>

        <div className="estimated-time">
          <h3>Tempo Estimado de Entrega</h3>
          <p className="time">30-45 minutos</p>
        </div>

        <div className="action-buttons">
          <Link href="/menu" className="secondary-button">
            Pedir Mais
          </Link>
          <Link href="/" className="primary-button">
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  )
}
