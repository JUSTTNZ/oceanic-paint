"use client"

import type React from "react"
import { useEffect } from "react"
import { Provider, useDispatch } from "react-redux"
import { store } from "@/lib/store"
import { setUser } from "@/lib/authSlice"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthLoader>{children}</AuthLoader>
    </Provider>
  )
}

// Component to restore user session on app load
function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const supabase = createSupabaseBrowserClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          dispatch(setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.email || "User",
            role: session.user.user_metadata?.role || "customer",
            isAdmin: session.user.user_metadata?.isAdmin || false,
          }))
        }
      } catch (error) {
        console.error("Failed to restore user session:", error)
      }
    }

    restoreUser()
  }, [dispatch])

  return <>{children}</>
}
