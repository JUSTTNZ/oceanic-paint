"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-grotesk text-4xl font-bold text-foreground mb-4 text-center">Get in Touch</h1>
          <p className="text-center text-muted-foreground mb-12">We'd love to hear from you. Contact us today!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <Mail size={24} className="text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">info@evanspaints.com</p>
                  <p className="text-muted-foreground">support@evanspaints.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone size={24} className="text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground mb-1">Phone</h3>
                  <p className="text-muted-foreground">+1 (234) 567-890</p>
                  <p className="text-muted-foreground text-sm text-muted-foreground">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin size={24} className="text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground mb-1">Address</h3>
                  <p className="text-muted-foreground">123 Paint Street</p>
                  <p className="text-muted-foreground">Art City, AC 12345</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitted && (
                <div className="p-4 bg-secondary/20 text-secondary rounded">Thank you! We'll get back to you soon.</div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
