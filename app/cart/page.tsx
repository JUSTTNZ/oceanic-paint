"use client"

import Link from "next/link"

export default function CartPage() {
  // The cart is not implemented with Supabase yet.
  // This is a placeholder page.
  const cartItems: any[] = []

  if (cartItems.length === 0) {
    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="font-grotesk text-4xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground text-lg mb-8">Add some beautiful paints to get started!</p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
   // This part will be implemented later
   <></>
  )
}
