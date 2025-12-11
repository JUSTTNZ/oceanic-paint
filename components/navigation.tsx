"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X, LogOut, User } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { logout } from "@/lib/authSlice"
import type { RootState } from "@/lib/store"

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const cartItems = useSelector((state: RootState) => state.cart.items)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded">
              <span className="font-grotesk text-lg font-bold text-primary-foreground">OP</span>
            </div>
            <span className="hidden  font-medium text-foreground sm:inline">Oceanic Paints</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/products" className="font-medium text-foreground hover:text-primary transition">
              Shop
            </Link>
            <Link href="/build-order" className="font-medium text-foreground hover:text-primary transition">
              Build Order
            </Link>
            <Link href="/about" className="font-medium text-foreground hover:text-primary transition">
              About
            </Link>
            <Link href="/contact" className="font-medium text-foreground hover:text-primary transition">
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {mounted && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-4">
                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded font-medium text-sm hover:opacity-90 transition"
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition"
                    >
                      <User size={18} />
                     
                    </Link>
                    <button onClick={handleLogout} className="text-foreground hover:text-primary transition" title="Logout">
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-foreground hover:text-primary transition font-medium">
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium text-sm hover:opacity-90 transition"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <ShoppingCart size={20} className="text-foreground hover:text-primary transition" />
              {mounted && cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground" title="Toggle menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && mounted && (
          <div className="border-t border-border md:hidden pb-4">
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/products" className="px-4 py-2 text-foreground hover:bg-muted rounded">
                Shop
              </Link>
              <Link href="/build-order" className="px-4 py-2 text-foreground hover:bg-muted rounded">
                Build Order
              </Link>
              <Link href="/about" className="px-4 py-2 text-foreground hover:bg-muted rounded">
                About
              </Link>
              <Link href="/contact" className="px-4 py-2 text-foreground hover:bg-muted rounded">
                Contact
              </Link>
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link href="/admin" className="px-4 py-2 bg-secondary text-secondary-foreground rounded">
                      Admin
                    </Link>
                  )}
                  <Link href="/dashboard" className="px-4 py-2 text-foreground hover:bg-muted rounded">
                    Dashboard 
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-foreground hover:bg-muted rounded text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-foreground hover:bg-muted rounded">
                    Login
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-primary text-primary-foreground rounded">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
