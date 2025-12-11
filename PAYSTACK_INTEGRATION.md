# Paystack Integration Guide

## Setup Steps

### 1. Create the Payments Table
Run the SQL migration in your Supabase dashboard (SQL Editor):

```sql
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  paystack_reference text NOT NULL UNIQUE,
  email text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'NGN',
  status text DEFAULT 'initialized',
  access_code text,
  authorization_url text,
  init_payload jsonb,
  verify_payload jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_paystack_reference ON public.payments(paystack_reference);
CREATE INDEX idx_payments_email ON public.payments(email);
CREATE INDEX idx_payments_status ON public.payments(status);
```

### 2. Set Environment Variables
Copy `.env.local.example` to `.env.local` and add your Paystack keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx  # or pk_live_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx              # or sk_live_xxx
```

### 3. Configure Vercel (Production)
In your Vercel project settings:
- Add `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` (can be public)
- Add `PAYSTACK_SECRET_KEY` (keep secret, server-only)

## How to Use in Your Pages

### Example: Checkout Page

```tsx
// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import PaystackCheckout from '@/components/paystackCheckout';

export default function CheckoutPage() {
  const [orderId, setOrderId] = useState<string>('');
  
  // Assuming you've already created an order and have the ID
  // You would get this from your cart/checkout state or server action

  return (
    <div>
      <h1>Checkout</h1>
      {orderId ? (
        <PaystackCheckout
          email="customer@example.com"
          orderId={orderId}
          amountNaira={5000}
          onSuccess={(result) => {
            console.log('Payment successful:', result);
            // Redirect to success page or show confirmation
          }}
        />
      ) : (
        <p>Loading order...</p>
      )}
    </div>
  );
}
```

## API Endpoints

### POST `/api/payments/paystack/initialize`
Initiates a Paystack transaction.

**Request:**
```json
{
  "email": "customer@example.com",
  "amount": 5000,
  "orderId": "order-uuid"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/xxx",
    "access_code": "xxx",
    "reference": "xxx"
  }
}
```

### GET `/api/payments/paystack/verify?reference=xxx`
Verifies a transaction and updates order payment status.

**Response:**
```json
{
  "status": true,
  "message": "Verification successful",
  "data": {
    "status": "success",
    "reference": "xxx",
    "amount": 500000,
    "paid_at": "2025-12-10T..."
  }
}
```

### POST `/api/payments/paystack/webhooks`
Receives Paystack webhook events. No action needed from you—it's automatically called by Paystack.

## Database Flow

1. **Order Created** → User clicks "Pay Now"
2. **Initialize** → Creates payment record, returns Paystack auth URL
3. **User Completes Payment** → Paystack redirects to your app (or popup closes)
4. **Verify** → Client calls verify endpoint, updates order `payment_status` → `"completed"`
5. **Webhook** → Paystack confirms payment, updates order `status` → `"processing"`, clears cart

## Testing Locally

```bash
npm run dev
```

Test with Paystack test card: `4111 1111 1111 1111` (any future date, any CVC)

### Webhook Testing

Use ngrok to expose your local server:

```bash
ngrok http 3000
```

Add your ngrok URL to Paystack Dashboard → Settings → API → Webhook URL:
```
https://xxx.ngrok.io/api/payments/paystack/webhooks
```

Paystack will send a test event; check your terminal logs for confirmation.

## Database Schema Integration

Your orders table now tracks:
- `payment_status`: 'pending' → 'completed'
- `payment_reference`: Paystack reference for audits
- Linked `payments` table stores detailed transaction history

## Troubleshooting

**"Order not found"** → Ensure the order exists before calling initialize
**"Invalid signature"** → Webhook URL is correct and PAYSTACK_SECRET_KEY is set
**Payment shows in Paystack but not in DB** → Check webhook endpoint is accessible + configured in Paystack dashboard

## Security Notes

- Never commit `.env.local` (already in `.gitignore`)
- `PAYSTACK_SECRET_KEY` is server-only; never expose to client
- All payment verification happens on the server (no client-side secret validation)
- Webhook signature is verified before processing
