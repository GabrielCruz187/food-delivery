"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { getCurrentUser, logout } from "@/lib/api"
import { supabase } from "@/lib/superbase"
import "../styles/header.css"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isAdminPage, setIsAdminPage] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsAdminPage(pathname.startsWith("/admin"))
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setCartItemCount(cart.reduce((total, item) => total + item.quantity, 0))
  }, [cart])

  useEffect(() => {
    // Verificar usuário atual
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      setShowUserMenu(false)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isAdminPage) {
    return null
  }

  return (
    <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <Link href="/" onClick={closeMenu}>
            DeliveryFood
          </Link>
        </div>

        <nav className={`main-nav ${isMenuOpen ? "open" : ""}`}>
          <button className="close-menu" onClick={closeMenu}>
            <X size={24} />
          </button>

          <ul className="nav-links">
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""} onClick={closeMenu}>
                Início
              </Link>
            </li>
            <li>
              <Link href="/menu" className={pathname === "/menu" ? "active" : ""} onClick={closeMenu}>
                Cardápio
              </Link>
            </li>
            <li>
              <Link href="/about" className={pathname === "/about" ? "active" : ""} onClick={closeMenu}>
                Sobre
              </Link>
            </li>
            <li>
              <Link href="/contact" className={pathname === "/contact" ? "active" : ""} onClick={closeMenu}>
                Contato
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <Link href="/cart" className="cart-icon">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>

          {loading ? (
            <div className="loading-user">...</div>
          ) : user ? (
            <div className="user-menu-container">
              <button className="user-menu-button" onClick={() => setShowUserMenu(!showUserMenu)}>
                <User size={24} />
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link href="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Perfil
                  </Link>
                  <Link href="/orders" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Meus Pedidos
                  </Link>
                  {user.isAdmin && (
                    <Link href="/admin/dashboard" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Painel Admin
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="login-button">
              Entrar
            </Link>
          )}

          <button className="menu-toggle" onClick={toggleMenu}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}
