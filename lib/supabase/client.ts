// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Function to create a new client instance
export const createSupabaseBrowserClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be used in the browser')
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase credentials')
  }

  return createBrowserClient(url, key)
}