import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY || ""
  
  const hash = crypto.createHmac('sha512', secret)
    .update(await request.text())
    .digest('hex')
  
  const signature = request.headers.get('x-paystack-signature')

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const supabase = await createSupabaseServerClient()

    const { event, data } = body

    if (event === "charge.success") {
      // Update order status in database
      const { error } = await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_status: "completed",
          payment_reference: data.reference,
          updated_at: new Date().toISOString()
        })
        .eq("id", data.metadata.order_id)

      if (error) {
        console.error("Error updating order:", error)
      }

      // Clear user's cart
      await supabase.from("carts").delete().eq("user_id", data.metadata.user_id)

      // Send confirmation email (optional)
      // await sendOrderConfirmationEmail(data.metadata.user_id, data.metadata.order_id)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[PAYSTACK WEBHOOK] Error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 })
  }
}