"use client"

import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Package, ShoppingCart, Users, LogOut, Loader2, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { logout } from "@/lib/authSlice"
import type { RootState, AppDispatch } from "@/lib/store"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { formatPrice } from "@/components/formatprice"
interface StatCard {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
}

interface RecentOrder {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  order_items_count: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  
  const [stats, setStats] = useState<StatCard[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    if (user?.isAdmin) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError("")

      const supabase = createSupabaseBrowserClient()

      // Fetch all data in parallel
      const [productsResult, ordersResult, revenueResult, usersResult, recentOrdersResult] = await Promise.all([
        // Total Products
        supabase.from("products").select("id", { count: 'exact', head: true }),
        
        // Total Orders
        supabase.from("orders").select("id", { count: 'exact', head: true }),
        
        // Total Revenue (sum of all orders)
        supabase.from("orders").select("total_amount"),
        
        // Registered Users (from user_profiles)
        supabase.from("user_profiles").select("id", { count: 'exact', head: true }),
        
        // Recent Orders
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
          .order("created_at", { ascending: false })
          .limit(5)
      ])

      // Calculate total revenue
      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      // Set stats
      setStats([
        {
          title: "Total Products",
          value: productsResult.count || 0,
          icon: <Package size={24} />,
          color: "text-primary"
        },
        {
          title: "Total Orders",
          value: ordersResult.count || 0,
          icon: <ShoppingCart size={24} />,
          color: "text-secondary"
        },
        {
          title: "Total Revenue",
            value: `${formatPrice(totalRevenue)}`,
          icon: <TrendingUp size={24} />,
          color: "text-green-600"
        },
        {
          title: "Registered Users",
          value: usersResult.count || 0,
          icon: <Users size={24} />,
          color: "text-blue-600"
        }
      ])

      // Set recent orders
      if (recentOrdersResult.data) {
        const formattedOrders = recentOrdersResult.data.map(order => ({
          id: order.id,
          order_number: order.order_number,
          total_amount: order.total_amount || 0,
          status: order.status,
          created_at: order.created_at,
          order_items_count: order.order_items?.length || 0
        }))
        setRecentOrders(formattedOrders)
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      const errorMsg = "Failed to load dashboard data"
      setError(errorMsg)
      toast.error(errorMsg)
      
      // Set fallback stats
      setStats([
        {
          title: "Total Products",
          value: "N/A",
          icon: <Package size={24} />,
          color: "text-primary"
        },
        {
          title: "Total Orders",
          value: "N/A",
          icon: <ShoppingCart size={24} />,
          color: "text-secondary"
        },
        {
          title: "Total Revenue",
          value: "0.00",
          icon: <TrendingUp size={24} />,
          color: "text-green-600"
        },
        {
          title: "Registered Users",
          value: "N/A",
          icon: <Users size={24} />,
          color: "text-blue-600"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut()
      dispatch(logout())
      toast.success("Logged out successfully!")
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
      toast.error("Failed to logout")
    }
  }

  if (!user?.isAdmin) {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className=" px-4 sm:px-6 lg:px-12 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-grotesk text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name || user.email}!</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <div className="animate-pulse">
                  <div className="w-6 h-6 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className={`mb-4 ${stat.color}`}>
                  {stat.icon}
                </div>
                <h3 className="font-grotesk font-bold text-foreground mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Products Management */}
          <Link
            href="/admin/products"
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
          >
            <Package size={32} className="text-primary mb-4 group-hover:scale-110 transition" />
            <h2 className="font-grotesk text-2xl font-bold text-foreground mb-2">Products</h2>
            <p className="text-muted-foreground mb-4">Add, edit, and delete paint products</p>
            <span className="text-primary font-medium group-hover:underline">Manage Products →</span>
          </Link>

          {/* Orders Management */}
          <Link
            href="/admin/orders"
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
          >
            <ShoppingCart size={32} className="text-secondary mb-4 group-hover:scale-110 transition" />
            <h2 className="font-grotesk text-2xl font-bold text-foreground mb-2">Orders</h2>
            <p className="text-muted-foreground mb-4">View and manage customer orders</p>
            <span className="text-primary font-medium group-hover:underline">Manage Orders →</span>
          </Link>

          {/* Users Management */}
          <Link
            href="#users"
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
          >
            <Users size={32} className="text-primary mb-4 group-hover:scale-110 transition" />
            <h2 className="font-grotesk text-2xl font-bold text-foreground mb-2">Users</h2>
            <p className="text-muted-foreground mb-4">Manage registered users and permissions</p>
            <span className="text-primary font-medium group-hover:underline">Manage Users →</span>
          </Link>

          {/* Analytics */}
          <Link
            href="#analytics"
            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
          >
            <TrendingUp size={32} className="text-secondary mb-4 group-hover:scale-110 transition" />
            <h2 className="font-grotesk text-2xl font-bold text-foreground mb-2">Analytics</h2>
            <p className="text-muted-foreground mb-4">View sales reports and insights</p>
            <span className="text-primary font-medium group-hover:underline">View Analytics →</span>
          </Link>
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-grotesk text-2xl font-bold text-foreground">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-primary hover:underline text-sm font-medium"
            >
              View all orders →
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Order #</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Items</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/30">
                      <td className="py-4 px-4">
                        <span className="font-medium text-foreground">{order.order_number}</span>
                      </td>
                      <td className="py-4 px-4 text-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-foreground">
                        {order.order_items_count} items
                      </td>
                      <td className="py-4 px-4 text-foreground font-bold">
                       
                        {formatPrice(order.total_amount || 0)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {/* <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="font-grotesk text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/products?action=add"
              className="px-4 py-3 bg-primary text-primary-foreground rounded font-bold text-center hover:opacity-90 transition"
            >
              Add New Product
            </Link>
            <button
              onClick={() => fetchDashboardData()}
              className="px-4 py-3 border-2 border-primary text-primary rounded font-bold text-center hover:bg-primary/5 transition flex items-center justify-center gap-2"
            >
              <Loader2 size={18} className={loading ? "animate-spin" : ""} />
              Refresh Data
            </button>
            <Link
              href="#reports"
              className="px-4 py-3 border-2 border-secondary text-secondary rounded font-bold text-center hover:bg-secondary/5 transition"
            >
              Generate Report
            </Link>
            <Link
              href="#settings"
              className="px-4 py-3 bg-muted text-foreground rounded font-bold text-center hover:bg-muted/80 transition"
            >
              Settings
            </Link>
          </div>
        </div> */}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 border-2 border-destructive text-destructive rounded font-bold hover:bg-destructive/10 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <Footer />
    </div>
  )
}