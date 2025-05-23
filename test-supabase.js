// test-supabase.js
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xwitpwlvlmxyokcmxoms.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aXRwd2x2bG14eW9rY214b21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTE4MDYsImV4cCI6MjA2MzU4NzgwNn0.yHEc-N_4mO-1dgDrPclPYFZCBQj09M5XqMrJId7p09g'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    const { data, error } = await supabase.from('categories').select('*')
    if (error) throw error
    console.log('✅ Conexão com Supabase funcionando!')
    console.log('Categorias:', data)
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message)
  }
}

testConnection()