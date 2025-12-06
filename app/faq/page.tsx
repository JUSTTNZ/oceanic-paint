"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { FaChevronDown } from "react-icons/fa"

const faqs = [
  {
    question: "What makes Oceanic Paint different?",
    answer:
      "Oceanic Paint is formulated with premium ingredients to provide superior coverage, durability, and color vibrancy. We're committed to quality and sustainability.",
  },
  {
    question: "How long does paint typically last?",
    answer:
      "Interior paint typically lasts 3-5 years, while exterior paint lasts 5-7 years depending on climate and exposure. Regular maintenance can extend the life.",
  },
  {
    question: "Do you offer custom colors?",
    answer: "Yes! We offer color matching services. Visit our store or contact us to create your perfect shade.",
  },
  {
    question: "What's your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you're not happy with your purchase, return it for a full refund or exchange.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship within the continental US. Contact us for information about international shipping options.",
  },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-grotesk text-4xl font-bold text-foreground mb-4 text-center">
            Frequently Asked Questions
          </h1>
          <p className="text-center text-muted-foreground mb-12">Find answers to common questions about Oceanic Paint</p>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full p-6 bg-card border border-border rounded-lg hover:shadow-md transition text-left"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-grotesk font-bold text-foreground">{faq.question}</h3>
                  <FaChevronDown size={20} className={`text-primary transition ${open === idx ? "rotate-180" : ""}`} />
                </div>
                {open === idx && <p className="text-muted-foreground mt-4">{faq.answer}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
