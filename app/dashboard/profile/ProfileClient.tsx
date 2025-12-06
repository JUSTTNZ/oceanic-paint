"use client"

import type React from "react"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"


export default function ProfileClient({ user, profile }: { user: User | null, profile: any }) {
    const router = useRouter()
    const [name, setName] = useState(profile?.full_name || "")
    const [phone, setPhone] = useState(profile?.phone || "")
    const [address, setAddress] = useState(profile?.address || "")
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState("")

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSaved(false)

        const { error } = await supabase
            .from("profiles")
            .update({ full_name: name, phone, address })
            .eq("id", user?.id)
        
        if (error) {
            setError(error.message)
        } else {
            setSaved(true)
            router.refresh()
            setTimeout(() => setSaved(false), 3000)
        }
    }

    return (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-lg p-8 space-y-6">
            {saved && <div className="p-4 bg-secondary/20 text-secondary rounded">Profile updated successfully!</div>}
            {error && <div className="p-4 bg-destructive/10 text-destructive rounded">{error}</div>}

            {/* Name */}
            <div>
                <label className="block font-bold text-foreground mb-2">Full Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Email */}
            <div>
                <label className="block font-bold text-foreground mb-2">Email Address</label>
                <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 border border-border rounded bg-muted text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
                <label className="block font-bold text-foreground mb-2">Phone Number</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Address */}
            <div>
                <label className="block font-bold text-foreground mb-2">Address</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Paint Street, Art City, AC 12345"
                    className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-border">
                <button
                    type="submit"
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition"
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 py-2 border-2 border-primary text-primary rounded font-bold text-center hover:bg-primary/5 transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
