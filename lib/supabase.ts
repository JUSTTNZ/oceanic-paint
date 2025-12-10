import { createBrowserClient } from "@supabase/ssr"

let supabase: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (typeof window === "undefined") {
    return null
  }

  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase URL or anon key")
    }

    supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabase
}
