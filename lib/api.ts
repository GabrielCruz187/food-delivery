import { supabase } from "./superbase"

// Menu Items API
export async function getMenuItems(category?: string) {
  try {
    let query = supabase
      .from("menu_items")
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq("active", true)

    if (category && category !== "all") {
      query = query.eq("categories.name", category)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: Number(item.price),
      category: item.categories?.name || "uncategorized",
      image: item.image_url || "/placeholder.svg?height=200&width=250&text=Food",
    }))
  } catch (error) {
    console.error("Error fetching menu items:", error)
    throw error
  }
}

export async function getMenuItem(id: number) {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      price: Number(data.price),
      category: data.categories?.name || "uncategorized",
      image: data.image_url || "/placeholder.svg?height=200&width=250&text=Food",
    }
  } catch (error) {
    console.error("Error fetching menu item:", error)
    throw error
  }
}

export async function createMenuItem(item: any) {
  try {
    // Primeiro, encontre o ID da categoria
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", item.category)
      .single()

    if (categoryError) throw categoryError

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        name: item.name,
        description: item.description,
        price: item.price,
        category_id: categoryData.id,
        image_url: item.image,
        active: true,
      })
      .select(`
        *,
        categories (
          name
        )
      `)
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      price: Number(data.price),
      category: data.categories?.name || "uncategorized",
      image: data.image_url || "/placeholder.svg?height=200&width=250&text=Food",
    }
  } catch (error) {
    console.error("Error creating menu item:", error)
    throw error
  }
}

export async function updateMenuItem(id: number, updates: any) {
  try {
    // Se a categoria foi atualizada, encontre o ID da categoria
    let categoryId = null
    if (updates.category) {
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", updates.category)
        .single()

      if (categoryError) throw categoryError
      categoryId = categoryData.id
    }

    const updateData: any = {
      name: updates.name,
      description: updates.description,
      price: updates.price,
      image_url: updates.image,
      updated_at: new Date().toISOString(),
    }

    if (categoryId) {
      updateData.category_id = categoryId
    }

    const { data, error } = await supabase
      .from("menu_items")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        categories (
          name
        )
      `)
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      price: Number(data.price),
      category: data.categories?.name || "uncategorized",
      image: data.image_url || "/placeholder.svg?height=200&width=250&text=Food",
    }
  } catch (error) {
    console.error("Error updating menu item:", error)
    throw error
  }
}

export async function deleteMenuItem(id: number) {
  try {
    const { error } = await supabase.from("menu_items").delete().eq("id", id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error deleting menu item:", error)
    throw error
  }
}

// Categories API
export async function getCategories() {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) throw error

    return data.map((category) => category.name)
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

// Orders API
export async function createOrder(orderData: any) {
  try {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    // Criar o pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total: orderData.total,
        payment_method: orderData.paymentMethod,
        status: "pending",
        customer_name: orderData.customer?.name,
        customer_email: orderData.customer?.email,
        customer_phone: orderData.customer?.phone,
        customer_address: orderData.customer?.address,
        customer_city: orderData.customer?.city,
        customer_zip_code: orderData.customer?.zipCode,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Adicionar os itens do pedido
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    return {
      id: order.id,
      total: order.total,
      status: order.status,
      created_at: order.created_at,
    }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrders() {
  try {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Verificar se o usuário é admin
    const { data: profileData } = await supabase.from("profiles").select("is_admin").eq("id", userId).single()

    let query = supabase.from("orders").select(`
      *,
      order_items (
        quantity, 
        price,
        menu_items (
          id, 
          name
        )
      )
    `)

    // Se não for admin, mostrar apenas os pedidos do usuário
    if (!profileData?.is_admin) {
      query = query.eq("user_id", userId)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) throw error

    return data.map((order) => ({
      id: order.id,
      customer: {
        name: order.customer_name || "N/A",
        email: order.customer_email || "N/A",
        phone: order.customer_phone || "N/A",
        address: order.customer_address || "N/A",
        city: order.customer_city || "N/A",
        zipCode: order.customer_zip_code || "N/A",
      },
      items: order.order_items.map((item: any) => ({
        id: item.menu_items?.id || 0,
        name: item.menu_items?.name || "Item removido",
        price: Number(item.price),
        quantity: item.quantity,
      })),
      total: Number(order.total),
      date: new Date(order.created_at).toLocaleDateString(),
      status: order.status,
      paymentMethod: order.payment_method || "N/A",
    }))
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export async function getRecentOrders(limit = 5) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return data.map((order) => ({
      id: order.id,
      customer: order.customer_name || "N/A",
      date: new Date(order.created_at).toLocaleDateString(),
      status: order.status,
      total: Number(order.total),
    }))
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    throw error
  }
}

export async function getOrderStats() {
  try {
    // Total de pedidos
    const { count: totalOrders, error: ordersError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })

    if (ordersError) throw ordersError

    // Total de receita
    const { data: revenueData, error: revenueError } = await supabase.from("orders").select("total")

    if (revenueError) throw revenueError

    const totalRevenue = revenueData.reduce((sum, order) => sum + Number(order.total), 0)

    // Total de clientes
    const { count: totalCustomers, error: customersError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_admin", false)

    if (customersError) throw customersError

    // Total de produtos
    const { count: totalProducts, error: productsError } = await supabase
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("active", true)

    if (productsError) throw productsError

    return {
      totalOrders: totalOrders || 0,
      totalRevenue,
      totalCustomers: totalCustomers || 0,
      totalProducts: totalProducts || 0,
    }
  } catch (error) {
    console.error("Error fetching order stats:", error)
    throw error
  }
}

// Auth API
export async function login(email: string, password: string) {
  try {
    console.log("API: Attempting login for:", email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("API: Login error:", error)
      throw error
    }

    console.log("API: Login successful, user ID:", data.user.id)

    // Aguardar um pouco para garantir que a sessão foi salva
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Obter informações do perfil
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.log("API: Profile not found, creating one...")
      // Se não existe perfil, criar um
      const { error: createError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name: data.user.email?.split("@")[0] || "User",
        is_admin: false,
      })

      if (createError) {
        console.error("API: Error creating profile:", createError)
        throw createError
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.email?.split("@")[0] || "User",
          isAdmin: false,
        },
      }
    }

    console.log("API: Profile found:", profileData)

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profileData.name || "User",
        isAdmin: profileData.is_admin,
      },
    }
  } catch (error: any) {
    console.error("API: Login error:", error)
    return {
      success: false,
      message: error.message || "Invalid credentials",
    }
  }
}

export async function register(userData: any) {
  try {
    // Registrar o usuário
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
      },
    })

    if (error) throw error

    return {
      success: true,
      message: "Registration successful! You can now log in.",
    }
  } catch (error: any) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: error.message || "Registration failed",
    }
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Logout error:", error)
    return {
      success: false,
      message: error.message || "An error occurred during logout",
    }
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      console.log("API: No user found in session")
      return null
    }

    console.log("API: User found in session:", data.user.id)

    // Obter informações do perfil
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.error("API: Error getting profile:", profileError)
      return null
    }

    console.log("API: Profile data:", profileData)

    return {
      id: data.user.id,
      email: data.user.email,
      name: profileData.name,
      phone: profileData.phone,
      address: profileData.address,
      city: profileData.city,
      zipCode: profileData.zip_code,
      isAdmin: profileData.is_admin,
    }
  } catch (error) {
    console.error("API: Error getting current user:", error)
    return null
  }
}
