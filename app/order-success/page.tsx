"use client"

import React from "react"

import Link from "next/link"
import { FaCheckCircle, FaBox } from "react-icons/fa"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useSelector, useDispatch } from "react-redux"
import { clearCart } from "@/lib/cartSlice"
import type { RootState, AppDispatch } from "@/lib/store"

export default function OrderSuccessPage() {
  const dispatch = useDispatch<AppDispatch>()
  const cartItems = useSelector((state: RootState) => state.cart.items)

  // Clear cart on mount
  React.useEffect(() => {
    dispatch(clearCart())
  }, [dispatch])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

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

          {/* Order Details */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="font-grotesk font-bold text-foreground mb-4">Order Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order Number</p>
                  <p className="font-bold text-foreground">ORD-{Math.random().toString().slice(2, 8)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Order Date</p>
                  <p className="font-bold text-foreground">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estimated Delivery</p>
                  <p className="font-bold text-foreground">3-5 Business Days</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-foreground text-lg">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            {cartItems.length > 0 && (
              <div>
                <h3 className="font-bold text-foreground mb-4">Order Items</h3>
                <div className="space-y-2 text-sm">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-foreground">
                        {item.name} ({item.color}, {item.size}) x{item.quantity}
                      </span>
                      <span className="font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">Free</span>
              </div>
              <div className="flex justify-between font-grotesk font-bold text-lg pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-secondary">${total.toFixed(2)}</span>
              </div>
            </div>
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

      <Footer />
    </div>
  )
}
