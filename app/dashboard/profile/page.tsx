"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { FaChevronLeft } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import type { RootState } from "@/lib/store"

export default function ProfilePage() {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <FaChevronLeft size={18} />
          Back to Dashboard
        </Link>

        <h1 className="font-grotesk text-3xl font-bold text-foreground mb-8">Edit Profile</h1>

        <form onSubmit={handleSave} className="bg-card border border-border rounded-lg p-8 space-y-6">
          {saved && <div className="p-4 bg-secondary/20 text-secondary rounded">Profile updated successfully!</div>}

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
              value={email}
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
            <Link
              href="/dashboard"
              className="flex-1 py-2 border-2 border-primary text-primary rounded font-bold text-center hover:bg-primary/5 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
