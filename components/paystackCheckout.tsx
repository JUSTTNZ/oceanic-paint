"use client";

import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  email: string;
  orderId: string; // UUID of the order
  amountNaira: number; // Accept amount in Naira for convenience
  onSuccess?: (result: any) => void;
};

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Window is undefined"));
    if ((window as any).PaystackPop) return resolve();
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.head.appendChild(script);
  });
}

export default function PaystackCheckout({ email, orderId, amountNaira, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    try {
      setLoading(true);

      if (!email || !amountNaira || !orderId) {
        toast.error("Missing email, amount, or order ID");
        setLoading(false);
        return;
      }

      const resp = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount: amountNaira, orderId }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        toast.error(data?.error?.message || data?.error || "Failed to initialize payment");
        setLoading(false);
        return;
      }

      const initData = data?.data || data;
      const { authorization_url, reference, access_code } = initData;

      // Load Paystack inline script
      await loadPaystackScript();

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        toast.error("Missing public key configuration");
        setLoading(false);
        return;
      }

      const amountInKobo = Math.round(amountNaira * 100);

      const handler = (window as any).PaystackPop?.setup({
        key: publicKey,
        email,
        amount: amountInKobo,
        reference,
        onClose: () => {
          toast.error("Payment closed");
          setLoading(false);
        },
        callback: async (paymentResult: any) => {
          // Verify the transaction server-side
          try {
            toast.loading('Verifying payment...');
            const verifyResp = await fetch(`/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}`);
            const verifyData = await verifyResp.json();
            if (!verifyResp.ok) {
              toast.error(verifyData?.error?.message || verifyData?.error || 'Verification failed');
              setLoading(false);
              return;
            }

            toast.success('Payment verified');
            setLoading(false);
            onSuccess?.(verifyData);
          } catch (err) {
            console.error(err);
            toast.error('Verification request failed');
            setLoading(false);
          }
        },
      });

      if (!handler) {
        // fallback to redirecting to authorization_url
        if (authorization_url) {
          window.location.href = authorization_url;
        } else {
          toast.error("Unable to start Paystack checkout");
          setLoading(false);
        }
      } else {
        handler.openIframe();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Payment initialization error");
      setLoading(false);
    }
  }

  return (
    <button onClick={startCheckout} className="btn-primary" disabled={loading}>
      {loading ? "Processing…" : `Pay ${amountNaira} NGN`}
    </button>
  );
}
