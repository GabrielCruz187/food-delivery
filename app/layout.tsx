import type React from "react"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CartProvider from "@/context/cart-context"
import "../styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Restaurant Ordering System",
  description: "Order delicious food online",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <div className="main-content">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}

