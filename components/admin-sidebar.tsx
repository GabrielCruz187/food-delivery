"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import "../styles/admin-sidebar.css"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Painel Admin</h2>
        <button className="collapse-button" onClick={toggleSidebar}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link href="/admin/dashboard" className={`nav-item ${pathname === "/admin/dashboard" ? "active" : ""}`}>
          <LayoutDashboard size={20} />
          <span className="nav-text">Dashboard</span>
        </Link>

        <Link href="/admin/orders" className={`nav-item ${pathname === "/admin/orders" ? "active" : ""}`}>
          <ShoppingBag size={20} />
          <span className="nav-text">Pedidos</span>
        </Link>

        <Link href="/admin/menu" className={`nav-item ${pathname === "/admin/menu" ? "active" : ""}`}>
          <Package size={20} />
          <span className="nav-text">Cardápio</span>
        </Link>

        <Link href="/admin/customers" className={`nav-item ${pathname === "/admin/customers" ? "active" : ""}`}>
          <Users size={20} />
          <span className="nav-text">Clientes</span>
        </Link>

        <Link href="/admin/settings" className={`nav-item ${pathname === "/admin/settings" ? "active" : ""}`}>
          <Settings size={20} />
          <span className="nav-text">Configurações</span>
        </Link>
      </nav>
    </aside>
  )
}


