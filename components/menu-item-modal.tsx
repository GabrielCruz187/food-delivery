"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import "../styles/menu-item-modal.css"

export default function MenuItemModal({ item, onSave, onClose, categories }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        image: item.image,
      })
    } else {
      // Default values for new item
      setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
        category: categories[0] || "",
        image: "/placeholder.svg?height=150&width=200&text=New+Item",
      })
    }
  }, [item, categories])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price.trim()) newErrors.price = "Price is required"
    if (isNaN(Number.parseFloat(formData.price))) newErrors.price = "Price must be a number"
    if (!formData.category) newErrors.category = "Category is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    onSave({
      ...formData,
      price: Number.parseFloat(formData.price),
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{item ? "Edit Menu Item" : "Add New Menu Item"}</h2>
          <button className="close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Item Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? "error" : ""}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? "error" : ""}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} />
            <p className="help-text">For demo purposes, you can use placeholder images</p>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              {item ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

