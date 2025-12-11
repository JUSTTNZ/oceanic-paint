-- Create payments table to track Paystack transactions
-- This table links to the orders table for reconciliation and audit trail

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

-- Create indexes for faster lookups
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_paystack_reference ON public.payments(paystack_reference);
CREATE INDEX idx_payments_email ON public.payments(email);
CREATE INDEX idx_payments_status ON public.payments(status);
