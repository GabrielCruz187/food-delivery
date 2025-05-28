// test-storage.js
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xwitpwlvlmxyokcmxoms.supabase.co'  // Use sua URL real
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aXRwd2x2bG14eW9rY214b21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTE4MDYsImV4cCI6MjA2MzU4NzgwNn0.yHEc-N_4mO-1dgDrPclPYFZCBQj09M5XqMrJId7p09g'                // Use sua chave real
const supabase = createClient(supabaseUrl, supabaseKey)

async function testStorage() {
  try {
    console.log('🔍 Testando configuração do Storage...')
    
    // Primeiro, fazer login como admin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123'
    })
    
    if (authError) {
      console.error('❌ Erro de autenticação:', authError.message)
      return
    }
    
    console.log('✅ Autenticado como:', authData.user.email)
    
    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError.message)
      return
    }
    
    console.log('📁 Buckets disponíveis:', buckets.map(b => b.name))
    
    const foodBucket = buckets.find(b => b.name === 'food-delivery-images')
    if (!foodBucket) {
      console.error('❌ Bucket "food-delivery-images" não encontrado!')
      return
    }
    
    console.log('✅ Bucket encontrado:', foodBucket)
    
    // Testar listagem de arquivos
    const { data: files, error: filesError } = await supabase.storage
      .from('food-delivery-images')
      .list('menu-items', { limit: 5 })
    
    if (filesError) {
      console.error('❌ Erro ao listar arquivos:', filesError.message)
    } else {
      console.log('📄 Arquivos no bucket:', files.length)
      files.forEach(file => console.log('  -', file.name))
    }
    
    // Logout
    await supabase.auth.signOut()
    console.log('✅ Teste concluído!')
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testStorage()