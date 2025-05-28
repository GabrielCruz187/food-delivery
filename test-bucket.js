const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xwitpwlvlmxyokcmxoms.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aXRwd2x2bG14eW9rY214b21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTE4MDYsImV4cCI6MjA2MzU4NzgwNn0.yHEc-N_4mO-1dgDrPclPYFZCBQj09M5XqMrJId7p09g'                 // Use sua chave real
const supabase = createClient(supabaseUrl, supabaseKey)

async function testBucketDirect() {
  try {
    console.log('🔍 Testando acesso direto ao bucket...')
    
    // Fazer login como admin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123'
    })
    
    if (authError) {
      console.error('❌ Erro de autenticação:', authError.message)
      return
    }
    
    console.log('✅ Autenticado como:', authData.user.email)
    
    // Tentar acessar o bucket diretamente
    const { data: files, error: filesError } = await supabase.storage
      .from('food-delivery-images')
      .list('', { limit: 1 })
    
    if (filesError) {
      console.error('❌ Erro ao acessar bucket:', filesError.message)
    } else {
      console.log('✅ Bucket acessível! Arquivos encontrados:', files.length)
    }
    
    // Tentar listar pasta menu-items
    const { data: menuFiles, error: menuError } = await supabase.storage
      .from('food-delivery-images')
      .list('menu-items', { limit: 5 })
    
    if (menuError) {
      console.error('❌ Erro ao acessar pasta menu-items:', menuError.message)
    } else {
      console.log('✅ Pasta menu-items acessível! Arquivos:', menuFiles.length)
    }
    
    // Logout
    await supabase.auth.signOut()
    console.log('✅ Teste concluído!')
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testBucketDirect()