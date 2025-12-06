import { FaBox, FaShoppingCart, FaUsers } from "react-icons/fa"
import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Basic admin check - in a real app, use custom claims or a roles table
  if (!user || !user.email?.endsWith("@oceanicpaint.com")) {
    redirect("/")
  }

  const { data: products } = await supabase.from("products").select("id")
  const { data: orders } = await supabase.from("orders").select("total_price, created_at, items, status")

  const totalRevenue = orders?.reduce((sum, o) => sum + o.total_price, 0) || 0

  return (
    <>
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
            <p className="text-3xl font-bold text-foreground">{products?.length || 0}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <FaShoppingCart size={24} className="text-secondary mb-4" />
            <h3 className="font-grotesk font-bold text-foreground mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-foreground">{orders?.length || 0}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <FaUsers size={24} className="text-primary mb-4" />
            <h3 className="font-grotesk font-bold text-foreground mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
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
                {orders?.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4 text-foreground font-medium">ORD-{order.id.toString().slice(-6)}</td>
                    <td className="py-4 px-4 text-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-foreground">{order.items.length}</td>
                    <td className="py-4 px-4 text-foreground font-bold">${order.total_price.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          order.status === "delivered"
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
      </div>
    </>
  )
}
