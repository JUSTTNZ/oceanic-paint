"use client"

import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Package, User, LogOut, Loader2, ShoppingBag } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { logout } from "@/lib/authSlice"
import type { RootState, AppDispatch } from "@/lib/store"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  order_items_count: number
}

interface UserProfile {
  full_name?: string
  email?: string
  loyalty_points?: number
  phone?: string
  address?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  const supabase = createSupabaseBrowserClient()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError("")

      // Fetch user's orders and profile in parallel
      const [ordersResult, profileResult] = await Promise.all([
        // Fetch user's orders
        supabase
          .from("orders")
          .select(`
            id,
            order_number,
            total_amount,
            status,
            created_at,
            order_items (id)
          `)
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(10),

        // Fetch user profile
        supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user?.id)
          .single()
      ])

      if (ordersResult.error) throw ordersResult.error
      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        // PGRST116 is "not found" - that's ok for new users
        console.warn("Profile error:", profileResult.error)
      }

      // Process orders
      const userOrders = (ordersResult.data || []).map(order => ({
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount || 0,
        status: order.status,
        created_at: order.created_at,
        order_items_count: order.order_items?.length || 0
      }))

      setOrders(userOrders)
      
      // Set user profile (or create fallback)
      if (profileResult.data) {
        setUserProfile(profileResult.data)
      } else {
        // Create fallback profile from auth user
        setUserProfile({
          full_name: user?.name || "User",
          email: user?.email,
          loyalty_points: 0
        })
      }

    } catch (err) {
      console.error("Error fetching user data:", err)
      setError("Failed to load your data")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      dispatch(logout())
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  if (!user) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const displayName = userProfile?.full_name || user.name || "User"
  const displayEmail = userProfile?.email || user.email || ""
  const loyaltyPoints = userProfile?.loyalty_points || 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-grotesk text-3xl font-bold text-foreground">Welcome, {displayName}!</h1>
          <p className="text-muted-foreground">Manage your account and orders</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <User size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-grotesk font-bold text-foreground">{displayName}</h2>
                    <p className="text-sm text-muted-foreground">{displayEmail}</p>
                  </div>
                </div>
                <Link href="/dashboard/profile" className="text-primary hover:underline text-sm font-medium">
                  Edit Profile →
                </Link>
              </>
            )}
          </div>

          {/* Orders Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="w-6 h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
                <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
              </div>
            ) : (
              <>
                <Package size={24} className="text-secondary mb-4" />
                <h3 className="font-grotesk font-bold text-foreground mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-foreground mb-2">{orders.length}</p>
                <Link href="#orders" className="text-primary hover:underline text-sm font-medium">
                  View Orders →
                </Link>
              </>
            )}
          </div>

          {/* Loyalty */}
          <div className="bg-card border border-border rounded-lg p-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
                <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary-foreground font-bold text-sm">★</span>
                </div>
                <h3 className="font-grotesk font-bold text-foreground mb-2">Loyalty Points</h3>
                <p className="text-3xl font-bold text-foreground mb-2">{loyaltyPoints}</p>
                <p className="text-xs text-muted-foreground">Earn more with every purchase</p>
              </>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div id="orders" className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="font-grotesk text-2xl font-bold text-foreground mb-6">Recent Orders</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="font-bold text-foreground mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
              <Link
                href="/products"
                className="px-6 py-3 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Order #</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Items</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Total</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition">
                      <td className="py-4 px-4">
                        <span className="font-medium text-foreground">{order.order_number}</span>
                      </td>
                      <td className="py-4 px-4 text-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-foreground">
                        {order.order_items_count} item(s)
                      </td>
                      <td className="py-4 px-4 text-foreground font-bold">
                        ${order.total_amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/products"
            className="p-6 bg-primary/10 border border-primary rounded-lg hover:bg-primary/20 transition group"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag size={20} className="text-primary group-hover:scale-110 transition" />
              <h3 className="font-bold text-primary">Continue Shopping</h3>
            </div>
            <p className="text-sm text-muted-foreground">Discover more paint products</p>
          </Link>
          
          <button
            onClick={handleLogout}
            className="p-6 bg-destructive/10 border border-destructive rounded-lg hover:bg-destructive/20 transition text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <LogOut size={18} className="text-destructive group-hover:scale-110 transition" />
              <h3 className="font-bold text-destructive">Logout</h3>
            </div>
            <p className="text-sm text-muted-foreground">Sign out of your account</p>
          </button>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={fetchUserData}
            disabled={loading}
            className="px-4 py-2 border-2 border-primary text-primary rounded font-bold hover:bg-primary/5 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}