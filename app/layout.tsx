import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Host_Grotesk as Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _inter = Inter({ subsets: ["latin"] })
const _grotesk = Grotesk({ subsets: ["latin"], variable: "--font-grotesk" })

export const metadata: Metadata = {
  title: "Oceanic Paint - Premium Paint Products",
  description: "High-quality paint products for interior, exterior, and specialized finishes",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let user = null
  
  try {
    // Add await here since createSupabaseServerClient is async
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error('Error fetching user:', error)
    // Continue without user data if there's an error
  }

  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_grotesk.variable} flex flex-col min-h-screen`}>
        <Navigation user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}