"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import MenuItemModal from "@/components/menu-item-modal"
import { getMenuItems, deleteMenuItem, getCategories, createMenuItem, updateMenuItem } from "@/lib/api"
import "../../../styles/admin-menu.css"

export default function AdminMenuPage() {
  const router = useRouter()
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [items, cats] = await Promise.all([getMenuItems(), getCategories()])
      setMenuItems(items)
      setCategories(cats)
    } catch (error) {
      console.error("Error fetching data:", error)
      alert("Failed to load menu data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = () => {
    setCurrentItem(null)
    setIsModalOpen(true)
  }

  const handleEditItem = (item: any) => {
    setCurrentItem(item)
    setIsModalOpen(true)
  }

  const handleDeleteItem = async (id: number) => {
    if (window.confirm("Tem certeza de que deseja excluir este item?")) {
      try {
        setIsDeleting(id)
        await deleteMenuItem(id)
        setMenuItems(menuItems.filter((item: any) => item.id !== id))
      } catch (error) {
        console.error("Error deleting menu item:", error)
        alert("Falha ao excluir item. Tente novamente.")
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const handleSaveItem = async (item: any) => {
    try {
      let savedItem
      if (item.id) {
        // Editando item existente
        savedItem = await updateMenuItem(item.id, item)
        setMenuItems(menuItems.map((i: any) => (i.id === item.id ? savedItem : i)))
      } else {
        // Criando novo item
        savedItem = await createMenuItem(item)
        setMenuItems([savedItem, ...menuItems])
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving menu item:", error)
      throw error // Re-throw para que o modal possa mostrar o erro
    }
  }

  const filteredItems = menuItems.filter((item: any) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const allCategories = ["all", ...categories]

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-container">
            <Loader2 size={48} className="animate-spin" />
            <p>Carregando itens do cardápio...</p>
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
          <h1>Gerenciamento do Cardápio</h1>
          <button className="add-item-button" onClick={handleAddItem}>
            <Plus size={16} />
            Adicionar Novo Item
          </button>
        </div>

        <div className="menu-filters">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar itens do cardápio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {allCategories.map((category) => (
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
          {filteredItems.map((item: any) => (
            <div className="menu-item-card" key={item.id}>
              <div className="item-image">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} width={200} height={150} />
              </div>

              <div className="item-content">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-price">${item.price.toFixed(2)}</p>
                <p className="item-category">Categoria: {item.category}</p>
              </div>

              <div className="item-actions">
                <button className="edit-button" onClick={() => handleEditItem(item)}>
                  <Edit size={16} />
                  Editar
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={isDeleting === item.id}
                >
                  {isDeleting === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="empty-state">
            <p>Nenhum item do cardápio encontrado que corresponda aos seus critérios.</p>
            {searchQuery || selectedCategory !== "all" ? (
              <button
                className="clear-filters-button"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                Limpar Filtros
              </button>
            ) : (
              <button className="add-first-item-button" onClick={handleAddItem}>
                Adicione Seu Primeiro Item
              </button>
            )}
          </div>
        )}

        {isModalOpen && (
          <MenuItemModal
            item={currentItem}
            onSave={handleSaveItem}
            onClose={() => setIsModalOpen(false)}
            categories={categories}
          />
        )}
      </div>
    </div>
  )
}
