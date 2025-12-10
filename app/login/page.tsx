"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { login } from "@/lib/authSlice"
import type { AppDispatch } from "@/lib/store"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      toast.error("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      // Use the API route instead of direct Supabase
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()
      
      console.log("Login response:", data)
      
      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Get the user role
      const userRole = data.role || "customer"
      console.log("User role:", userRole)
      
      // Dispatch to Redux with correct role
      dispatch(
        login({
          id: data.user.id,
          email: data.user.email,
          name: data.user.full_name || data.user.user_metadata?.display_name || email.split('@')[0],
          role: userRole,
          isAdmin: userRole === "admin",
        })
      )

      // IMPORTANT: Also set up Supabase session client-side
      try {
        const supabase = createSupabaseBrowserClient()
        await supabase.auth.getSession() // This will sync the session
      } catch (error) {
        console.error("Failed to sync session:", error)
      }

      toast.success("Login successful!")

      // REDIRECT BASED ON ROLE
      if (userRole === "admin") {
        console.log("Admin user detected, redirecting to admin dashboard")
        router.push("/admin")
      } else {
        console.log("Regular user detected, redirecting to dashboard")
        router.push("/dashboard")
      }
      
      router.refresh()
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-grotesk text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Oceanic Paint account</p>
          </div>

          <form onSubmit={handleLogin} className="bg-card border border-border rounded-lg p-8 space-y-4">

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}