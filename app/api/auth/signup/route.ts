import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()
    const supabase = await createSupabaseServerClient()

    // Sign up user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // ADD THIS: Set display_name in user metadata
        data: {
          display_name: fullName,
        },
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) throw error

    // Create user profile
    if (data.user) {
      await supabase.from("user_profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "customer",
      })
    }

    return NextResponse.json({ user: data.user })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 400 })
  }
}
