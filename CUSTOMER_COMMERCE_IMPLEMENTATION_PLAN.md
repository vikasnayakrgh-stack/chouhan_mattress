# CUSTOMER-FACING COMMERCE PLATFORM - IMPLEMENTATION PLAN
## Chouhan Mattress - From Admin Prototype to Complete Customer Commerce Platform

**Objective:** Transform the admin-focused prototype into a production-grade customer-facing commerce platform with full customer identity, account portal, persistent cart, authenticated checkout, wishlist, address book, and order history.

**Constraint:** Preserve all existing security controls, RLS, and architecture decisions. No payment integration until customer flows are fully functional.

---

## PHASE 1: CUSTOMER IDENTITY SYSTEM (Auth Foundation)

### 1.1 Auth Routes & Pages
| Route | File | Purpose |
|-------|------|---------|
| `/auth/signup` | `src/app/auth/signup/page.tsx` | Customer registration with email verification |
| `/auth/login` | `src/app/auth/login/page.tsx` | Customer login (email/password + OAuth) |
| `/auth/forgot-password` | `src/app/auth/forgot-password/page.tsx` | Password reset request |
| `/auth/reset-password` | `src/app/auth/reset-password/page.tsx` | Password reset with token |
| `/auth/verify-email` | `src/app/auth/verify-email/page.tsx` | Email verification landing |
| `/auth/callback` | `src/app/auth/callback/route.ts` | OAuth callback handler |

### 1.2 Auth API Routes
| Route | File | Purpose |
|-------|------|---------|
| `/api/auth/signup` | `src/app/api/auth/signup/route.ts` | Register customer, send verification email |
| `/api/auth/login` | `src/app/api/auth/login/route.ts` | Login, set session cookie |
| `/api/auth/logout` | `src/app/api/auth/logout/route.ts` | Clear session, revoke tokens |
| `/api/auth/me` | `src/app/api/auth/me/route.ts` | Get current user session |
| `/api/auth/refresh` | `src/app/api/auth/refresh/route.ts` | Refresh access token |
| `/api/auth/forgot-password` | `src/app/api/auth/forgot-password/route.ts` | Send reset email |
| `/api/auth/reset-password` | `src/app/api/auth/reset-password/route.ts` | Verify token, update password |

### 1.3 Middleware Updates
- Update `src/middleware.ts` to protect `/account/*`, `/wishlist`, `/cart`, `/checkout`
- Add customer role check (separate from admin staff roles)
- Redirect unauthenticated to `/auth/login?redirectTo=...`

### 1.4 Supabase Auth Configuration
- Enable email/password provider
- Configure email templates (verification, reset, magic link)
- Set up redirect URLs for production/staging
- Configure password strength requirements

---

## PHASE 2: CUSTOMER DATA MODEL & RLS

### 2.1 Database Schema (New Migration)
```sql
-- Customer profiles (extends auth.users)
create table if not exists customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  date_of_birth date,
  gender text,
  marketing_opt_in boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Customer addresses (reusable across orders)
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

-- Persistent cart (server-side, linked to user)
create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  applied_coupon_code text,
  updated_at timestamptz not null default now()
);

-- Wishlist (server-side, linked to user)
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references auth.users(id) on delete cascade,
  product_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Customer orders (link to existing orders table)
-- Note: orders table already exists, add customer_user_id column
alter table orders add column if not exists customer_user_id uuid references auth.users(id);
create index if not exists idx_orders_customer_user on orders(customer_user_id);
```

### 2.2 RLS Policies for Customer Tables
```sql
-- Customer profiles: users can only see/edit their own
alter table customer_profiles enable row level security;
create policy "customer_own_profile" on customer_profiles
  for all to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Customer addresses: users can only see/edit their own
alter table customer_addresses enable row level security;
create policy "customer_own_addresses" on customer_addresses
  for all to authenticated
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());

-- Carts: users can only see/edit their own
alter table carts enable row level security;
create policy "customer_own_cart" on carts
  for all to authenticated
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());

-- Wishlists: users can only see/edit their own
alter table wishlists enable row level security;
create policy "customer_own_wishlist" on wishlists
  for all to authenticated
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());

-- Orders: users can only see their own (existing RLS on orders table needs update)
-- Update existing orders policy to also check customer_user_id
```

---

## PHASE 3: REPOSITORY & SERVICE LAYER

