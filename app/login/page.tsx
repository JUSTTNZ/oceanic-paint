"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { login } from "@/lib/authSlice"
import type { AppDispatch } from "@/lib/store"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    // Mock login logic
    dispatch(
      login({
        id: "1",
        email,
        name: email.split("@")[0],
        isAdmin: email === "admin@oceanicpaint.com",
      }),
    )

    if (email === "admin@oceanicpaint.com") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
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
            {error && <div className="p-4 bg-destructive/10 text-destructive rounded text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
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
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>

          <div className="mt-8 p-4 bg-muted/30 rounded text-sm text-muted-foreground">
            <p className="font-bold mb-2">Demo Credentials:</p>
            <p>User: user@example.com</p>
            <p>Admin: admin@oceanicpaint.com</p>
            <p>Password: any value</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
