import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { email, amount, reference, metadata } = body

    // Your Paystack secret key
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

    if (!PAYSTACK_SECRET_KEY) {
      console.error("Paystack secret key not configured")
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 })
    }

    // Initialize Paystack payment
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount), // Already in kobo
        reference,
        metadata,
 callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-success`,
      }),
    })

    const data = await response.json()

    if (!data.status) {
      throw new Error(data.message || "Failed to initialize payment")
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[PAYSTACK] Error:", error)
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 400 })
  }
}