-- ─────────────────────────────────────────────────────────────────────────────
-- Chouhan Mattress — Migration 0006: RBAC RLS Function Sync + Payment & Logistics Audit Columns
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Redefine is_staff() to recognize all 7 RBAC roles + app_metadata.is_staff boolean
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT coalesce(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'is_staff')::boolean = true
    OR (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role') IN (
      'super_admin',
      'admin',
      'manager',
      'inventory',
      'sales',
      'customer_support',
      'content_editor',
      'owner',
      'staff',
      'viewer'
    ),
    false
  );
$$;

-- 2. Add Payment and Logistics Audit Columns to Orders Table (if not exists)
ALTER TABLE IF EXISTS public.orders
  ADD COLUMN IF NOT EXISTS razorpay_order_id text,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
  ADD COLUMN IF NOT EXISTS razorpay_signature text,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS shipping_order_id text,
  ADD COLUMN IF NOT EXISTS awb_number text,
  ADD COLUMN IF NOT EXISTS courier_name text,
  ADD COLUMN IF NOT EXISTS shipping_label_url text,
  ADD COLUMN IF NOT EXISTS shipping_status text DEFAULT 'pending'
    CHECK (shipping_status IN ('pending', 'processing', 'manifested', 'in_transit', 'out_for_delivery', 'delivered', 'rto', 'cancelled'));

-- Indexes for lightning fast order tracking lookups
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_awb_number ON public.orders(awb_number);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_status ON public.orders(shipping_status);
