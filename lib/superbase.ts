import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xwitpwlvlmxyokcmxoms.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aXRwd2x2bG14eW9rY214b21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTE4MDYsImV4cCI6MjA2MzU4NzgwNn0.yHEc-N_4mO-1dgDrPclPYFZCBQj09M5XqMrJId7p09g"


export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          address: string | null
          city: string | null
          zip_code: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          zip_code?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          zip_code?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          category_id: number | null
          image_url: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          category_id?: number | null
          image_url?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          category_id?: number | null
          image_url?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string | null
          status: string
          total: number
          payment_method: string | null
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          customer_address: string | null
          customer_city: string | null
          customer_zip_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          status?: string
          total: number
          payment_method?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          customer_address?: string | null
          customer_city?: string | null
          customer_zip_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          status?: string
          total?: number
          payment_method?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          customer_address?: string | null
          customer_city?: string | null
          customer_zip_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number | null
          menu_item_id: number | null
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: number
          order_id?: number | null
          menu_item_id?: number | null
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number | null
          menu_item_id?: number | null
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
  }
}

