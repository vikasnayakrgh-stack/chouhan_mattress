-- Chouhan Mattress — Admin Panel V1 schema
-- Project ref: hcfcpkldxegalkrwngog
-- Apply via: Supabase MCP `apply_migration` OR `supabase db push` OR paste in Dashboard SQL editor.
-- Design notes:
--   * All tables live in `public` and have RLS ENABLED.
--   * Admin access is gated by a `staff` profile + role. RLS policies use a JWT app_metadata claim
--     `role` (owner|admin|manager|staff|viewer) written by the app on invite. Anonymous/public app
--     traffic must NOT reach these tables via the Data API — only the service-role (admin server)
--     and authenticated staff should. See RLS policies at the bottom.
--   * JSON columns keep nested structures (options, attributes, timeline, items) faithful to the
--     TypeScript domain types, so repository mapping is a straight serialize/deserialize.

-- ─────────────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";    -- fuzzy search on names/codes

-- ─────────────────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────────────────
do $$ begin
  create type product_status as enum ('active','draft','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum
    ('new','confirmed','processing','packed','shipped','delivered','cancelled','returned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('paid','pending','cod','failed','refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type fulfillment_status as enum ('unfulfilled','partially_fulfilled','fulfilled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type customer_status as enum ('active','inactive','blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type return_status as enum
    ('requested','approved','received','inspected','refunded','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type return_reason as enum
    ('damaged','defective','wrong_item','not_as_described','size_issue',
     'comfort_issue','changed_mind','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type return_resolution as enum ('refund','replacement','store_credit');
exception when duplicate_object then null; end $$;

do $$ begin
  create type discount_type as enum ('percentage','fixed','buy_x_get_y','free_shipping');
exception when duplicate_object then null; end $$;

do $$ begin
  create type discount_status as enum ('active','scheduled','expired','disabled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type customer_group as enum ('all','first_order','returning','vip');
exception when duplicate_object then null; end $$;

do $$ begin
  create type inventory_status as enum ('in_stock','low_stock','out_of_stock');
exception when duplicate_object then null; end $$;

do $$ begin
  create type admin_role as enum ('owner','admin','manager','staff','viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type audit_action as enum
    ('create','update','delete','archive','login','export','stock_adjust');
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Staff (admin users) — app-managed auth, separate from customer auth
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,                 -- link to Supabase auth.users when SSO enabled
  name text not null,
  email text not null unique,
  phone text,
  role admin_role not null default 'staff',
  avatar_url text,
  status text not null default 'active'
    check (status in ('active','invited','disabled')),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Categories & Collections
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  parent_id uuid references categories(id) on delete set null,
  status category_status not null default 'active',
  position integer not null default 0,
  product_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  status collection_status not null default 'active',
  is_automatic boolean not null default false,
  product_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Products (header) + variants (1:many)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  product_code text not null,
  short_description text default '',
  description text default '',
  brand text not null default 'Chouhan',
  category_id uuid references categories(id) on delete set null,
  category_name text not null default '',
  collection_ids jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  status product_status not null default 'draft',
  images jsonb not null default '[]'::jsonb,
  options jsonb not null default '[]'::jsonb,
  mattress_attributes jsonb,
  seo jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  option_values jsonb not null default '{}'::jsonb,  -- { "Size":"Queen", "Thickness":"6 inch" }
  dimensions text,
  mrp numeric(12,2) not null default 0,
  selling_price numeric(12,2) not null default 0,
  discount_percent numeric(5,2) not null default 0,
  stock integer not null default 0,
  low_stock_threshold integer not null default 5,
  status text not null default 'active'
    check (status in ('active','inactive'))
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Customers (+ addresses, notes as nested JSON for the 7-tab detail UI)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  city text default '',
  state text default '',
  status customer_status not null default 'active',
  orders_count integer not null default 0,
  total_spend numeric(12,2) not null default 0,
  last_order_date timestamptz,
  addresses jsonb not null default '[]'::jsonb,
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Orders (+ items, timeline, refunds as nested JSON)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,            -- e.g. CM-1042
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null default '',
  customer_email text default '',
  customer_phone text default '',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status order_status not null default 'new',
  payment_status payment_status not null default 'pending',
  payment_method text default '',
  fulfillment_status fulfillment_status not null default 'unfulfilled',
  shipping_address jsonb,
  billing_address jsonb,
  timeline jsonb not null default '[]'::jsonb,
  refunds jsonb not null default '[]'::jsonb,
  tracking_number text,
  carrier text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Returns (+ items, timeline as nested JSON)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists returns (
  id uuid primary key default gen_random_uuid(),
  return_number text not null unique,          -- e.g. RET-2001
  order_id uuid references orders(id) on delete set null,
  order_number text default '',
  customer_id uuid references customers(id) on delete set null,
  customer_name text default '',
  customer_phone text default '',
  items jsonb not null default '[]'::jsonb,
  reason return_reason not null,
  reason_note text,
  resolution return_resolution not null default 'refund',
  status return_status not null default 'requested',
  refund_amount numeric(12,2) not null default 0,
  images jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Discounts
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists discounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  description text,
  type discount_type not null,
  value numeric(12,2) not null default 0,
  condition jsonb not null default '{}'::jsonb,
  rule jsonb,
  status discount_status not null default 'active',
  start_date timestamptz not null default now(),
  end_date timestamptz,
  usage_limit integer,
  usage_count integer not null default 0,
  per_customer_limit integer,
  stackable boolean not null default false,
  once_per_customer boolean not null default false,
  revenue_impacted numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Inventory (derived view of variants, kept as a materialized-ish table with
-- reserved/incoming for the admin inventory screen)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  product_name text not null default '',
  variant_id uuid references product_variants(id) on delete cascade,
  sku text not null unique,
  variant_label text default '',
  stock integer not null default 0,
  low_stock_threshold integer not null default 5,
  status inventory_status not null default 'in_stock',
  reserved integer not null default 0,
  incoming integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists stock_adjustments (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid references inventory(id) on delete set null,
  sku text not null,
  delta integer not null,
  reason text default '',
  note text,
  adjusted_by text default '',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Audit log
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references staff(id) on delete set null,
  actor_name text not null default '',
  action audit_action not null,
  entity_type text not null,
  entity_id text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes for common admin queries
-- ─────────────────────────────────────────────────────────────────────────────
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_variants_product on product_variants(product_id);
create index if not exists idx_variants_sku on product_variants(sku);
create index if not exists idx_orders_customer on orders(customer_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created on orders(created_at desc);
create index if not exists idx_returns_status on returns(status);
create index if not exists idx_returns_order on returns(order_id);
create index if not exists idx_customers_email on customers(email);
create index if not exists idx_discounts_code on discounts(code);
create index if not exists idx_audit_entity on audit_logs(entity_type, entity_id);
create index if not exists idx_audit_created on audit_logs(created_at desc);
create index if not exists idx_inventory_sku on inventory(sku);

-- ─────────────────────────────────────────────────────────────────────────────
-- Updated-at trigger (single helper, applied to versioned tables)
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();

drop trigger if exists trg_returns_updated on returns;
create trigger trg_returns_updated before update on returns
  for each row execute function set_updated_at();

drop trigger if exists trg_discounts_updated on discounts;
create trigger trg_discounts_updated before update on discounts
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
--   Public/anon: NO access to any admin table (these are back-office tables).
--   Authenticated staff: full row access, gated by the `role` claim in
--     auth.jwt() -> app_metadata.role. This is app_metadata (not user_metadata),
--     which is safe per the Supabase security model.
--   Service role (admin server / migrations): bypasses RLS (always).
-- ─────────────────────────────────────────────────────────────────────────────
alter table staff enable row level security;
alter table categories enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table returns enable row level security;
alter table discounts enable row level security;
alter table inventory enable row level security;
alter table stock_adjustments enable row level security;
alter table audit_logs enable row level security;

-- Helper: is the caller an authenticated staff member?
create or replace function is_staff() returns boolean as $$
begin
  return coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') in
      ('owner','admin','manager','staff','viewer'), false);
end;
$$ language plpgsql stable;

-- Apply the same policy shape to every admin table.
do $$
declare t text;
begin
  foreach t in array array[
    'staff','categories','collections','products','product_variants',
    'customers','orders','returns','discounts','inventory',
    'stock_adjustments','audit_logs'
  ]
  loop
    execute format('drop policy if exists %I on %I;', t || '_staff_all', t);
    execute format(
      'create policy %I on %I for all to authenticated using (is_staff()) with check (is_staff());',
      t || '_staff_all', t);
  end loop;
end $$;

-- Block anon entirely (defense in depth even though Data API exposure is off).
do $$
declare t text;
begin
  foreach t in array array[
    'staff','categories','collections','products','product_variants',
    'customers','orders','returns','discounts','inventory',
    'stock_adjustments','audit_logs'
  ]
  loop
    execute format('drop policy if exists %I on %I;', t || '_no_anon', t);
    execute format(
      'create policy %I on %I for all to anon using (false) with check (false);',
      t || '_no_anon', t);
  end loop;
end $$;
