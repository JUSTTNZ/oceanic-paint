"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Loader2 } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
  image?: string
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  items: OrderItem[]
}

export default function OrderDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (id) fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          order_items (
            id,
            product_name,
            quantity,
            price,
            image
          )
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      setOrder({
        id: data.id,
        order_number: data.order_number,
        total_amount: data.total_amount,
        status: data.status,
        created_at: data.created_at,
        items: data.order_items || [],
      })
    } catch (err) {
      console.error(err)
      setError("Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800"
      case "shipped": return "bg-blue-100 text-blue-800"
      case "processing": return "bg-yellow-100 text-yellow-800"
      case "pending": return "bg-orange-100 text-orange-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="px-4 sm:px-6 lg:px-12 py-8 flex-1">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : error ? (
          <div className="text-destructive font-bold text-center py-10">{error}</div>
        ) : order ? (
          <>
            <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-sm">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Order #{order.order_number}
              </h1>
              <p className="text-muted-foreground mb-2">
                Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className={`inline-block px-3 py-1 rounded text-sm font-bold ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
              <p className="font-bold text-foreground text-lg mt-2">
                Total: ₦{order.total_amount.toLocaleString()}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 border-b border-border pb-4 last:border-b-0">
                    {item.image ? (
                      <img src={item.image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{item.product_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} • Price: ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="font-bold text-foreground">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-20">Order not found.</div>
        )}
      </div>

      <Footer />
    </div>
  )
}
