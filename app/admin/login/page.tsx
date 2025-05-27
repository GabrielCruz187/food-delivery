"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { login } from "@/lib/api"
import "../../../styles/admin.css"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpar erro quando o usuário começar a digitar
    if (error) {
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)

    try {
      console.log("Attempting login with:", formData.email)

      const result = await login(formData.email, formData.password)
      console.log("Login result:", result)

      if (result.success && result.user) {
        console.log("Login successful, user:", result.user)

        if (result.user.isAdmin) {
          console.log("User is admin, redirecting to dashboard")
          // Usar window.location para forçar o redirecionamento
          window.location.href = "/admin/dashboard"
        } else {
          setError("Access denied. Admin privileges required.")
        }
      } else {
        setError(result.message || "Invalid credentials")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Sign in to access the restaurant management dashboard</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="demo-credentials">
            <h3>Demo Credentials:</h3>
            <div className="credential-item">
              <strong>Email:</strong> admin@example.com
            </div>
            <div className="credential-item">
              <strong>Password:</strong> admin123
            </div>
          </div>

          <div className="back-to-site">
            <a href="/" className="back-link">
              ← Back to main site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
