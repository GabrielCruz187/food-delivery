import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xwitpwlvlmxyokcmxoms.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aXRwd2x2bG14eW9rY214b21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTE4MDYsImV4cCI6MjA2MzU4NzgwNn0.yHEc-N_4mO-1dgDrPclPYFZCBQj09M5XqMrJId7p09g"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
