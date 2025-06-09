"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react"
import "../../styles/contact.css"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simular envio do formulário
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSuccess(true)
    setLoading(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })

    // Resetar mensagem de sucesso após 5 segundos
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <section className="contact-header">
          <h1>Entre em Contato</h1>
          <p>
            Estamos aqui para ajudar! Entre em contato conosco através de qualquer um dos canais abaixo ou envie uma
            mensagem usando o formulário.
          </p>
        </section>

        <div className="contact-content">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Informações de Contato</h2>

            <div className="contact-item">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <div className="contact-details">
                <h3>Endereço</h3>
                <p>Rua das Flores, 123</p>
                <p>Centro, São Paulo - SP</p>
                <p>CEP: 01234-567</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Phone size={24} />
              </div>
              <div className="contact-details">
                <h3>Telefone</h3>
                <p>(11) 99999-9999</p>
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 9h às 15h</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Mail size={24} />
              </div>
              <div className="contact-details">
                <h3>Email</h3>
                <p>contato@deliveryfood.com</p>
                <p>suporte@deliveryfood.com</p>
                <p>Resposta em até 24h</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Clock size={24} />
              </div>
              <div className="contact-details">
                <h3>Horário de Funcionamento</h3>
                <p>Segunda a Sexta: 8h às 22h</p>
                <p>Sábado: 9h às 23h</p>
                <p>Domingo: 10h às 21h</p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
              <h3>Perguntas Frequentes</h3>
              <div className="faq-item">
                <h4>Qual é o tempo médio de entrega?</h4>
                <p>Nosso tempo médio de entrega é de 30-45 minutos, dependendo da localização e do restaurante.</p>
              </div>
              <div className="faq-item">
                <h4>Há taxa de entrega?</h4>
                <p>Sim, cobramos uma taxa de entrega de R$ 8,99 para a maioria das regiões.</p>
              </div>
              <div className="faq-item">
                <h4>Posso cancelar meu pedido?</h4>
                <p>Você pode cancelar seu pedido até 5 minutos após a confirmação, sem custos adicionais.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Envie uma Mensagem</h2>

            {success && (
              <div className="success-message">
                <MessageCircle size={20} />
                <span>Mensagem enviada com sucesso! Entraremos em contato em breve.</span>
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nome Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Assunto *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="pedido">Problema com Pedido</option>
                    <option value="entrega">Problema com Entrega</option>
                    <option value="pagamento">Problema com Pagamento</option>
                    <option value="restaurante">Sugestão de Restaurante</option>
                    <option value="elogio">Elogio</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensagem *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Descreva sua dúvida, sugestão ou problema..."
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <div className="loading-spinner" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Enviar Mensagem
                  </>
                )}
              </button>
            </form>

            {/* Alternative Contact Methods */}
            <div className="alternative-contact">
              <h3>Outras Formas de Contato</h3>
              <div className="contact-methods">
                <a href="https://wa.me/5511999999999" className="contact-method whatsapp">
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
                <a href="tel:+5511999999999" className="contact-method phone">
                  <Phone size={20} />
                  Ligar Agora
                </a>
                <a href="mailto:contato@deliveryfood.com" className="contact-method email">
                  <Mail size={20} />
                  Email Direto
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="map-section">
          <h2>Nossa Localização</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <MapPin size={48} />
              <p>Mapa interativo seria carregado aqui</p>
              <p>Rua das Flores, 123 - Centro, São Paulo - SP</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
