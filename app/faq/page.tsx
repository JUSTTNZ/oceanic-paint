"use client"

import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)
const faqs = [
    {
      question: "What types of paint do you offer?",
      answer: "We offer a variety of paint types including interior, exterior, gloss, matte, semi-gloss, and eggshell finishes to suit your project needs.",
    },
 
  ]
      return (
    <>
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
    </>
  )
}

