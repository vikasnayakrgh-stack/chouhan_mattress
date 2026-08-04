-- ─────────────────────────────────────────────────────────────────────────────
-- Chouhan Mattress — Migration 0004: Phase B Extensions (CMS, SEO, Settings, Reviews, Analytics)
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensions (if not already present)
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";    -- fuzzy search on names/codes

-- ─────────────────────────────────────────────────────────────────────────────
-- Enums (ALL enums defined first)
-- ─────────────────────────────────────────────────────────────────────────────
do $$ begin
  create type content_type as enum ('hero', 'banner', 'faq', 'section', 'page');
exception when duplicate_object then null; end $$;

do $$ begin
  create type seo_type as enum ('page', 'product', 'category', 'collection', 'blog');
exception when duplicate_object then null; end $$;

do $$ begin
  create type setting_type as enum ('string', 'number', 'boolean', 'json', 'text');
exception when duplicate_object then null; end $$;

do $$ begin
  create type review_status as enum ('pending', 'approved', 'rejected', 'spam');
exception when duplicate_object then null; end $$;

do $$ begin
  create type analytics_snapshot_type as enum ('daily', 'weekly', 'monthly', 'custom');
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────────

-- CMS Content (hero/banners/faqs/sections/pages)
create table if not exists cms_content (
  id uuid primary key default gen_random_uuid(),
  type content_type not null,
  key text not null unique,                    -- unique identifier like 'home_hero', 'faq_shipping'
  title text not null default '',              -- title/heading
  content jsonb not null default '{}'::jsonb,  -- flexible content storage
  status text not null default 'active'        -- active/inactive/archive
    check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- SEO Pages (metadata for pages)
create table if not exists seo_pages (
  id uuid primary key default gen_random_uuid(),
  type seo_type not null,
  entity_id uuid,                              -- references products(id), categories(id), etc. or null for static pages
  entity_type text,                            -- 'product', 'category', 'collection', 'page', etc.
  path text not null,                          -- URL path like '/products/queen-mattress'
  title text not null,                         -- SEO title (title tag)
  description text,                            -- SEO description (meta description)
  keywords text[],                             -- SEO keywords array
  og_title text,                               -- Open Graph title
  og_description text,                         -- Open Graph description
  og_image text,                               -- Open Graph image URL
  twitter_card text,                           -- Twitter Card type
  twitter_title text,                          -- Twitter Card title
  twitter_description text,                    -- Twitter Card description
  twitter_image text,                          -- Twitter Card image URL
  structured_data jsonb,                       -- JSON-LD structured data
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(type, entity_id, entity_type)         -- prevent duplicate SEO for same entity
);

-- App Settings (key-value store for application settings)
create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,                    -- setting key like 'site_name', 'contact_email'
  value text not null,                         -- setting value (stored as text, cast as needed)
  type setting_type not null default 'string', -- type of the setting value
  description text,                            -- description of what this setting does
  is_public boolean not null default false,    -- whether this setting is exposed to frontend
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reviews (product reviews with moderation)
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,  -- optional, to verify purchase
  rating integer not null check (rating >= 1 and rating <= 5),
  title text not null,
  body text not null,
  status review_status not null default 'pending',  -- pending approval, approved, rejected, spam
  helpful_votes integer not null default 0,         -- number of users who found this helpful
  total_votes integer not null default 0,           -- total votes on helpfulness
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Ensure a customer can only review a product once per order (or once total if no order)
  unique(product_id, customer_id, order_id)
);

-- Analytics Snapshots (daily/weekly/monthly snapshots of key metrics)
create table if not exists analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  type analytics_snapshot_type not null,
  period_start timestamptz not null,           -- start of the period
  period_end timestamptz not null,             -- end of the period
  metrics jsonb not null default '{}'::jsonb,  -- stored metrics (visitors, orders, revenue, etc.)
  created_at timestamptz not null default now(),
  unique(type, period_start, period_end)       -- prevent duplicate snapshots for same period
);

-- Inventory adjustments table already exists as stock_adjustments in migration 0001

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes for common queries
-- ─────────────────────────────────────────────────────────────────────────────
create index if not exists idx_cms_content_type on cms_content(type);
create index if not exists idx_cms_content_key on cms_content(key);
create index if not exists idx_cms_content_status on cms_content(status);

create index if not exists idx_seo_pages_type on seo_pages(type);
create index if not exists idx_seo_pages_entity on seo_pages(entity_id, entity_type);
create index if not exists idx_seo_pages_path on seo_pages(path);

create index if not exists idx_app_settings_key on app_settings(key);
create index if not exists idx_app_settings_public on app_settings(is_public);

create index if not exists idx_reviews_product on reviews(product_id);
create index if not exists idx_reviews_customer on reviews(customer_id);
create index if not exists idx_reviews_status on reviews(status);
create index if not exists idx_reviews_created on reviews(created_at desc);

create index if not exists idx_analytics_snapshots_type on analytics_snapshots(type);
create index if not exists idx_analytics_snapshots_period on analytics_snapshots(period_start, period_end);

-- ─────────────────────────────────────────────────────────────────────────────
-- Updated-at trigger (applied to versioned tables)
-- ─────────────────────────────────────────────────────────────────────────────
drop trigger if exists trg_cms_content_updated on cms_content;
create trigger trg_cms_content_updated before update on cms_content
  for each row execute function set_updated_at();

drop trigger if exists trg_seo_pages_updated on seo_pages;
create trigger trg_seo_pages_updated before update on seo_pages
  for each row execute function set_updated_at();

drop trigger if exists trg_app_settings_updated on app_settings;
create trigger trg_app_settings_updated before update on app_settings
  for each row execute function set_updated_at();

drop trigger if exists trg_reviews_updated on reviews;
create trigger trg_reviews_updated before update on reviews
  for each row execute function set_updated_at();

drop trigger if exists trg_analytics_snapshots_updated on analytics_snapshots;
create trigger trg_analytics_snapshots_updated before update on analytics_snapshots
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
alter table cms_content enable row level security;
alter table seo_pages enable row level security;
alter table app_settings enable row level security;
alter table reviews enable row level security;
alter table analytics_snapshots enable row level security;

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
    'cms_content','seo_pages','app_settings','reviews','analytics_snapshots'
  ]
  loop
    execute format('drop policy if exists %I on %I;', t || '_staff_all', t);
    execute format(
      'create policy %I on %I for all to authenticated using (%s) with check (%s);',
      t || '_staff_all', t, 'is_staff()', 'is_staff()'
    );
  end loop;
end $$;

-- Public access policies (for frontend where appropriate)
create policy cms_content_public_read on cms_content
  for select to anon
  using (status = 'active');

create policy seo_pages_public_read on seo_pages
  for select to anon
  using (true);  -- SEO data is public by nature

create policy app_settings_public_read on app_settings
  for select to anon
  using (is_public = true);

create policy reviews_public_read on reviews
  for select to anon
  using (status = 'approved');

create policy reviews_customer_insert on reviews
  for insert to authenticated
  with check (
    customer_id in (select id from customers where auth_user_id = auth.uid())
  );

create policy reviews_customer_select on reviews
  for select to authenticated
  using (
    customer_id in (select id from customers where auth_user_id = auth.uid())
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification View for Security Auditing
-- ─────────────────────────────────────────────────────────────────────────────
create or replace view public.security_policy_audit as
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as using_expression,
  with_check as with_check_expression
from pg_policies
where schemaname = 'public';