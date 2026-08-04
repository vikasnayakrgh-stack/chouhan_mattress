-- ─────────────────────────────────────────────────────────────────────────────
-- Chouhan Mattress — Migration 0002: Customer RLS Policies & Auth Linkage
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Ensure linkage columns for Supabase Auth (auth.users) exist
alter table customers add column if not exists auth_user_id uuid references auth.users(id) on delete set null;
alter table orders add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_customers_auth_user on customers(auth_user_id);
create index if not exists idx_orders_user on orders(user_id);

-- 2. Drop legacy blanket policies for catalog and orders
drop policy if exists products_staff_all on products;
drop policy if exists products_no_anon on products;
drop policy if exists product_variants_staff_all on product_variants;
drop policy if exists product_variants_no_anon on product_variants;

drop policy if exists categories_staff_all on categories;
drop policy if exists categories_no_anon on categories;
drop policy if exists collections_staff_all on collections;
drop policy if exists collections_no_anon on collections;

drop policy if exists orders_staff_all on orders;
drop policy if exists orders_no_anon on orders;
drop policy if exists customers_staff_all on customers;
drop policy if exists customers_no_anon on customers;

-- 3. Storefront Catalog Policies (Public Read for Active Items)
create policy products_public_read on products
  for select using (status = 'active' or is_staff());

create policy products_staff_write on products
  for all to authenticated using (is_staff()) with check (is_staff());

create policy product_variants_public_read on product_variants
  for select using (status = 'active' or is_staff());

create policy product_variants_staff_write on product_variants
  for all to authenticated using (is_staff()) with check (is_staff());

create policy categories_public_read on categories
  for select using (status = 'active' or is_staff());

create policy categories_staff_write on categories
  for all to authenticated using (is_staff()) with check (is_staff());

create policy collections_public_read on collections
  for select using (status = 'active' or is_staff());

create policy collections_staff_write on collections
  for all to authenticated using (is_staff()) with check (is_staff());

-- 4. Orders Least-Privilege RLS Policies
-- Allow staff full access
create policy orders_staff_access on orders
  for all to authenticated using (is_staff()) with check (is_staff());

-- Allow logged-in customer to SELECT only their own orders
create policy orders_customer_select on orders
  for select to authenticated
  using (
    user_id = auth.uid()
    or customer_id in (select id from customers where auth_user_id = auth.uid())
  );

-- Deny direct anon access to orders table (creation MUST go through /api/checkout/create-order)
create policy orders_anon_deny on orders
  for all to anon using (false) with check (false);

-- 5. Customers Table RLS Policies
create policy customers_staff_access on customers
  for all to authenticated using (is_staff()) with check (is_staff());

create policy customers_self_select on customers
  for select to authenticated
  using (
    auth_user_id = auth.uid() or id = auth.uid()
  );

create policy customers_self_update on customers
  for update to authenticated
  using (auth_user_id = auth.uid() or id = auth.uid())
  with check (auth_user_id = auth.uid() or id = auth.uid());

create policy customers_anon_deny on customers
  for all to anon using (false) with check (false);
