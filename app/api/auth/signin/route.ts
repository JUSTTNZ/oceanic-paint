import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Get user profile to check role
    const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", data.user.id).single()

    return NextResponse.json({
      user: data.user,
      role: profile?.role || "customer",
    })
  } catch (error) {
    console.error("[v0] Signin error:", error)
    return NextResponse.json({ error: "Sign in failed" }, { status: 400 })
  }
}
