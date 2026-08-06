import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Creates a Supabase client with the user's access token for RLS enforcement.
 * Use this in Server Components/Actions where you have access to the user's token.
 */
export function createCustomerClient(accessToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Creates a Supabase client for server-side operations that need to bypass RLS
 * (e.g., admin operations, webhooks). Uses service role key.
 * NEVER use this in client-facing code.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Type-safe database schema for customer tables
 */
export interface CustomerProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  marketing_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerAddress {
  id: string;
  customer_id: string;
  type: 'shipping' | 'billing' | 'both';
  label: string | null;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  customer_id: string;
  items: CartItem[];
  applied_coupon_code: string | null;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  name: string;
  price: number;
  original_price?: number;
  quantity: number;
  image: string;
  size?: string;
  thickness?: string;
  category?: string;
}

export interface Wishlist {
  id: string;
  customer_id: string;
  product_ids: string[];
  updated_at: string;
}

export interface OrderSummary {
  id: string;
  order_number: string;
  customer_id: string;
  customer_user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  fulfillment_status: string;
  shipping_address: any;
  billing_address: any;
  timeline: any[];
  refunds: any[];
  tracking_number: string | null;
  carrier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  variant_id?: string;
  name: string;
  size?: string;
  thickness?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image: string;
}