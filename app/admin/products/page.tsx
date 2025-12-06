import Link from "next/link"
import { FaChevronLeft } from "react-icons/fa"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProductsManagementClient from "./ProductsManagementClient"

export default async function ProductsManagementPage() {
    const supabase = await createSupabaseServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Basic admin check
    if (!user || !user.email?.endsWith("@oceanicpaint.com")) {
        redirect("/")
    }

    const { data: products } = await supabase.from("products").select("*")

    return (
        <>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
                <Link href="/admin" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                    <FaChevronLeft size={18} />
                    Back to Admin
                </Link>
                <ProductsManagementClient initialProducts={products || []} />
            </div>
        </>
    )
}
