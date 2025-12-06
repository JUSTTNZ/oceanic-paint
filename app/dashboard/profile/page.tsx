import Link from "next/link"
import { FaChevronLeft } from "react-icons/fa"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProfileClient from "./ProfileClient"

export default async function ProfilePage() {
    const supabase = createSupabaseServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    return (
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                <FaChevronLeft size={18} />
                Back to Dashboard
            </Link>

            <h1 className="font-grotesk text-3xl font-bold text-foreground mb-8">Edit Profile</h1>

            <ProfileClient user={user} profile={profile} />
        </div>
    )
}
