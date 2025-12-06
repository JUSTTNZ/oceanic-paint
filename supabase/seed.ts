// supabase/seed.ts
import { createClient } from '@supabase/supabase-js'
import { mockPaints } from '../lib/mockData'

// Manually enter your Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY' // Use the service role key for seeding

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and service role key are required.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDatabase() {
  console.log('Seeding database...')

  // Clear existing data
  const { error: deleteError } = await supabase.from('products').delete().gt('id', 0)
  if (deleteError) {
    console.error('Error clearing products table:', deleteError)
    return
  }
  console.log('Cleared existing products.')

  // Insert new data
  const { data, error } = await supabase.from('products').insert(mockPaints).select()

  if (error) {
    console.error('Error seeding database:', error)
  } else {
    console.log('Database seeded successfully:', data)
  }
}

seedDatabase()
