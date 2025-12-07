import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = params

    const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) throw error
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Fetch colors and sizes
    const [{ data: colors }, { data: sizes }] = await Promise.all([
      supabase.from("product_colors").select("color").eq("product_id", id),
      supabase.from("product_sizes").select("size").eq("product_id", id),
    ])

    return NextResponse.json({
      ...product,
      colors: colors?.map((c) => c.color) || [],
      sizes: sizes?.map((s) => s.size) || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
