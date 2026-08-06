-- Chouhan Mattress — Customer Schema (Phase 2)
-- Project ref: hcfcpkldxegalkrwngog
-- Apply via: Supabase MCP `apply_migration` OR `supabase db push` OR paste in Dashboard SQL editor.

-- ─────────────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ─────────────────────────────────────────────────────────────────────────────
-- Customer Profiles (extends auth.users)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  marketing_opt_in boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Customer Addresses (reusable across orders)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('shipping', 'billing', 'both')),
  label text, -- "Home", "Office", "Mom's House"
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  country text not null default 'India',
  is_default_shipping boolean default false,
  is_default_billing boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure only one default shipping and one default billing per customer
create unique index if not exists idx_customer_addresses_default_shipping
  on customer_addresses (customer_id)
  where is_default_shipping = true;

create unique index if not exists idx_customer_addresses_default_billing
  on customer_addresses (customer_id)
  where is_default_billing = true;

-- ─────────────────────────────────────────────────────────────────────────────
-- Persistent Cart (server-side, linked to user)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  applied_coupon_code text,
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Wishlist (server-side, linked to user)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references auth.users(id) on delete cascade,
  product_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Orders: Add customer_user_id column to link to auth.users
-- ─────────────────────────────────────────────────────────────────────────────
alter table orders add column if not exists customer_user_id uuid references auth.users(id);
create index if not exists idx_orders_customer_user on orders(customer_user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Returns: Add customer_user_id column
-- ─────────────────────────────────────────────────────────────────────────────
alter table returns add column if not exists customer_user_id uuid references auth.users(id);
create index if not exists idx_returns_customer_user on returns(customer_user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Updated-at triggers
-- ─────────────────────────────────────────────────────────────────────────────
drop trigger if exists trg_customer_profiles_updated on customer_profiles;
create trigger trg_customer_profiles_updated before update on customer_profiles
  for each row execute function set_updated_at();

drop trigger if exists trg_customer_addresses_updated on customer_addresses;
create trigger trg_customer_addresses_updated before update on customer_addresses
  for each row execute function set_updated_at();

drop trigger if exists trg_carts_updated on carts;
create trigger trg_carts_updated before update on carts
  for each row execute function set_updated_at();

drop trigger if exists trg_wishlists_updated on wishlists;
create trigger trg_wishlists_updated before update on wishlists
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
alter table customer_profiles enable row level security;
alter table customer_addresses enable row level security;
alter table carts enable row level security;
alter table wishlists enable row level security;

-- Helper: is the caller an authenticated customer (not staff)?
create or replace function is_customer() returns boolean as $$
begin
  -- Check if the user has a customer role (not staff)
  return not coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') in
      ('owner','admin','manager','staff','viewer'), false);
end;
$$ language plpgsql stable;

-- Customer Profiles: users can only see/edit their own
create policy "customer_own_profile" on customer_profiles
  for all to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Customer Addresses: users can only see/edit their own
create policy "customer_own_addresses" on customer_addresses
  for all to authenticated
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());

-- Carts: users can only see/edit their own
create policy "customer_own_cart" on carts
  for all to authenticated
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());

-- Wishlists: users can only see/edit their own
create policy "customer_own_wishlist" on wishlists
  for all to authenticated
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());

-- Block anon entirely
create policy "customer_no_anon" on customer_profiles for all to anon using (false) with check (false);
create policy "customer_addresses_no_anon" on customer_addresses for all to anon using (false) with check (false);
create policy "carts_no_anon" on carts for all to anon using (false) with check (false);
create policy "wishlists_no_anon" on wishlists for all to anon using (false) with check (false);

-- Staff (admin) access to customer tables for support
create policy "staff_customer_profiles" on customer_profiles
  for all to authenticated
  using (is_staff()) with check (is_staff());

create policy "staff_customer_addresses" on customer_addresses
  for all to authenticated
  using (is_staff()) with check (is_staff());

create policy "staff_carts" on carts
  for all to authenticated
  using (is_staff()) with check (is_staff());

create policy "staff_wishlists" on wishlists
  for all to authenticated
  using (is_staff()) with check (is_staff());

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
create index if not exists idx_customer_addresses_customer on customer_addresses(customer_id);
create index if not exists idx_carts_customer on carts(customer_id);
create index if not exists idx_wishlists_customer on wishlists(customer_id);
create index if not exists idx_customer_profiles_phone on customer_profiles(phone);