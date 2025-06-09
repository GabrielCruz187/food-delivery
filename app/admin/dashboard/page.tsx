"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Users, DollarSign, Package, LogOut, Loader2 } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { getOrderStats, getRecentOrders, getCurrentUser, logout } from "@/lib/api"
import { supabase } from "@/lib/superbase"
import "../../../styles/admin-dashboard.css"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (!authChecked) {
      checkAuthAndLoadData()
    }
  }, [authChecked])

  const checkAuthAndLoadData = async () => {
    try {
      console.log("Dashboard: Verificando autenticação...")

      // Verificar se o usuário está autenticado
      const {
        data: { session },
      } = await supabase.auth.getSession()

      console.log("Dashboard: Sessão:", session ? "Found" : "Not found")

      if (!session) {
        console.log("Dashboard: Nenhuma sessão encontrada, redirecionando para login")
        router.push("/admin/login")
        return
      }

      // Verificar se o usuário é admin
      const currentUser = await getCurrentUser()
      console.log("Dashboard: Usuário atual:", currentUser)

      if (!currentUser) {
        console.log("Dashboard: Dados do usuário não encontrados, redirecionando para login")
        router.push("/admin/login")
        return
      }

      if (!currentUser.isAdmin) {
        console.log("Dashboard: Usuário não é admin, redirecionando para home")
        router.push("/")
        return
      }

      console.log("Dashboard: Usuário é admin, carregando dados do dashboard...")
      setUser(currentUser)
      setAuthChecked(true)

      // Carregar dados do dashboard
      await fetchDashboardData()
    } catch (error) {
      console.error("Dashboard: Erro ao verificar autenticação:", error)
      router.push("/admin/login")
    }
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      console.log("Dashboard: Buscando dados do dashboard...")
      const [statsData, ordersData] = await Promise.all([getOrderStats(), getRecentOrders()])

      console.log("Dashboard: Dados de estatísticas:", statsData)
      console.log("Dashboard: Dados de pedidos:", ordersData)

      setStats(statsData)
      setRecentOrders(ordersData)
    } catch (error) {
      console.error("Dashboard: Erro ao buscar dados do dashboard:", error)
      // Usar dados de exemplo em caso de erro
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0,
      })
      setRecentOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Mostrar loading enquanto verifica autenticação
  if (!authChecked) {
    return (
      <div className="admin-layout">
        <div className="admin-loading">
          <Loader2 size={48} className="animate-spin" />
          <p>Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="admin-loading">
            <Loader2 size={48} className="animate-spin" />
            <p>Carregando dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <div className="admin-header">
          <div className="header-left">
            <h1>Dashboard</h1>
            {user && <p className="welcome-message">Bem-vindo de volta, {user.name}!</p>}
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={16} />
            Sair
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon orders">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-details">
              <h3>Total de Pedidos</h3>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <DollarSign size={24} />
            </div>
            <div className="stat-details">
              <h3>Receita Total</h3>
              <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon customers">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <h3>Clientes</h3>
              <p className="stat-value">{stats.totalCustomers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon products">
              <Package size={24} />
            </div>
            <div className="stat-details">
              <h3>Produtos</h3>
              <p className="stat-value">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="recent-orders">
          <div className="section-header">
            <h2>Pedidos Recentes</h2>
            <button className="view-all-button" onClick={() => router.push("/admin/orders")}>
              Ver Todos
            </button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID do Pedido</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                      <td>${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-orders">
              <p>Nenhum pedido encontrado. Os pedidos aparecerão aqui quando os clientes começarem a fazer pedidos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
