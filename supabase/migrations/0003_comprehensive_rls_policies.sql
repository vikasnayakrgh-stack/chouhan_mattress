-- ─────────────────────────────────────────────────────────────────────────────
-- Chouhan Mattress — Migration 0003: Comprehensive Table-Level RLS Policies & Verification
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable Row Level Security on ALL tables
alter table if exists products enable row level security;
alter table if exists product_variants enable row level security;
alter table if exists categories enable row level security;
alter table if exists collections enable row level security;
alter table if exists customers enable row level security;
alter table if exists orders enable row level security;
alter table if exists returns enable row level security;
alter table if exists discounts enable row level security;
alter table if exists staff enable row level security;

-- 1. Helper function to check if current JWT user has staff/admin privileges
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
as $$
  select coalesce(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role') in ('owner', 'admin', 'manager', 'staff', 'viewer'),
    false
  );
$$;

-- 2. Staff Table RLS
drop policy if exists staff_self_read on staff;
drop policy if exists staff_admin_all on staff;

create policy staff_self_read on staff
  for select to authenticated
  using (auth_user_id = auth.uid() or email = (auth.jwt() ->> 'email') or is_staff());

create policy staff_admin_all on staff
  for all to authenticated
  using (is_staff())
  with check (is_staff());

-- 3. Returns Table RLS
drop policy if exists returns_staff_access on returns;
drop policy if exists returns_customer_select on returns;
drop policy if exists returns_anon_deny on returns;

create policy returns_staff_access on returns
  for all to authenticated
  using (is_staff()) with check (is_staff());

create policy returns_customer_select on returns
  for select to authenticated
  using (
    customer_id in (select id from customers where auth_user_id = auth.uid())
  );

create policy returns_anon_deny on returns
  for all to anon using (false) with check (false);

-- 4. Discounts Table RLS
drop policy if exists discounts_public_read on discounts;
drop policy if exists discounts_staff_write on discounts;

create policy discounts_public_read on discounts
  for select using (status = 'active' or is_staff());

create policy discounts_staff_write on discounts
  for all to authenticated
  using (is_staff()) with check (is_staff());

-- 5. Verification View for Security Auditing
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
