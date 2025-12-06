"use client"

"use client"

import Link from "next/link"
import { FaCheckCircle, FaBox } from "react-icons/fa"

export default function OrderSuccessPage() {
  return (
    <>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Success Badge */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <FaCheckCircle size={80} className="text-secondary" />
            </div>
            <h1 className="font-grotesk text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Generic Order Details */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8 text-center">
             <h2 className="font-grotesk font-bold text-foreground mb-4">You will receive an email confirmation shortly.</h2>
             <p className="text-muted-foreground text-sm">
                Your order details and tracking information will be sent to your registered email address.
             </p>
          </div>


          {/* Next Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-muted/30 p-6 rounded-lg">
              <FaBox size={24} className="text-primary mb-3" />
              <h3 className="font-bold text-foreground mb-2">Track Your Order</h3>
              <p className="text-sm text-muted-foreground">
                You'll receive a tracking email shortly with shipping updates.
              </p>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <FaCheckCircle size={24} className="text-secondary mb-3" />
              <h3 className="font-bold text-foreground mb-2">View in Dashboard</h3>
              <p className="text-sm text-muted-foreground">Check your account dashboard to view all your orders.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="flex-1 px-8 py-3 bg-primary text-primary-foreground rounded font-bold text-center hover:opacity-90 transition"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/products"
              className="flex-1 px-8 py-3 border-2 border-primary text-primary rounded font-bold text-center hover:bg-primary/5 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

