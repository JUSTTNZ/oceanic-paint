"use client"

import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FaBox, FaUser, FaSignOutAlt } from "react-icons/fa"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { logout } from "@/lib/authSlice"
import { mockOrders } from "@/lib/mockData"
import type { RootState, AppDispatch } from "@/lib/store"

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-grotesk text-3xl font-bold text-foreground">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">Manage your account and orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <FaUser size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-grotesk font-bold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Link href="/dashboard/profile" className="text-primary hover:underline text-sm font-medium">
              Edit Profile →
            </Link>
          </div>

          {/* Orders Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <FaBox size={24} className="text-secondary mb-4" />
            <h3 className="font-grotesk font-bold text-foreground mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-foreground mb-2">{mockOrders.length}</p>
            <Link href="#orders" className="text-primary hover:underline text-sm font-medium">
              View Orders →
            </Link>
          </div>

          {/* Loyalty */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-primary-foreground font-bold text-sm">★</span>
            </div>
            <h3 className="font-grotesk font-bold text-foreground mb-2">Loyalty Points</h3>
            <p className="text-3xl font-bold text-foreground mb-2">250</p>
            <p className="text-xs text-muted-foreground">Earn more with every purchase</p>
          </div>
        </div>

        {/* Orders Section */}
        <div id="orders" className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="font-grotesk text-2xl font-bold text-foreground mb-6">Recent Orders</h2>
          {mockOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Items</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Total</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition">
                      <td className="py-4 px-4 text-foreground font-medium">{order.id}</td>
                      <td className="py-4 px-4 text-foreground">{order.date}</td>
                      <td className="py-4 px-4 text-foreground">{order.items} item(s)</td>
                      <td className="py-4 px-4 text-foreground font-bold">${order.total.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            order.status === "Delivered"
                              ? "bg-secondary/20 text-secondary"
                              : "bg-yellow-500/20 text-yellow-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-primary hover:underline text-sm font-medium">View →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No orders yet.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/products"
            className="p-6 bg-primary/10 border border-primary rounded-lg hover:bg-primary/20 transition"
          >
            <h3 className="font-bold text-primary mb-2">Continue Shopping</h3>
            <p className="text-sm text-muted-foreground">Discover more paint products</p>
          </Link>
          <button
            onClick={handleLogout}
            className="p-6 bg-destructive/10 border border-destructive rounded-lg hover:bg-destructive/20 transition text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <FaSignOutAlt size={18} className="text-destructive" />
              <h3 className="font-bold text-destructive">Logout</h3>
            </div>
            <p className="text-sm text-muted-foreground">Sign out of your account</p>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
