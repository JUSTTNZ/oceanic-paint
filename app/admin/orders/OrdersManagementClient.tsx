"use client"

import { useState } from "react"
import { FaEye } from "react-icons/fa"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function OrdersManagementClient({ initialOrders }: { initialOrders: any[] }) {
    const router = useRouter()
    const [orders, setOrders] = useState(initialOrders)
    const [filterStatus, setFilterStatus] = useState("All")
    const [error, setError] = useState("")

    const filteredOrders = filterStatus === "All" ? orders : orders.filter((o) => o.status === filterStatus)

    const markAsComplete = async (id: string) => {
        const { data, error } = await supabase
            .from("orders")
            .update({ status: "Delivered" })
            .eq("id", id)
            .select()
        
        if (error) {
            setError(error.message)
        } else {
            setOrders(orders.map((o) => (o.id === id ? data[0] : o)))
            router.refresh()
        }
    }

    return (
        <>
            <h1 className="font-grotesk text-3xl font-bold text-foreground mb-8">Order Management</h1>
            {error && <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded text-sm">{error}</div>}
            {/* Filter Tabs */}
            <div className="flex gap-4 mb-8 border-b border-border">
                {["All", "pending", "Delivered"].map((status) => (
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
                                    <td className="py-4 px-6 text-foreground font-medium">ORD-{order.id.toString().slice(-6)}</td>
                                    <td className="py-4 px-6 text-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 text-foreground">{order.items.length}</td>
                                    <td className="py-4 px-6 text-foreground font-bold">${order.total_price.toFixed(2)}</td>
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
                                                <FaEye size={18} />
                                            </button>
                                            {order.status === "pending" && (
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
        </>
    )
}
