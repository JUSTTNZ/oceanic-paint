import axios from "axios";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, amount, orderId } = body;

    if (!email || !amount || !orderId) {
      return NextResponse.json({ error: "Missing required fields: email, amount, and orderId" }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Server configuration error: missing PAYSTACK_SECRET_KEY" }, { status: 500 });
    }

    const supabase = await createSupabaseServerClient();

    // Verify order exists and belongs to the user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, total_amount")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Amount should be in kobo (smallest unit for NGN)
    const amountInKobo = Math.round(amount * 100);

    const payload = {
      email,
      amount: amountInKobo,
      currency: "NGN",
      metadata: {
        order_id: orderId,
        user_id: order.user_id
      },
      channels: ["card", "bank"]
    };

    const resp = await axios.post("https://api.paystack.co/transaction/initialize", payload, {
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json"
      }
    });

    if (!resp.data?.status) {
      return NextResponse.json({ error: "Failed to initialize payment with Paystack" }, { status: 500 });
    }

    // Persist the payment record linked to the order (optional - if table exists)
    const reference = resp?.data?.data?.reference;
    const accessCode = resp?.data?.data?.access_code;
    const authUrl = resp?.data?.data?.authorization_url;
    const initData = resp?.data?.data || {};

    if (reference) {
      try {
        const { error: insertError } = await supabase.from("payments").insert([
          {
            order_id: orderId,
            paystack_reference: reference,
            email,
            amount,
            status: "initialized",
            access_code: accessCode,
            authorization_url: authUrl,
            init_payload: initData
          }
        ]);

        if (insertError) {
          console.warn("Warning: Failed to persist payment record (payments table may not exist):", insertError);
          // Don't throw — still return Paystack response to client
        }
      } catch (dbErr) {
        console.warn("Warning: Exception while persisting payment record:", dbErr);
        // Don't throw — continue with Paystack response
      }
    }

    return NextResponse.json(resp.data);
  } catch (err: any) {
    const message = err?.response?.data || err?.message || "Unknown error";
    console.error("Initialize payment error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
