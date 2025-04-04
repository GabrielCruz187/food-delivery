"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Users, DollarSign, Package, LogOut } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { getOrderStats, getRecentOrders } from "@/lib/api"
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

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("adminToken")
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    async function fetchDashboardData() {
      setLoading(true)
      try {
        // In a real app, these would fetch from the API
        const statsData = await getOrderStats()
        const ordersData = await getRecentOrders()

        setStats(statsData)
        setRecentOrders(ordersData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // For demo purposes, set some sample data
        setStats({
          totalOrders: 156,
          totalRevenue: 4289.45,
          totalCustomers: 78,
          totalProducts: 32,
        })
        setRecentOrders(sampleRecentOrders)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
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
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{typeof order.customer === "object" ? order.customer.name : order.customer}</td>
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
        </div>
      </div>
    </div>
  )
}

// Sample data for demonstration
const sampleRecentOrders = [
  {
    id: "3210",
    customer: "Olivia Martin",
    date: "Apr 4, 2023",
    status: "Delivered",
    total: 42.25,
  },
  {
    id: "3209",
    customer: "Ava Johnson",
    date: "Apr 3, 2023",
    status: "Processing",
    total: 74.99,
  },
  {
    id: "3208",
    customer: "Michael Brown",
    date: "Apr 2, 2023",
    status: "Pending",
    total: 32.5,
  },
  {
    id: "3207",
    customer: "Sophia Anderson",
    date: "Apr 1, 2023",
    status: "Delivered",
    total: 99.99,
  },
  {
    id: "3206",
    customer: "Daniel Smith",
    date: "Mar 31, 2023",
    status: "Cancelled",
    total: 67.5,
  },
]



