"use client"

import Link from "next/link"
import { ChevronLeft, Eye, Loader2 } from "lucide-react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import type { RootState } from "@/lib/store"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
interface UserProfile {
  id: string
  email: string
  full_name: string
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  user_id: string
  shipping_address: any
  payment_method: string
  order_items_count?: number
  user_email?: string
}

export default function OrdersManagementPage() {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("All")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    if (user?.isAdmin) {
      fetchOrders()
    }
  }, [user])

 const fetchOrders = async () => {
  try {
    setLoading(true)
    setError("")
    
    const supabase = createSupabaseBrowserClient()
    
    // Get all orders with user data
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (id)
      `)
      .order("created_at", { ascending: false })

    if (ordersError) throw ordersError

    // Get user profiles for all unique user IDs
    const userIds = [...new Set(ordersData?.map(order => order.user_id).filter(Boolean) || [])]
    
  let userProfiles: Record<string, UserProfile> = {}
    
    if (userIds.length > 0) {
      // Get user profiles by IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from("user_profiles")
        .select("id, email, full_name")
        .in("id", userIds)
      
      if (!profilesError && profilesData) {
        // Create a map of user_id -> profile
      userProfiles = profilesData.reduce((acc: Record<string, UserProfile>, profile: UserProfile) => {
      acc[profile.id] = profile
          return acc
        }, {})
      }
    }

    // Combine orders with user data
    const ordersWithUserData = (ordersData || []).map(order => {
      const userProfile = userProfiles[order.user_id]
      return {
        ...order,
        order_items_count: order.order_items?.length || 0,
        user_email: userProfile?.email || "Unknown",
        user_name: userProfile?.full_name || "Unknown"
      }
    })

    setOrders(ordersWithUserData)
  } catch (err) {
    console.error("Error fetching orders:", err)
    setError("Failed to load orders")
  } finally {
    setLoading(false)
  }
}

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId)

      if (error) throw error

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (err) {
      console.error("Error updating order:", err)
      alert("Failed to update order status")
    }
  }

  const filteredOrders = filterStatus === "All" 
    ? orders 
    : orders.filter((order) => order.status.toLowerCase() === filterStatus.toLowerCase())

  const statusOptions = ["All", "pending", "processing", "shipped", "delivered", "cancelled"]

  if (!user?.isAdmin) {
    return null
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

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Processing</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'processing').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded text-sm">
            {error}
          </div>
        )}

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Order Number</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Date</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Customer</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Items</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Total</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Status</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Payment</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition">
                        <td className="py-4 px-6">
                          <span className="font-medium text-foreground">{order.order_number}</span>
                        </td>
                        <td className="py-4 px-6 text-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm text-foreground">{order.user_email}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              ID: {order.user_id.substring(0, 8)}...
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-foreground">{order.order_items_count || 0} items</td>
                        <td className="py-4 px-6 text-foreground font-bold">
                          ${order.total_amount?.toFixed(2) || "0.00"}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`px-3 py-1 rounded text-xs font-bold border ${
                              order.status === "delivered" ? "bg-green-100 text-green-800 border-green-200" :
                              order.status === "shipped" ? "bg-blue-100 text-blue-800 border-blue-200" :
                              order.status === "processing" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                              order.status === "pending" ? "bg-orange-100 text-orange-800 border-orange-200" :
                              "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 bg-muted text-foreground rounded text-xs">
                            {order.payment_method || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-primary hover:text-primary/80 transition"
                              title="View Order Details"
                            >
                              <Eye size={18} />
                            </Link>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to mark order ${order.order_number} as delivered?`)) {
                                  updateOrderStatus(order.id, "delivered")
                                }
                              }}
                              className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 transition rounded"
                              disabled={order.status === "delivered"}
                            >
                              Deliver
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}