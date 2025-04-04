"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import MenuItemModal from "@/components/menu-item-modal"
import { getMenuItems, deleteMenuItem } from "@/lib/api"
import "../../../styles/admin-menu.css"

export default function AdminMenuPage() {
  const router = useRouter()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("adminToken")
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    fetchMenuItems()
  }, [router])

  async function fetchMenuItems() {
    setLoading(true)
    try {
      // In a real app, this would fetch from the API
      const items = await getMenuItems()
      setMenuItems(items)
    } catch (error) {
      console.error("Error fetching menu items:", error)
      // For demo purposes, set some sample data
      setMenuItems(sampleMenuItems)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = () => {
    setCurrentItem(null)
    setIsModalOpen(true)
  }

  const handleEditItem = (item) => {
    setCurrentItem(item)
    setIsModalOpen(true)
  }

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        // In a real app, this would delete from the API
        await deleteMenuItem(id)
        // Update local state
        setMenuItems(menuItems.filter((item) => item.id !== id))
      } catch (error) {
        console.error("Error deleting menu item:", error)
        alert("Failed to delete item. Please try again.")
      }
    }
  }

  const handleSaveItem = (item) => {
    // If editing an existing item
    if (item.id) {
      setMenuItems(menuItems.map((i) => (i.id === item.id ? item : i)))
    } else {
      // If adding a new item
      const newItem = {
        ...item,
        id: Date.now(), // Generate a temporary ID
      }
      setMenuItems([...menuItems, newItem])
    }
    setIsModalOpen(false)
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...new Set(menuItems.map((item) => item.category))]

  if (loading) {
    return <div className="loading">Loading menu items...</div>
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <div className="admin-header">
          <h1>Menu Management</h1>
          <button className="add-item-button" onClick={handleAddItem}>
            <Plus size={16} />
            Add New Item
          </button>
        </div>

        <div className="menu-filters">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-filter ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-items-grid">
          {filteredItems.map((item) => (
            <div className="menu-item-card" key={item.id}>
              <div className="item-image">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} width={200} height={150} />
              </div>

              <div className="item-content">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-price">${item.price.toFixed(2)}</p>
                <p className="item-category">Category: {item.category}</p>
              </div>

              <div className="item-actions">
                <button className="edit-button" onClick={() => handleEditItem(item)}>
                  <Edit size={16} />
                  Edit
                </button>

                <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <MenuItemModal
            item={currentItem}
            onSave={handleSaveItem}
            onClose={() => setIsModalOpen(false)}
            categories={categories.filter((cat) => cat !== "all")}
          />
        )}
      </div>
    </div>
  )
}

// Sample data for demonstration
const sampleMenuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    category: "pizza",
    image: "/placeholder.svg?height=150&width=200&text=Pizza",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Pizza topped with pepperoni slices and cheese",
    price: 14.99,
    category: "pizza",
    image: "/placeholder.svg?height=150&width=200&text=Pepperoni",
  },
  {
    id: 3,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and special sauce",
    price: 9.99,
    category: "burgers",
    image: "/placeholder.svg?height=150&width=200&text=Burger",
  },
  {
    id: 4,
    name: "Cheeseburger",
    description: "Classic burger with American cheese",
    price: 10.99,
    category: "burgers",
    image: "/placeholder.svg?height=150&width=200&text=Cheeseburger",
  },
  {
    id: 5,
    name: "California Roll",
    description: "Crab, avocado, and cucumber roll",
    price: 16.99,
    category: "sushi",
    image: "/placeholder.svg?height=150&width=200&text=Sushi",
  },
  {
    id: 6,
    name: "Pasta Carbonara",
    description: "Creamy pasta with bacon and parmesan",
    price: 14.99,
    category: "pasta",
    image: "/placeholder.svg?height=150&width=200&text=Pasta",
  },
  {
    id: 7,
    name: "Chocolate Cake",
    description: "Rich chocolate cake with ganache",
    price: 7.99,
    category: "desserts",
    image: "/placeholder.svg?height=150&width=200&text=Cake",
  },
  {
    id: 8,
    name: "Iced Coffee",
    description: "Cold brewed coffee with milk",
    price: 4.99,
    category: "drinks",
    image: "/placeholder.svg?height=150&width=200&text=Coffee",
  },
]

