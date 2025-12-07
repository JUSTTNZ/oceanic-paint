"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, ChevronLeft, ArrowRight, LogIn } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { removeFromCart, updateCartItem } from "@/lib/cartSlice"
import type { RootState, AppDispatch } from "@/lib/store"

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const user = useSelector((state: RootState) => state.auth.user)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ id, quantity }))
    }
  }

  const handleProceedToCheckout = () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    router.push("/checkout")
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
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
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ChevronLeft size={18} />
          Continue Shopping
        </Link>

        <h1 className="font-grotesk text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {/* Login Prompt */}
        {showLoginPrompt && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <LogIn size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800">Login Required</h3>
                  <p className="text-sm text-yellow-700">
                    You need to be logged in to proceed to checkout.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="px-4 py-2 border border-primary text-primary rounded font-medium hover:bg-primary/5 transition"
                >
                  Register
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-3 py-2 text-muted-foreground hover:text-foreground transition"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Status */}
        {user ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase() || user.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Logged in as {user.email || user.name}</p>
                <p className="text-xs text-green-600">You can proceed to checkout</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/account")}
              className="text-sm text-green-600 hover:text-green-800 transition"
            >
              View Account
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <LogIn size={18} className="text-blue-600" />
              </div>
              <p className="text-sm text-blue-700">
                Log in to save your cart and proceed to checkout faster.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-4 py-2 border border-primary text-primary rounded text-sm font-medium hover:bg-primary/5 transition"
              >
                Register
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border border-border rounded-lg bg-card">
                <div className="relative w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground text-xs">No image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-grotesk font-bold text-foreground hover:text-primary cursor-pointer">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.color && `${item.color} • `}{item.size}
                  </p>
                  <p className="font-grotesk font-bold text-foreground mt-2">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-destructive hover:text-destructive/80 transition"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center gap-2 border border-border rounded">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-muted transition"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-medium text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-muted transition"
                    >
                      +
                    </button>
                  </div>

                  <div className="font-grotesk font-bold text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 bg-card sticky top-20">
              <h2 className="font-grotesk font-bold text-xl text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-grotesk font-bold text-lg text-foreground">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {user ? (
                <Link
                  href="/checkout"
                  className="w-full block py-3 bg-primary text-primary-foreground rounded font-bold text-center hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>
              )}

              <p className="text-xs text-muted-foreground text-center mt-4">
                {user 
                  ? "You are logged in and can proceed to checkout" 
                  : "You will be prompted to login before checkout"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}