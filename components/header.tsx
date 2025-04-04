"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "@/context/cart-context"
import "../styles/header.css"

export default function Header() {
  const pathname = usePathname()
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isAdminPage, setIsAdminPage] = useState(false)

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  if (isAdminPage) {
    return null
  }

  return (
    <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <Link href="/" onClick={closeMenu}>
            FoodDelivery
          </Link>
        </div>

        <nav className={`main-nav ${isMenuOpen ? "open" : ""}`}>
          <button className="close-menu" onClick={closeMenu}>
            <X size={24} />
          </button>

          <ul className="nav-links">
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/menu" className={pathname === "/menu" ? "active" : ""} onClick={closeMenu}>
                Menu
              </Link>
            </li>
            <li>
              <Link href="/about" className={pathname === "/about" ? "active" : ""} onClick={closeMenu}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className={pathname === "/contact" ? "active" : ""} onClick={closeMenu}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <Link href="/cart" className="cart-icon">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>

          <button className="menu-toggle" onClick={toggleMenu}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}



