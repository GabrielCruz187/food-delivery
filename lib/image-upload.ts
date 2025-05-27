import { supabase } from "./superbase"

export async function uploadImage(file: File): Promise<string> {
  try {
    // Criar um nome de arquivo único
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `menu-items/${fileName}`

    // Fazer upload do arquivo
    const { error } = await supabase.storage.from("food-delivery-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Obter a URL pública do arquivo
    const { data } = supabase.storage.from("food-delivery-images").getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extrair o caminho do arquivo da URL
    const urlParts = imageUrl.split("/")
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `menu-items/${fileName}`

    const { error } = await supabase.storage.from("food-delivery-images").remove([filePath])

    if (error) throw error
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}
