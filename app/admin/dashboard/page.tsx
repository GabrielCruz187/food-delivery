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
      console.log("Dashboard: Checking authentication...")

      // Verificar se o usuário está autenticado
      const {
        data: { session },
      } = await supabase.auth.getSession()

      console.log("Dashboard: Session:", session ? "Found" : "Not found")

      if (!session) {
        console.log("Dashboard: No session found, redirecting to login")
        router.push("/admin/login")
        return
      }

      // Verificar se o usuário é admin
      const currentUser = await getCurrentUser()
      console.log("Dashboard: Current user:", currentUser)

      if (!currentUser) {
        console.log("Dashboard: No user data found, redirecting to login")
        router.push("/admin/login")
        return
      }

      if (!currentUser.isAdmin) {
        console.log("Dashboard: User is not admin, redirecting to home")
        router.push("/")
        return
      }

      console.log("Dashboard: User is admin, loading dashboard data...")
      setUser(currentUser)
      setAuthChecked(true)

      // Carregar dados do dashboard
      await fetchDashboardData()
    } catch (error) {
      console.error("Dashboard: Error checking auth:", error)
      router.push("/admin/login")
    }
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      console.log("Dashboard: Fetching dashboard data...")
      const [statsData, ordersData] = await Promise.all([getOrderStats(), getRecentOrders()])

      console.log("Dashboard: Stats data:", statsData)
      console.log("Dashboard: Orders data:", ordersData)

      setStats(statsData)
      setRecentOrders(ordersData)
    } catch (error) {
      console.error("Dashboard: Error fetching dashboard data:", error)
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
          <p>Checking authentication...</p>
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
            <p>Loading dashboard...</p>
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
            {user && <p className="welcome-message">Welcome back, {user.name}!</p>}
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon orders">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <DollarSign size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Revenue</h3>
              <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon customers">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <h3>Customers</h3>
              <p className="stat-value">{stats.totalCustomers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon products">
              <Package size={24} />
            </div>
            <div className="stat-details">
              <h3>Products</h3>
              <p className="stat-value">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <button className="view-all-button" onClick={() => router.push("/admin/orders")}>
              View All
            </button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
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
              <p>No orders found. Orders will appear here once customers start placing them.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


