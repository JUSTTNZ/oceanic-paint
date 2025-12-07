"use client"

import Link from "next/link"
import { ChevronLeft, Eye } from "lucide-react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { mockOrders } from "@/lib/mockData"
import type { RootState } from "@/lib/store"

export default function OrdersManagementPage() {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)
  const [orders, setOrders] = useState(mockOrders)
  const [filterStatus, setFilterStatus] = useState("All")

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push("/")
    }
  }, [user, router])

  if (!user?.isAdmin) {
    return null
  }

  const filteredOrders = filterStatus === "All" ? orders : orders.filter((o) => o.status === filterStatus)

  const markAsComplete = (id: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "Delivered" } : o)))
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Link href="/admin" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ChevronLeft size={18} />
          Back to Admin
        </Link>

        <h1 className="font-grotesk text-3xl font-bold text-foreground mb-8">Order Management</h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {["All", "Processing", "Delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`py-2 px-4 font-medium transition ${
                filterStatus === status
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Order ID</th>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Date</th>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Items</th>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Total</th>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="py-4 px-6 text-foreground font-medium">{order.id}</td>
                    <td className="py-4 px-6 text-foreground">{order.date}</td>
                    <td className="py-4 px-6 text-foreground">{order.items}</td>
                    <td className="py-4 px-6 text-foreground font-bold">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button className="text-primary hover:text-primary/80 transition">
                          <Eye size={18} />
                        </button>
                        {order.status === "Processing" && (
                          <button
                            onClick={() => markAsComplete(order.id)}
                            className="text-secondary hover:text-secondary/80 transition text-xs font-bold px-2 py-1 border border-secondary rounded"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
