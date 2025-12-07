// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createSupabaseServerClient = async () => {
  // cookies() returns a Promise in Next.js 14+
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // The cookieStore.get() method might not exist or might work differently
          try {
            // Try getting cookie using getAll() if get() doesn't work
            const allCookies = cookieStore.getAll()
            const cookie = allCookies.find(c => c.name === name)
            return cookie?.value
          } catch (error) {
            return undefined
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignore - middleware handles it
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ 
              name, 
              value: '', 
              ...options, 
              maxAge: 0,
              expires: new Date(0)
            })
          } catch (error) {
            // Ignore
          }
        },
      },
    }
  )
}