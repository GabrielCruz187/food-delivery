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
        const items = await getMenuItems(category)
        setMenuItems(items)
      } catch (error) {
        console.error("Error fetching menu items:", error)
        setMenuItems(sampleMenuItems)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [category])

  const categories = [
    { id: "all", name: "Todos" },
    { id: "pizza", name: "Pizza" },
    { id: "burgers", name: "Hambúrgueres" },
    { id: "sushi", name: "Sushi" },
    { id: "pasta", name: "Massas" },
    { id: "desserts", name: "Sobremesas" },
    { id: "drinks", name: "Bebidas" },
  ]

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Nosso Cardápio</h1>
        <button className="filter-toggle-button" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={20} />
          Filtros
        </button>
      </div>

      <div className={`filters-container ${showFilters ? "show" : ""}`}>
        <div className="categories-filter">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-button ${category === cat.id ? "active" : ""}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Carregando itens do cardápio...</div>
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
                  <p className="item-price">R${item.price.toFixed(2)}</p>
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

// Dados de exemplo para demonstração
const sampleMenuItems = [
  {
    id: 1,
    name: "Pizza Margherita",
    description: "Pizza clássica com molho de tomate, mussarela e manjericão",
    price: 32.99,
    category: "pizza",
    image: "/placeholder.svg?height=200&width=250&text=Pizza",
  },
  {
    id: 2,
    name: "Pizza Pepperoni",
    description: "Pizza coberta com fatias de pepperoni e queijo",
    price: 36.99,
    category: "pizza",
    image: "/placeholder.svg?height=200&width=250&text=Pepperoni",
  },
  {
    id: 3,
    name: "Hambúrguer Clássico",
    description: "Hambúrguer de carne com alface, tomate e molho especial",
    price: 24.99,
    category: "burgers",
    image: "/placeholder.svg?height=200&width=250&text=Hambúrguer",
  },
  {
    id: 4,
    name: "Cheeseburger",
    description: "Hambúrguer clássico com queijo americano",
    price: 27.99,
    category: "burgers",
    image: "/placeholder.svg?height=200&width=250&text=Cheeseburger",
  },
  {
    id: 5,
    name: "California Roll",
    description: "Sushi com caranguejo, abacate e pepino",
    price: 42.99,
    category: "sushi",
    image: "/placeholder.svg?height=200&width=250&text=Sushi",
  },
  {
    id: 6,
    name: "Macarrão Carbonara",
    description: "Massa cremosa com bacon e parmesão",
    price: 36.99,
    category: "pasta",
    image: "/placeholder.svg?height=200&width=250&text=Massa",
  },
  {
    id: 7,
    name: "Bolo de Chocolate",
    description: "Bolo rico de chocolate com ganache",
    price: 19.99,
    category: "desserts",
    image: "/placeholder.svg?height=200&width=250&text=Bolo",
  },
  {
    id: 8,
    name: "Café Gelado",
    description: "Café gelado com leite",
    price: 12.99,
    category: "drinks",
    image: "/placeholder.svg?height=200&width=250&text=Café",
  },
]
