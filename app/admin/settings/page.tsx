"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, User, Lock, Store, Loader2 } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { getCurrentUser, logout } from "@/lib/api"
import { supabase } from "@/lib/superbase"
import "../../../styles/admin-settings.css"

export default function AdminSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<any>(null)

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [storeSettings, setStoreSettings] = useState({
    storeName: "Food Delivery App",
    storeDescription: "Delicious food delivered to your door",
    deliveryFee: "5.00",
    minimumOrder: "15.00",
    deliveryTime: "30-45 minutes",
    storePhone: "(555) 123-4567",
    storeEmail: "info@fooddelivery.com",
  })

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  async function checkAuthAndLoadData() {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser || !currentUser.isAdmin) {
        router.push("/admin/login")
        return
      }

      setUser(currentUser)
      setProfileData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        city: currentUser.city || "",
        zipCode: currentUser.zipCode || "",
      })
    } catch (error) {
      console.error("Error:", error)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          zip_code: profileData.zipCode,
        })
        .eq("id", user.id)

      if (error) throw error

      alert("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Falha ao atualizar perfil. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("As novas senhas não coincidem!")
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres!")
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      alert("Senha atualizada com sucesso!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      alert("Falha ao atualizar senha. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  const handleStoreSettingsSave = async () => {
    setSaving(true)
    try {
      // Em uma aplicação real, você salvaria essas configurações no banco de dados
      // Por enquanto, vamos apenas simular o salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Configurações da loja atualizadas com sucesso!")
    } catch (error) {
      console.error("Error updating store settings:", error)
      alert("Falha ao atualizar configurações da loja. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    if (window.confirm("Tem certeza de que deseja sair?")) {
      try {
        await logout()
        router.push("/admin/login")
      } catch (error) {
        console.error("Error logging out:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-container">
            <Loader2 size={48} className="animate-spin" />
            <p>Carregando configurações...</p>
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
          <h1>Configurações</h1>
          <button className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </div>

        <div className="settings-container">
          <div className="settings-tabs">
            <button
              className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={20} />
              Perfil
            </button>
            <button
              className={`tab-button ${activeTab === "password" ? "active" : ""}`}
              onClick={() => setActiveTab("password")}
            >
              <Lock size={20} />
              Senha
            </button>
            <button
              className={`tab-button ${activeTab === "store" ? "active" : ""}`}
              onClick={() => setActiveTab("store")}
            >
              <Store size={20} />
              Configurações da Loja
            </button>
          </div>

          <div className="settings-content">
            {activeTab === "profile" && (
              <div className="settings-section">
                <h2>Informações do Perfil</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={profileData.email} disabled className="disabled-input" />
                    <small>O email não pode ser alterado</small>
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Endereço</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Cidade</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>CEP</label>
                    <input
                      type="text"
                      value={profileData.zipCode}
                      onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                    />
                  </div>
                </div>
                <button className="save-button" onClick={handleProfileSave} disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Salvar Perfil
                </button>
              </div>
            )}

            {activeTab === "password" && (
              <div className="settings-section">
                <h2>Alterar Senha</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Senha Atual</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nova Senha</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Nova Senha</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  className="save-button"
                  onClick={handlePasswordChange}
                  disabled={saving || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                  Atualizar Senha
                </button>
              </div>
            )}

            {activeTab === "store" && (
              <div className="settings-section">
                <h2>Configurações da Loja</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome da Loja</label>
                    <input
                      type="text"
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Descrição da Loja</label>
                    <textarea
                      value={storeSettings.storeDescription}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeDescription: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Taxa de Entrega (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={storeSettings.deliveryFee}
                      onChange={(e) => setStoreSettings({ ...storeSettings, deliveryFee: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pedido Mínimo (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={storeSettings.minimumOrder}
                      onChange={(e) => setStoreSettings({ ...storeSettings, minimumOrder: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tempo de Entrega</label>
                    <input
                      type="text"
                      value={storeSettings.deliveryTime}
                      onChange={(e) => setStoreSettings({ ...storeSettings, deliveryTime: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone da Loja</label>
                    <input
                      type="tel"
                      value={storeSettings.storePhone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email da Loja</label>
                    <input
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                    />
                  </div>
                </div>
                <button className="save-button" onClick={handleStoreSettingsSave} disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Salvar Configurações da Loja
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
