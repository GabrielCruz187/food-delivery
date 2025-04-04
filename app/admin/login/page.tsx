"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
      setError("Please enter both email and password")
      return
    }

    setLoading(true)

    try {
      // In a real app, this would authenticate with the backend
      const result = await login(formData.email, formData.password)

      if (result.success) {
        // Redirect to admin dashboard
        router.push("/admin/dashboard")
      } else {
        setError(result.message || "Invalid credentials")
      }
    } catch (error) {
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
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>For demo purposes, use:</p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}

