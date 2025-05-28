"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { register } from "@/lib/api"
import "../../styles/auth.css"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")

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
    if (!formData.password) newErrors.password = "Senha é obrigatória"
    if (formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    if (!validateForm()) return

    setLoading(true)

    try {
      const result = await register(formData)

      if (result.success) {
        setMessage("Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setMessage(result.message || "Falha no cadastro")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setMessage("Ocorreu um erro durante o cadastro. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Criar Conta</h1>
          <p>Junte-se a nós para começar a pedir comida deliciosa</p>
        </div>

        {message && <div className={`message ${message.includes("sucesso") ? "success" : "error"}`}>{message}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefone (Opcional)</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="address">Endereço (Opcional)</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Cidade (Opcional)</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">CEP (Opcional)</label>
              <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Criando Conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Já tem uma conta?{" "}
            <Link href="/login" className="auth-link">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

