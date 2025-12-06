"use client"

import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FaBox, FaShoppingCart, FaUsers, FaSignOutAlt } from "react-icons/fa"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { logout } from "@/lib/authSlice"
import { mockPaints, mockOrders } from "@/lib/mockData"
import type { RootState, AppDispatch } from "@/lib/store"

export default function AdminDashboard() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push("/")
    }
  }, [user, router])

  if (!user?.isAdmin) {
    return null
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-grotesk text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage products, orders, and users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <FaBox size={24} className="text-primary mb-4" />
            <h3 className="font-grotesk font-bold text-foreground mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-foreground">{mockPaints.length}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <FaShoppingCart size={24} className="text-secondary mb-4" />
            <h3 className="font-grotesk font-bold text-foreground mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-foreground">{mockOrders.length}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <FaUsers size={24} className="text-primary mb-4" />
            <h3 className="font-grotesk font-bold text-foreground mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-foreground">
              ${mockOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <FaUsers size={24} className="text-secondary mb-4" />
            <h3 className="font-grotesk font-bold text-foreground mb-2">Registered Users</h3>
            <p className="text-3xl font-bold text-foreground">150+</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Products Management */}
          <Link
            href="/admin/products"
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
          >
            <FaBox size={32} className="text-primary mb-4 group-hover:scale-110 transition" />
            <h2 className="font-grotesk text-2xl font-bold text-foreground mb-2">Products</h2>
            <p className="text-muted-foreground mb-4">Add, edit, and delete paint products</p>
            <span className="text-primary font-medium group-hover:underline">Manage Products →</span>
          </Link>

          {/* Orders Management */}
          <Link
            href="/admin/orders"
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
          >
            <FaShoppingCart size={32} className="text-secondary mb-4 group-hover:scale-110 transition" />
            <h2 className="font-grotesk text-2xl font-bold text-foreground mb-2">Orders</h2>
            <p className="text-muted-foreground mb-4">View and manage customer orders</p>
            <span className="text-primary font-medium group-hover:underline">Manage Orders →</span>
          </Link>

          {/* Reports */}
          <Link
            href="#reports"
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
          >
            <FaBox size={32} className="text-primary mb-4 group-hover:scale-110 transition" />
            <h2 className="font-grotesk text-2xl font-bold text-foreground mb-2">Reports</h2>
            <p className="text-muted-foreground mb-4">View sales and analytics reports</p>
            <span className="text-primary font-medium group-hover:underline">View Reports →</span>
          </Link>

          {/* Settings */}
          <Link
            href="#settings"
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
          >
            <FaUsers size={32} className="text-secondary mb-4 group-hover:scale-110 transition" />
            <h2 className="font-grotesk text-2xl font-bold text-foreground mb-2">Settings</h2>
            <p className="text-muted-foreground mb-4">Configure admin settings</p>
            <span className="text-primary font-medium group-hover:underline">Go to Settings →</span>
          </Link>
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="font-grotesk text-2xl font-bold text-foreground mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-bold text-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-bold text-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-bold text-foreground">Items</th>
                  <th className="text-left py-3 px-4 font-bold text-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-bold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4 text-foreground font-medium">{order.id}</td>
                    <td className="py-4 px-4 text-foreground">{order.date}</td>
                    <td className="py-4 px-4 text-foreground">{order.items}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 border-2 border-destructive text-destructive rounded font-bold hover:bg-destructive/10 transition"
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>
      </div>

      <Footer />
    </div>
  )
}
