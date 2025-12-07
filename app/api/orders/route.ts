// app/api/orders/route.ts
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cartItems, totalAmount, shippingAddress, paymentMethod } = await request.json()

    console.log("Received order data:", {
      user: user.id,
      cartItems,
      totalAmount,
      shippingAddress,
      paymentMethod
    })

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        total_amount: totalAmount,
        shipping_address: JSON.stringify(shippingAddress),
        payment_method: paymentMethod,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      throw orderError
    }

    console.log("Order created:", order)

    // Create order items - fix the field names
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId || item.product_id, // Handle both formats
      color: item.color || "",
      size: item.size || "",
      quantity: item.quantity,
      price: item.price,
    }))

    console.log("Order items to insert:", orderItems)

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items error:", itemsError)
      throw itemsError
    }

    // Return complete order with items
    const { data: fullOrder, error: fullOrderError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price,
          color,
          size,
          products (
            name,
            image
          )
        )
      `)
      .eq("id", order.id)
      .single()

    if (fullOrderError) {
      console.error("Error fetching full order:", fullOrderError)
      // Still return the basic order even if fetch fails
      return NextResponse.json({ 
        order: { 
          ...order, 
          items: orderItems 
        } 
      })
    }

    return NextResponse.json({ order: fullOrder })
  } catch (error) {
    console.error("[API] Error creating order:", error)
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ 
      error: "Failed to create order",
      details: errorMessage 
    }, { status: 400 })
  }
}