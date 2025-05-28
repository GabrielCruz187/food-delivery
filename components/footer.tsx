"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import "../styles/footer.css"
import { useState, useEffect } from "react"

export default function Footer() {
  const pathname = usePathname()
  const [isAdminPage, setIsAdminPage] = useState(false)

  useEffect(() => {
    setIsAdminPage(pathname.startsWith("/admin"))
  }, [pathname])

  if (isAdminPage) {
    return null
  }

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">DeliveryFood</h3>
          <p className="footer-description">
            Comida deliciosa entregue na sua porta. Peça online para uma experiência gastronômica rápida e fácil.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Links Rápidos</h3>
          <ul className="footer-links">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>
              <Link href="/menu">Cardápio</Link>
            </li>
            <li>
              <Link href="/about">Sobre Nós</Link>
            </li>
            <li>
              <Link href="/contact">Contato</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Fale Conosco</h3>
          <ul className="contact-info">
            <li>
              <Phone size={16} />
              <span>(11) 99999-9999</span>
            </li>
            <li>
              <Mail size={16} />
              <span>contato@deliveryfood.com</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>Rua das Flores, 123, São Paulo, SP</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Horário de Funcionamento</h3>
          <ul className="opening-hours">
            <li>
              <span>Segunda - Sexta</span>
              <span>09:00 - 22:00</span>
            </li>
            <li>
              <span>Sábado - Domingo</span>
              <span>10:00 - 23:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DeliveryFood. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
