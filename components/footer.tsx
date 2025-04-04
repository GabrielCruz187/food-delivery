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
          <h3 className="footer-title">FoodDelivery</h3>
          <p className="footer-description">
            Delicious food delivered to your doorstep. Order online for a quick and easy dining experience.
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
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/menu">Menu</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="contact-info">
            <li>
              <Phone size={16} />
              <span>(123) 456-7890</span>
            </li>
            <li>
              <Mail size={16} />
              <span>info@fooddelivery.com</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>123 Main Street, City, Country</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Opening Hours</h3>
          <ul className="opening-hours">
            <li>
              <span>Monday - Friday</span>
              <span>9:00 AM - 10:00 PM</span>
            </li>
            <li>
              <span>Saturday - Sunday</span>
              <span>10:00 AM - 11:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FoodDelivery. All rights reserved.</p>
      </div>
    </footer>
  )
}


