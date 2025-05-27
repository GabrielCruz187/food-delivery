"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, Package, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { getOrders, getCurrentUser } from "@/lib/api"
import "../../../styles/admin-orders.css"

interface Order {
  id: number
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    zipCode: string
  }
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
  }>
  total: number
  date: string
  status: string
  paymentMethod: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    checkAuthAndFetchOrders()
  }, [])

  async function checkAuthAndFetchOrders() {
    try {
      const user = await getCurrentUser()
      if (!user || !user.isAdmin) {
        router.push("/admin/login")
        return
      }

      await fetchOrders()
    } catch (error) {
      console.error("Error:", error)
      router.push("/admin/login")
    }
  }

  async function fetchOrders() {
    setLoading(true)
    try {
      const ordersData = await getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Error fetching orders:", error)
      alert("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      // Aqui você implementaria a função para atualizar o status no backend
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status.")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="status-icon pending" />
      case "preparing":
        return <Package className="status-icon preparing" />
      case "completed":
        return <CheckCircle className="status-icon completed" />
      case "cancelled":
        return <XCircle className="status-icon cancelled" />
      default:
        return <Clock className="status-icon" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending"
      case "preparing":
        return "status-preparing"
      case "completed":
        return "status-completed"
      case "cancelled":
        return "status-cancelled"
      default:
        return "status-pending"
    }
  }

  const filteredOrders = orders.filter((order) => statusFilter === "all" || order.status === statusFilter)

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-container">
            <Loader2 size={48} className="animate-spin" />
            <p>Loading orders...</p>
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
          <h1>Order Management</h1>
          <div className="order-stats">
            <div className="stat-card">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{orders.filter((o) => o.status === "pending").length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{orders.filter((o) => o.status === "preparing").length}</span>
              <span className="stat-label">Preparing</span>
            </div>
          </div>
        </div>

        <div className="orders-filters">
          <div className="status-filters">
            {["all", "pending", "preparing", "completed", "cancelled"].map((status) => (
              <button
                key={status}
                className={`status-filter ${statusFilter === status ? "active" : ""}`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="orders-table">
          <div className="table-header">
            <div className="header-cell">Order ID</div>
            <div className="header-cell">Customer</div>
            <div className="header-cell">Items</div>
            <div className="header-cell">Total</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Date</div>
            <div className="header-cell">Actions</div>
          </div>

          {filteredOrders.map((order) => (
            <div key={order.id} className="table-row">
              <div className="table-cell">#{order.id}</div>
              <div className="table-cell">
                <div className="customer-info">
                  <span className="customer-name">{order.customer.name}</span>
                  <span className="customer-email">{order.customer.email}</span>
                </div>
              </div>
              <div className="table-cell">
                <span className="items-count">{order.items.length} items</span>
              </div>
              <div className="table-cell">
                <span className="order-total">${order.total.toFixed(2)}</span>
              </div>
              <div className="table-cell">
                <div className={`status-badge ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
              <div className="table-cell">{order.date}</div>
              <div className="table-cell">
                <div className="action-buttons">
                  <button className="view-button" onClick={() => setSelectedOrder(order)}>
                    <Eye size={16} />
                    View
                  </button>
                  {order.status === "pending" && (
                    <button
                      className="status-button preparing"
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      className="status-button completed"
                      onClick={() => updateOrderStatus(order.id, "completed")}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <Package size={64} />
            <h3>No orders found</h3>
            <p>No orders match the selected filter criteria.</p>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details - #{selectedOrder.id}</h2>
                <button className="close-button" onClick={() => setSelectedOrder(null)}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="order-info-grid">
                  <div className="info-section">
                    <h3>Customer Information</h3>
                    <div className="info-item">
                      <span className="label">Name:</span>
                      <span className="value">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email:</span>
                      <span className="value">{selectedOrder.customer.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Phone:</span>
                      <span className="value">{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Address:</span>
                      <span className="value">
                        {selectedOrder.customer.address}, {selectedOrder.customer.city} {selectedOrder.customer.zipCode}
                      </span>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>Order Information</h3>
                    <div className="info-item">
                      <span className="label">Status:</span>
                      <div className={`status-badge ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status}
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="label">Date:</span>
                      <span className="value">{selectedOrder.date}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Payment:</span>
                      <span className="value">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Total:</span>
                      <span className="value total-amount">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="items-section">
                  <h3>Order Items</h3>
                  <div className="items-list">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="item-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
