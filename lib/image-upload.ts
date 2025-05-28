import { supabase } from "./superbase"

export async function uploadImage(file: File): Promise<string> {
  try {
    console.log("🔄 Iniciando upload da imagem:", file.name)

    // Verificar se o usuário está autenticado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("❌ Usuário não autenticado:", userError)
      throw new Error("User not authenticated")
    }

    console.log("✅ Usuário autenticado:", user.email)

    // Criar um nome de arquivo único
    const fileExt = file.name.split(".").pop()?.toLowerCase()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `menu-items/${fileName}`

    console.log("📁 Caminho do arquivo:", filePath)

    // Fazer upload do arquivo
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("food-delivery-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("❌ Erro no upload:", uploadError)
      throw uploadError
    }

    console.log("✅ Upload realizado com sucesso:", uploadData)

    // Obter a URL pública do arquivo
    const { data: urlData } = supabase.storage.from("food-delivery-images").getPublicUrl(filePath)

    console.log("🔗 URL pública gerada:", urlData.publicUrl)

    return urlData.publicUrl
  } catch (error) {
    console.error("❌ Erro geral no upload:", error)
    throw error
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extrair o caminho do arquivo da URL
    const urlParts = imageUrl.split("/")
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `menu-items/${fileName}`

    console.log("🗑️ Deletando imagem:", filePath)

    const { error } = await supabase.storage.from("food-delivery-images").remove([filePath])

    if (error) {
      console.error("❌ Erro ao deletar imagem:", error)
      throw error
    }

    console.log("✅ Imagem deletada com sucesso")
  } catch (error) {
    console.error("❌ Erro geral ao deletar:", error)
    throw error
  }
}
