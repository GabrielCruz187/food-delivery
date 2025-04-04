"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Filter } from "lucide-react"
import { getMenuItems } from "@/lib/api"
import "../../styles/menu.css"
import AddToCartButton from "@/components/add-to-cart-button"

export default function MenuPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"

  const [category, setCategory] = useState(initialCategory)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchMenuItems() {
      setLoading(true)
      try {
        // In a real app, this would fetch from the API with the category filter
        const items = await getMenuItems(category)
        setMenuItems(items)
      } catch (error) {
        console.error("Error fetching menu items:", error)
        // For demo purposes, set some sample data
        setMenuItems(sampleMenuItems)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [category])

  const categories = ["all", "pizza", "burgers", "sushi", "pasta", "desserts", "drinks"]

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <button className="filter-toggle-button" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className={`filters-container ${showFilters ? "show" : ""}`}>
        <div className="categories-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-button ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading menu items...</div>
      ) : (
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div className="menu-item" key={item.id}>
              <div className="item-image">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} width={250} height={200} />
              </div>
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-footer">
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  <AddToCartButton item={item} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
    image: "/placeholder.svg?height=200&width=250&text=Pizza",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Pizza topped with pepperoni slices and cheese",
    price: 14.99,
    category: "pizza",
    image: "/placeholder.svg?height=200&width=250&text=Pepperoni",
  },
  {
    id: 3,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and special sauce",
    price: 9.99,
    category: "burgers",
    image: "/placeholder.svg?height=200&width=250&text=Burger",
  },
  {
    id: 4,
    name: "Cheeseburger",
    description: "Classic burger with American cheese",
    price: 10.99,
    category: "burgers",
    image: "/placeholder.svg?height=200&width=250&text=Cheeseburger",
  },
  {
    id: 5,
    name: "California Roll",
    description: "Crab, avocado, and cucumber roll",
    price: 16.99,
    category: "sushi",
    image: "/placeholder.svg?height=200&width=250&text=Sushi",
  },
  {
    id: 6,
    name: "Pasta Carbonara",
    description: "Creamy pasta with bacon and parmesan",
    price: 14.99,
    category: "pasta",
    image: "/placeholder.svg?height=200&width=250&text=Pasta",
  },
  {
    id: 7,
    name: "Chocolate Cake",
    description: "Rich chocolate cake with ganache",
    price: 7.99,
    category: "desserts",
    image: "/placeholder.svg?height=200&width=250&text=Cake",
  },
  {
    id: 8,
    name: "Iced Coffee",
    description: "Cold brewed coffee with milk",
    price: 4.99,
    category: "drinks",
    image: "/placeholder.svg?height=200&width=250&text=Coffee",
  },
]

