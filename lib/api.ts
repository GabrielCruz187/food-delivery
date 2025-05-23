// Real API service that connects to our backend endpoints

// Menu Items API
export async function getMenuItems(category?: string) {
  try {
    const url = category && category !== "all" ? `/api/menu?category=${category}` : "/api/menu"

    const response = await fetch(url)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message)
    }

    return result.data
  } catch (error) {
    console.error("Error fetching menu items:", error)
    throw error
  }
}

export async function getMenuItem(id: number) {
  try {
    const response = await fetch(`/api/menu/${id}`)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message)
    }

    return result.data
  } catch (error) {
    console.error("Error fetching menu item:", error)
    throw error
  }
}

export async function createMenuItem(item: any) {
  try {
    const response = await fetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message)
    }

    return result.data
  } catch (error) {
    console.error("Error creating menu item:", error)
    throw error
  }
}

export async function updateMenuItem(id: number, updates: any) {
  try {
    const response = await fetch(`/api/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message)
    }

    return result.data
  } catch (error) {
    console.error("Error updating menu item:", error)
    throw error
  }
}

export async function deleteMenuItem(id: number) {
  try {
    const response = await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting menu item:", error)
    throw error
  }
}

// Orders API
export async function createOrder(orderData: any) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: orderData.items,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message)
    }

    return result.data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrders() {
  try {
    const response = await fetch("/api/orders")
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message)
    }

    return result.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export async function getRecentOrders(limit = 5) {
  try {
    const response = await fetch("/api/orders")
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message)
    }

    return result.data.slice(0, limit)
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    throw error
  }
}

export async function getOrderStats() {
  try {
    const response = await fetch("/api/admin/stats")
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message)
    }

    return result.data
  } catch (error) {
    console.error("Error fetching order stats:", error)
    throw error
  }
}

// Auth API
export async function login(email: string, password: string) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()

    if (result.success) {
      // Store user info in localStorage for client-side access
      localStorage.setItem("user", JSON.stringify(result.user))
      if (result.user.isAdmin) {
        localStorage.setItem("adminToken", "authenticated")
      }
    }

    return result
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

export async function register(userData: any) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "An error occurred during registration" }
  }
}

export async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })

    const result = await response.json()

    // Clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("adminToken")

    return result
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, message: "An error occurred during logout" }
  }
}

// User management
export async function getCurrentUser() {
  try {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
