import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: cartItems, error } = await supabase
      .from("carts")
      .select(`
        id,
        product_id,
        quantity,
        color,
        size,
        products (
          name,
          price,
          image
        )
      `)
      .eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("[v0] Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, color, size, quantity } = await request.json()

    const { data, error } = await supabase.from("carts").upsert({
      user_id: user.id,
      product_id: productId,
      color,
      size,
      quantity,
    })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get("id")

    const { error } = await supabase.from("carts").delete().eq("id", cartId).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 400 })
  }
}
