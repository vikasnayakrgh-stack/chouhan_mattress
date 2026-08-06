# Chouhan Mattress Admin Panel — Prioritized Improvement Roadmap

**Sprint:** Phase B3 Enterprise Admin Overhaul  
**Target Architecture:** Production-Grade Enterprise Ecommerce Dashboard (Shopify / Stripe / Linear Benchmark Quality)  

---

## 🚀 Implementation Phases

### Phase 1: Standalone Authentication Architecture
- [x] Detach `/admin/login` from `AdminShell` (no sidebar, no header, no breadcrumb).
- [x] Build standalone, glassmorphic login card with brand logo & Chouhan Mattress typography.
- [x] Add password visibility toggle (`Eye` / `EyeOff` icons).
- [x] Add "Remember Me" checkbox with local session persistence.
- [x] Add "Forgot Password" modal & password reset instructions trigger.
- [x] Add accessible validation, focus rings, and animated loading/error states.

### Phase 2: Collapsible Sidebar & Section Hierarchy
- [x] Implement dual-state sidebar (Expanded 260px / Collapsed 64px) with toggle button.
- [x] Organize items into visual sections:
  - **Core:** Dashboard, Analytics
  - **Catalog:** Products, Categories, Collections, Inventory
  - **Sales & Orders:** Orders, Returns, Discounts, Customers
  - **Operations:** Content CMS, Reviews, Staff, Settings
- [x] Add active item indicator beam and icon tooltips in collapsed mode.
- [x] Add keyboard shortcut listeners (`[`, `]`, `Esc`).

### Phase 3: Enterprise Header & Command Bar (`⌘K`)
- [x] Rebuild header with Slate Navy & Imperial Gold accents.
- [x] Implement Command Bar trigger (`⌘K` / `Ctrl+K`) for instant product/order lookup.
- [x] Build notification drawer with badge counters.
- [x] Build user profile popover menu with role badge (`Super Admin`) and Quick Actions.

### Phase 4: Reusable Design System Components
- [x] **Buttons:** Primary (Imperial Gold), Secondary, Danger, Ghost, Outline, Loading.
- [x] **Forms:** `AdminFormField` with focus ring (`ring-2 ring-amber-500`), error helper text, clean placeholders.
- [x] **Data Table (`AdminDataTable`):** Sticky header, row selection, bulk actions bar, CSV export trigger, pagination.
- [x] **KPI Cards (`AdminKPICard`):** Metrics, sparkline indicators, percentage growth pills (+14.2%).
- [x] **Status Badges (`AdminStatusBadge`):** Slate, Emerald, Amber, Crimson, Indigo pills.

### Phase 5: Dashboard Analytics & Operational Widgets
- [x] Rebuild `/admin/page.tsx` with Executive Dashboard KPIs:
  - Total Revenue (with growth trend)
  - Active Orders & Fulfillment Status
  - Average Order Value (AOV)
  - Total Customers & Repeat Rate
- [x] Add **Sales Analytics Chart** & **Category Distribution**.
- [x] Add **Low Stock Inventory Alerts** table widget.
- [x] Add **Recent Orders Stream** with one-click status transitions.
- [x] Add **Pending Returns & Support Alerts** panel.

### Phase 6: Quality Assurance & Build Verification
- [x] Execute `npm run type-check` (0 errors).
- [x] Execute `npm run build` (0 build warnings/errors).
- [x] Push all changes to GitHub repository (`origin main`).
