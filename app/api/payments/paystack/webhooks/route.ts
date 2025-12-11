import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || ""
    const raw = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    // Verify webhook signature
    const hash = crypto.createHmac('sha512', secret).update(raw).digest('hex')
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const body = JSON.parse(raw)
    const supabase = await createSupabaseServerClient()
    const { event, data } = body

    // Handle successful charge event
    if (event === "charge.success") {
      const reference = data?.reference
      const metadata = data?.metadata || {}

      // Find the payment record by Paystack reference
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("id, order_id")
        .eq("paystack_reference", reference)
        .single()

      if (paymentError) {
        console.error("Payment record not found for reference:", reference, paymentError)
        return NextResponse.json({ received: true })
      }

      if (!payment) {
        console.warn("No payment found for reference:", reference)
        return NextResponse.json({ received: true })
      }

      // Update payment status
      await supabase
        .from("payments")
        .update({
          status: "success",
          verify_payload: data
        })
        .eq("id", payment.id)

      // Update order status and payment_status
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: "processing",
          payment_status: "completed",
          payment_reference: reference,
          updated_at: new Date().toISOString()
        })
        .eq("id", payment.order_id)

      if (orderError) {
        console.error("Error updating order:", orderError)
      }

      // Clear user's cart after successful payment
      if (metadata.user_id) {
        const { error: cartError } = await supabase
          .from("carts")
          .delete()
          .eq("user_id", metadata.user_id)

        if (cartError) {
          console.error("Error clearing cart:", cartError)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[PAYSTACK WEBHOOK] Error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 })
  }
}