"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { getCurrentUser } from "@/lib/api"
import { supabase } from "@/lib/superbase"
import "../../../styles/admin-customers.css"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  joinDate: string
}

export default function AdminCustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    checkAuthAndFetchCustomers()
  }, [])

  async function checkAuthAndFetchCustomers() {
    try {
      const user = await getCurrentUser()
      if (!user || !user.isAdmin) {
        router.push("/admin/login")
        return
      }

      await fetchCustomers()
    } catch (error) {
      console.error("Error:", error)
      router.push("/admin/login")
    }
  }

  async function fetchCustomers() {
    setLoading(true)
    try {
      // Buscar todos os perfis de usuários (não admins)
      const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").eq("is_admin", false)

      if (profilesError) throw profilesError

      // Buscar estatísticas de pedidos para cada cliente
      const customersWithStats = await Promise.all(
        profiles.map(async (profile) => {
          // Buscar pedidos do cliente
          const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("total, created_at")
            .eq("user_id", profile.id)

          if (ordersError) {
            console.error("Error fetching orders for user:", profile.id, ordersError)
          }

          const totalOrders = orders?.length || 0
          const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0
          const lastOrder =
            orders?.length > 0
              ? new Date(Math.max(...orders.map((o) => new Date(o.created_at).getTime()))).toLocaleDateString()
              : "Never"

          return {
            id: profile.id,
            name: profile.name || "N/A",
            email: profile.email || "N/A",
            phone: profile.phone || "N/A",
            address: profile.address || "N/A",
            city: profile.city || "N/A",
            zipCode: profile.zip_code || "N/A",
            totalOrders,
            totalSpent,
            lastOrder,
            joinDate: new Date(profile.created_at).toLocaleDateString(),
          }
        }),
      )

      setCustomers(customersWithStats)
    } catch (error) {
      console.error("Error fetching customers:", error)
      alert("Failed to load customers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-container">
            <Loader2 size={48} className="animate-spin" />
            <p>Loading customers...</p>
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
          <h1>Customer Management</h1>
          <div className="customer-stats">
            <div className="stat-card">
              <Users className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{customers.length}</span>
                <span className="stat-label">Total Customers</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-number">${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length || 0).toFixed(2)}
              </span>
              <span className="stat-label">Avg. Spent</span>
            </div>
          </div>
        </div>

        <div className="customers-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="customers-grid">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-header">
                <div className="customer-avatar">{customer.name.charAt(0).toUpperCase()}</div>
                <div className="customer-basic-info">
                  <h3 className="customer-name">{customer.name}</h3>
                  <p className="customer-email">
                    <Mail size={14} />
                    {customer.email}
                  </p>
                </div>
              </div>

              <div className="customer-details">
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{customer.phone}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>
                    {customer.address}, {customer.city} {customer.zipCode}
                  </span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>Joined: {customer.joinDate}</span>
                </div>
              </div>

              <div className="customer-stats-section">
                <div className="stat-item">
                  <span className="stat-value">{customer.totalOrders}</span>
                  <span className="stat-label">Orders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">${customer.totalSpent.toFixed(2)}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{customer.lastOrder}</span>
                  <span className="stat-label">Last Order</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="empty-state">
            <Users size={64} />
            <h3>No customers found</h3>
            <p>No customers match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
