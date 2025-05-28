"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Upload, Loader2 } from "lucide-react"
import { uploadImage } from "@/lib/image-upload"
import "../styles/menu-item-modal.css"

interface MenuItemModalProps {
  item?: any
  onSave: (item: any) => void
  onClose: () => void
  categories: string[]
}

export default function MenuItemModal({ item, onSave, onClose, categories }: MenuItemModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id || "",
        name: item.name || "",
        description: item.description || "",
        price: item.price?.toString() || "",
        category: item.category || "",
        image: item.image || "",
      })
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
        category: categories[0] || "",
        image: "/placeholder.svg?height=200&width=250&text=Novo+Item",
      })
    }
  }, [item, categories])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Preço é obrigatório"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Preço deve ser um número positivo válido"
    }

    if (!formData.category) {
      newErrors.category = "Categoria é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("📁 Arquivo selecionado:", file.name, "Tamanho:", file.size)

      // Verificar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione um arquivo de imagem")
        return
      }

      // Verificar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("O tamanho da imagem deve ser menor que 5MB")
        return
      }

      setImageFile(file)
      // Criar uma URL temporária para visualização
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }))

      console.log("✅ Arquivo preparado para upload")
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSaving(true)
      setUploadProgress("Validando formulário...")

      // Se houver um novo arquivo de imagem, faça o upload
      let imageUrl = formData.image
      if (imageFile) {
        console.log("🔄 Iniciando upload da imagem...")
        setIsUploading(true)
        setUploadProgress("Fazendo upload da imagem...")

        try {
          imageUrl = await uploadImage(imageFile)
          console.log("✅ Upload concluído! URL:", imageUrl)
          setUploadProgress("Imagem enviada com sucesso!")
        } catch (uploadError) {
          console.error("❌ Erro no upload:", uploadError)
          alert(`Falha ao enviar imagem: ${uploadError.message}`)
          return
        } finally {
          setIsUploading(false)
        }
      }

      setUploadProgress("Salvando item...")

      const itemData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        image: imageUrl,
      }

      console.log("💾 Salvando item:", itemData)

      await onSave(itemData)

      console.log("✅ Item salvo com sucesso!")
      setUploadProgress("Item salvo com sucesso!")

      // Limpar o arquivo temporário
      if (imageFile && formData.image.startsWith("blob:")) {
        URL.revokeObjectURL(formData.image)
      }

      onClose()
    } catch (error) {
      console.error("❌ Erro ao salvar item:", error)
      alert(`Falha ao salvar item do cardápio: ${error.message}`)
    } finally {
      setIsUploading(false)
      setIsSaving(false)
      setUploadProgress("")
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>{item ? "Editar Item do Cardápio" : "Adicionar Novo Item"}</h2>
          <button className="close-modal" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome do Item *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="Digite o nome do item"
              disabled={isSaving}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
              placeholder="Digite a descrição do item"
              rows={3}
              disabled={isSaving}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Preço (R$) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? "error" : ""}
                placeholder="0,00"
                step="0.01"
                min="0"
                disabled={isSaving}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoria *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? "error" : ""}
                disabled={isSaving}
              >
                <option value="">Selecione uma categoria</option>
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
            <label htmlFor="image">Imagem</label>
            <div className="image-upload-container">
              {formData.image ? (
                <div className="image-preview" onClick={!isSaving ? handleImageClick : undefined}>
                  <img src={formData.image || "/placeholder.svg"} alt="Visualização" />
                  <div className="image-overlay">
                    {isUploading ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : isSaving ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} />
                        <span>Alterar Imagem</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder" onClick={!isSaving ? handleImageClick : undefined}>
                  <Upload size={24} />
                  <span>Enviar Imagem</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
                disabled={isSaving}
              />
            </div>
            <p className="help-text">
              Clique para enviar ou alterar imagem (máx 5MB)
              {imageFile && <span className="file-info"> - Selecionado: {imageFile.name}</span>}
            </p>
            {uploadProgress && <p className="upload-progress">{uploadProgress}</p>}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose} disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="save-button" disabled={isUploading || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isUploading ? "Enviando..." : "Salvando..."}
                </>
              ) : item ? (
                "Atualizar Item"
              ) : (
                "Adicionar Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
