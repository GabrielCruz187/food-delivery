"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { login } from "@/lib/api"
import "../../styles/auth.css"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Por favor, insira email e senha")
      return
    }

    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        // Redirecionar baseado no tipo de usuário
        if (result.user.isAdmin) {
          router.push("/admin/dashboard")
        } else {
          router.push("/")
        }
      } else {
        setError(result.message || "Credenciais inválidas")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Ocorreu um erro durante o login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Bem-vindo de Volta</h1>
          <p>Entre na sua conta para continuar</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Não tem uma conta?{" "}
            <Link href="/register" className="auth-link">
              Criar uma
            </Link>
          </p>
          <p>
            <Link href="/admin/login" className="auth-link">
              Login de Administrador
            </Link>
          </p>
        </div>

        <div className="demo-credentials">
          <h3>Credenciais de Demonstração:</h3>
          <p>
            <strong>Admin:</strong> admin@example.com / admin123
          </p>
          <p>
            <strong>Usuário:</strong> Crie uma nova conta ou use qualquer email/senha
          </p>
        </div>
      </div>
    </div>
  )
}