### 3.1 New Repository Interfaces (`src/repositories/types.ts`)
```typescript
interface ICustomerProfileRepository {
  getById(id: string): Promise<CustomerProfile | null>
  upsert(profile: CustomerProfile): Promise<CustomerProfile>
}

interface ICustomerAddressRepository {
  getByCustomerId(customerId: string): Promise<CustomerAddress[]>
  getById(id: string): Promise<CustomerAddress | null>
  create(address: CustomerAddress): Promise<CustomerAddress>
  update(id: string, address: Partial<CustomerAddress>): Promise<CustomerAddress>
  delete(id: string): Promise<void>
  setDefault(customerId: string, addressId: string, type: 'shipping' | 'billing'): Promise<void>
}

interface ICartRepository {
  getByCustomerId(customerId: string): Promise<Cart | null>
  upsert(cart: Cart): Promise<Cart>
  clear(customerId: string): Promise<void>
}

interface IWishlistRepository {
  getByCustomerId(customerId: string): Promise<Wishlist | null>
  upsert(wishlist: Wishlist): Promise<Wishlist>
  addProduct(customerId: string, productId: string): Promise<Wishlist>
  removeProduct(customerId: string, productId: string): Promise<Wishlist>
  clear(customerId: string): Promise<void>
}
```

### 3.2 Supabase Repository Implementations (`src/repositories/supabase/`)
- `customerProfileRepository.ts`
- `customerAddressRepository.ts`
- `cartRepository.ts`
- `wishlistRepository.ts`

### 3.3 Services (`src/services/`)
- `authService.ts` - Auth helpers, session management
- `customerService.ts` - Profile, addresses, cart, wishlist coordination
- `checkoutService.ts` - Order creation, validation

---

## PHASE 4: CUSTOMER ACCOUNT PORTAL

### 4.1 Protected Routes Structure
```
src/app/account/
├── layout.tsx          # Auth guard layout
├── page.tsx            # Dashboard redirect
├── orders/
│   ├── page.tsx        # Order history list
│   └── [orderNumber]/
│       └── page.tsx    # Order detail with tracking
├── profile/
│   └── page.tsx        # Profile management
├── addresses/
│   ├── page.tsx        # Address book list
│   └── new/
│       └── page.tsx    # Add/edit address
├── wishlist/
│   └── page.tsx        # Saved items (server-rendered)
├── cart/
│   └── page.tsx        # Cart (server-rendered for SSR)
└── support/
    ├── page.tsx        # Support center
    └── returns/
        └── page.tsx    # Returns history
```

### 4.2 Account Layout with Auth Guard
- Server component that checks session
- Redirects to `/auth/login` if not authenticated
- Provides user context to children

---

## PHASE 5: CART & CHECKOUT INTEGRATION

### 5.1 Cart Context Updates
- Sync with server-side cart when authenticated
- Merge localStorage cart on login
- Real-time updates via Supabase Realtime (optional)
- Guest cart persists in localStorage

### 5.2 Checkout Flow
- Step 1: Address (pre-filled from saved addresses, editable)
- Step 2: Shipping options
- Step 3: Payment method selection (UI only, no payment processing)
- Server-side order creation via `/api/checkout/create-order`
- Order confirmation page with order number

### 5.3 API Routes
- `/api/cart` - GET (fetch), POST (add), PATCH (update), DELETE (remove)
- `/api/wishlist` - GET, POST, DELETE
- `/api/addresses` - GET, POST, PATCH, DELETE
- `/api/checkout/create-order` - POST (create order from cart)

---

## PHASE 6: SECURITY & VERIFICATION

### 6.1 Security Controls to Implement
- CSRF protection on all mutating actions (double-submit cookie)
- Rate limiting on auth endpoints (5 req/min)
- Rate limiting on checkout (10 req/min)
- Input validation with Zod schemas
- Secure cookie settings (HttpOnly, Secure, SameSite=Strict for auth)
- Content Security Policy tightening
- Security headers (HSTS, Referrer-Policy, Permissions-Policy)

### 6.2 RLS Verification
- Test all customer tables with 2+ test accounts
- Verify cross-user isolation
- Test service role never exposed client-side

---

## PHASE 7: REGRESSION TESTING & REPORTS

### 7.1 Test Scenarios
| Scenario | Description |
|----------|-------------|
| TC-001 | New user signup → email verification → login → access account |
| TC-002 | Login → add to cart → checkout → order created |
| TC-003 | Login → add to wishlist → move to cart → checkout |
| TC-004 | Login → add address → use in checkout |
| TC-005 | Login → view order history → order detail |
| TC-006 | Cross-user isolation (User A cannot see User B data) |
| TC-007 | Session persistence across browser restart |
| TC-008 | Logout clears session, redirects to login |
| TC-009 | Password reset flow |
| TC-010 | Guest cart merges on login |

