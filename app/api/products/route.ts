import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const color = searchParams.get("color")

    let query = supabase.from("products").select("*")

    if (category && category !== "All") {
      query = query.eq("category", category)
    }

    const { data: products, error } = await query

    if (error) throw error

    // Fetch colors and sizes for each product
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const [{ data: colors }, { data: sizes }] = await Promise.all([
          supabase.from("product_colors").select("color").eq("product_id", product.id),
          supabase.from("product_sizes").select("size").eq("product_id", product.id),
        ])

        return {
          ...product,
          colors: colors?.map((c) => c.color) || [],
          sizes: sizes?.map((s) => s.size) || [],
        }
      }),
    )

    // Filter by color if provided
    let filtered = productsWithDetails
    if (color && color !== "All") {
      filtered = filtered.filter((p) => p.colors.includes(color))
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
