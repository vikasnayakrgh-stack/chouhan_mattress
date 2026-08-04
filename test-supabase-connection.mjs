import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing env vars')
  process.exit(1)
}

const sb = createClient(url, key, { auth: { persistSession: false } })

console.log('Testing connection to:', url)

try {
  const { data, error, count } = await sb
    .from('products')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.log('Query error (expected if tables not yet created):', error.message)
    console.log('Code:', error.code)
  } else {
    console.log('Connected! Products count:', count)
    if (data) console.log('Sample data:', data.slice(0, 3))
  }
} catch (e) {
  console.error('Connection failed:', e)
}