import axios from "axios";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const reference = url.searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "Missing reference query param" }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Server configuration error: missing PAYSTACK_SECRET_KEY" }, { status: 500 });
    }

    const resp = await axios.get(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${secret}`
      }
    });

    const supabase = await createSupabaseServerClient();
    const verifyData = resp?.data?.data || {};
    const transactionStatus = verifyData?.status; // "success", "failed", etc.

    // Find the payment record and get the associated order
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, order_id, status")
      .eq("paystack_reference", reference)
      .single();

    if (paymentError || !payment) {
      console.warn("Payment record not found for reference:", reference);
      // Still return Paystack response but log the issue
      return NextResponse.json(resp.data);
    }

    // Update payment record with verification result
    const { error: updatePaymentError } = await supabase
      .from("payments")
      .update({
        status: transactionStatus || "unknown",
        verify_payload: verifyData,
        updated_at: new Date().toISOString()
      })
      .eq("id", payment.id);

    if (updatePaymentError) {
      console.error("Failed to update payment record:", updatePaymentError);
    }

    // If transaction succeeded, update the order's payment_status to "completed"
    if (transactionStatus === "success") {
      const { error: updateOrderError } = await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          payment_reference: reference,
          updated_at: new Date().toISOString()
        })
        .eq("id", payment.order_id);

      if (updateOrderError) {
        console.error("Failed to update order payment status:", updateOrderError);
      }
    }

    return NextResponse.json(resp.data);
  } catch (err: any) {
    const message = err?.response?.data || err?.message || "Unknown error";
    console.error("Verify payment error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
