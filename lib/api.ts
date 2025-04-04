// This is a mock API service for demonstration purposes
// In a real application, these functions would make actual API calls to a backend server

// Simulated delay to mimic API call latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Sample data
import { sampleMenuItems, sampleOrders } from "./sample-data"

// Menu Items API
export async function getMenuItems(category?: string) {
  await delay(500) // Simulate network delay

  if (category && category !== "all") {
    return sampleMenuItems.filter((item) => item.category === category)
  }

  return sampleMenuItems
}

export async function getMenuItem(id: number) {
  await delay(300)
  return sampleMenuItems.find((item) => item.id === id)
}

export async function createMenuItem(item: any) {
  await delay(800)
  const newItem = {
    ...item,
    id: Math.max(...sampleMenuItems.map((i) => i.id)) + 1,
  }
  sampleMenuItems.push(newItem)
  return newItem
}

export async function updateMenuItem(id: number, updates: any) {
  await delay(800)
  const index = sampleMenuItems.findIndex((item) => item.id === id)
  if (index !== -1) {
    sampleMenuItems[index] = { ...sampleMenuItems[index], ...updates }
    return sampleMenuItems[index]
  }
  throw new Error("Item not found")
}

export async function deleteMenuItem(id: number) {
  await delay(800)
  const index = sampleMenuItems.findIndex((item) => item.id === id)
  if (index !== -1) {
    sampleMenuItems.splice(index, 1)
    return { success: true }
  }
  throw new Error("Item not found")
}

// Orders API
export async function createOrder(orderData: any) {
  await delay(1000)
  const newOrder = {
    ...orderData,
    id: Math.floor(Math.random() * 1000) + 3200, // Generate random order ID
    date: new Date().toISOString(),
    status: "Pending",
  }
  sampleOrders.push(newOrder)
  return newOrder
}

export async function getOrders() {
  await delay(700)
  // Format orders for display
  return sampleOrders.map((order) => ({
    ...order,
    // If customer is an object, keep it as is, otherwise create a simple string
    customer: typeof order.customer === "object" ? order.customer.name : order.customer,
  }))
}

export async function getRecentOrders(limit = 5) {
  await delay(500)
  // Format orders for display
  const formattedOrders = sampleOrders.map((order) => ({
    ...order,
    // If customer is an object, extract the name
    customer: typeof order.customer === "object" ? order.customer.name : order.customer,
  }))
  return formattedOrders.slice(0, limit)
}

export async function getOrderStats() {
  await delay(600)
  return {
    totalOrders: sampleOrders.length,
    totalRevenue: sampleOrders.reduce((sum, order) => sum + order.total, 0),
    totalCustomers: new Set(
      sampleOrders.map((order) => (typeof order.customer === "object" ? order.customer.email : order.customer)),
    ).size,
    totalProducts: sampleMenuItems.length,
  }
}

// Auth API
export async function login(email: string, password: string) {
  await delay(800)

  // For demo purposes, accept a specific email/password
  if (email === "admin@example.com" && password === "admin123") {
    const token = "demo-token-" + Math.random().toString(36).substring(2)
    localStorage.setItem("adminToken", token)
    return { success: true, token }
  }

  return { success: false, message: "Invalid credentials" }
}

export async function logout() {
  await delay(300)
  localStorage.removeItem("adminToken")
  return { success: true }
}


