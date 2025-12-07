"use client"

import useSWR from "swr"
import { useCallback } from "react"

export function useAuth() {
  const { data: user, mutate } = useSWR("user", () => {
    // Get user from localStorage or session
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })

  const signup = useCallback(
    async (email: string, password: string, fullName: string) => {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, fullName }),
        })

        const result = await response.json()
        if (response.ok) {
          localStorage.setItem("user", JSON.stringify(result.user))
          mutate(result.user)
          return result
        }
        throw new Error(result.error)
      } catch (error) {
        console.error("[v0] Signup error:", error)
        throw error
      }
    },
    [mutate],
  )

  const signin = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        const result = await response.json()
        if (response.ok) {
          localStorage.setItem("user", JSON.stringify(result.user))
          localStorage.setItem("role", result.role)
          mutate(result.user)
          return result
        }
        throw new Error(result.error)
      } catch (error) {
        console.error("[v0] Signin error:", error)
        throw error
      }
    },
    [mutate],
  )

  const signout = useCallback(async () => {
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    mutate(null)
  }, [mutate])

  return { user, signup, signin, signout }
}