### 7.2 Reports to Generate
1. **IMPLEMENTATION_REPORT.md** - What was built, files changed
2. **SECURITY_VERIFICATION_REPORT.md** - Security testing results
3. **REGRESSION_REPORT.md** - Test case results
4. **CUSTOMER_JOURNEY_REPORT.md** - End-to-end flow documentation

---

## FILES TO CREATE/MODIFY

### New Files (Priority Order)
```
1. src/app/auth/signup/page.tsx
2. src/app/auth/login/page.tsx
3. src/app/auth/forgot-password/page.tsx
4. src/app/auth/reset-password/page.tsx
5. src/app/auth/verify-email/page.tsx
6. src/app/auth/callback/route.ts
7. src/app/api/auth/signup/route.ts
8. src/app/api/auth/login/route.ts
9. src/app/api/auth/logout/route.ts
10. src/app/api/auth/me/route.ts
11. src/app/api/auth/forgot-password/route.ts
11. src/app/api/auth/reset-password/route.ts
12. src/app/api/cart/route.ts
13. src/app/api/wishlist/route.ts
14. src/app/api/addresses/route.ts
15. src/app/api/addresses/[id]/route.ts
16. src/app/api/checkout/create-order/route.ts (enhance existing)
17. src/app/account/layout.tsx
18. src/app/account/page.tsx (update)
19. src/app/account/orders/page.tsx
20. src/app/account/orders/[orderNumber]/page.tsx
21. src/app/account/profile/page.tsx
22. src/app/account/addresses/page.tsx
23. src/app/account/addresses/new/page.tsx
24. src/app/account/wishlist/page.tsx
25. src/app/account/cart/page.tsx
26. src/app/account/support/page.tsx
27. src/repositories/supabase/customerProfileRepository.ts
28. src/repositories/supabase/customerAddressRepository.ts
29. src/repositories/supabase/cartRepository.ts
30. src/repositories/supabase/wishlistRepository.ts
31. src/services/authService.ts
32. src/services/customerService.ts
33. supabase/migrations/0002_customer_schema.sql
34. src/middleware.ts (update)
35. src/lib/supabase/client.ts (update for server-side)
36. src/lib/validations/auth.ts
37. src/lib/validations/cart.ts
38. src/lib/validations/address.ts
```

### Modified Files
```
1. src/middleware.ts - Add customer route protection
2. src/app/account/page.tsx - Enhance with real data
3. src/app/cart/page.tsx - Server-rendered with auth
4. src/app/wishlist/page.tsx - Server-rendered with auth
5. src/app/checkout/page.tsx - Authenticated flow
6. src/context/CartContext.tsx - Server sync
7. src/repositories/index.ts - Add new repos
8. src/repositories/types.ts - Add new interfaces
9. src/services/index.ts - Export new services
10. next.config.js - Security headers
```

---

## IMPLEMENTATION ORDER

### Sprint 1 (Week 1-2): Auth Foundation
- Auth routes & pages (signup, login, password reset, email verify)
- Auth API routes
- Middleware protection for customer routes
- Supabase Auth configuration

### Sprint 2 (Week 2-3): Customer Data Layer
- Database migration (0002_customer_schema.sql)
- RLS policies for customer tables
- Repository implementations
- Service layer

### Sprint 3 (Week 3-4): Account Portal & Cart
- Account layout with auth guard
- All account pages (orders, profile, addresses, wishlist, cart)
- Cart context server sync
- Checkout authenticated flow

### Sprint 4 (Week 4-5): Security & Testing
- Security headers, CSRF, rate limiting
- Full regression testing
- Report generation

---

## DEPENDENCIES TO ADD
```json
{
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0",
  "react-hook-form": "^7.49.0"
}
```

---

## SUCCESS CRITERIA
- [ ] Customer can signup, verify email, login, logout
- [ ] Customer can reset password
- [ ] All `/account/*`, `/wishlist`, `/cart`, `/checkout` require auth
- [ ] Cart persists server-side when authenticated
- [ ] Wishlist persists server-side when authenticated
- [ ] Address book works (CRUD, default selection)
- [ ] Order history displays with tracking
- [ ] Checkout pre-fills address, creates order
- [ ] Cross-user data isolation verified (RLS)
- [ ] Security headers present, CSP strict
- [ ] All regression tests pass
- [ ] 4 reports generated

---

## NOTES
- **No payment integration** - Stop at order creation with `payment_status: 'pending'`
- **Preserve admin panel** - Zero changes to `/admin/*` routes
- **RLS is source of truth** - All data access through Supabase client with user JWT
- **Server Components preferred** - Use RSC for data fetching, Client Components only for interactivity
- **TypeScript strict** - No `any`, proper interfaces everywhere