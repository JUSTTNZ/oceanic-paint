import { createSupabaseServerClient } from "@/lib/supabase/server"
import ProductsClient from "./ProductsClient"

export default async function ProductsPage() {
    const supabase = createSupabaseServerClient()
    const { data: products } = await supabase.from("products").select("*")

    const categories = [...new Set(products?.map((p) => p.category) || [])]

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <h1 className="font-grotesk text-3xl font-bold text-foreground mb-8">Shop Paint Products</h1>
            <ProductsClient initialProducts={products || []} categories={categories} colors={[]} />
        </div>
    )
}

