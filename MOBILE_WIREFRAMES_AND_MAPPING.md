# CHOUHAN MATTRESS — MOBILE WIREFRAMES, DESIGN SYSTEM & COMPONENT MAPPING

## 1. TEXT-BASED MOBILE WIREFRAMES

### Wireframe 1: Compact 54px Mobile Header & Search Bar
```
+-------------------------------------------------------------+
| [☰]  [👑 CHOUHAN MATTRESS]           [🔍] [❤️] [🛒(3)]     |  <- 54px Height
+-------------------------------------------------------------+
```
- **Behavior:** On scroll, Announcement Bar hides. Clicking [🔍] opens instant full-screen search modal.

### Wireframe 2: High-Density 2-Column Mobile Product Grid Card
```
+---------------------------+  +---------------------------+
| [IMAGE 4:3]      [-55% OFF|  | [IMAGE 4:3]      [-40% OFF|
|                           |  |                           |
|                           |  |                           |
| ⭐ 4.8 (1.2k)    [❤️]     |  | ⭐ 4.9 (850)     [❤️]     |
| ShapeSense Ortho...       |  | Flipper Sofa Cum Bed      |
| ⚡ Free Delivery          |  | ⚡ Express Delivery       |
| ₹6,229  ~₹13,842~  [+Add] |  | ₹18,999 ~₹31,999~  [+Add] |
+---------------------------+  +---------------------------+
```
- **Density:** 2 cards per row on mobile (`grid-cols-2 gap-2.5`).
- **Touch CTA:** `+ Add` is always visible in bottom right thumb zone.

### Wireframe 3: Mobile PDP Thumb-Zone Layout & Sticky Buy Bar
```
+-------------------------------------------------------------+
| [← Back]                   Product Name             [❤️]   |
+-------------------------------------------------------------+
|                     [SWIPEABLE GALLERY]                     |
|                           ( o • o o )                       |
+-------------------------------------------------------------+
| Royal Ortho Hybrid Mattress                                 |
| ⭐ 4.9 (2,410 verified reviews)                              |
| ₹14,999  ~₹32,999~  (55% OFF)  | No Cost EMI ₹1,250/mo      |
+-------------------------------------------------------------+
| Select Size: [ Single ] [ Double ] [ Queen* ] [ King ]     | <- Horizontal Pill Bar
| Select Thickness: [ 6 Inch ] [ 8 Inch* ] [ 10 Inch ]        |
+-------------------------------------------------------------+
| [⚡ 100-Night Trial]   [🚚 Free Shipping]   [🛡️ 10-Yr Warranty] | <- 3-Col Micro Grid
+-------------------------------------------------------------+
====================== STICKY BOTTOM BAR ======================
| ₹14,999 (Queen)      [ Add to Cart ]   [ BUY NOW ⚡ ]      | <- 56px Fixed Thumb Bar
===============================================================
```

### Wireframe 4: 56px Mobile Bottom Navigation Bar
```
====================== FIXED BOTTOM NAV =======================
|   [🏠]       [📦]         [🔍]        [❤️]       [🛒(3)]    |
|   Home     Catalog      Search     Wishlist     Cart        | <- 56px Fixed
===============================================================
```
- **Behavior:** Fixed to bottom of screen with `pb-[env(safe-area-inset-bottom)]`. Active page icon highlighted in amber.

---

## 2. DESIGN SYSTEM SPECIFICATION (MOBILE-FIRST)

### A. Spacing Tokens (8px Rhythm)
```css
--space-1: 4px;   /* micro gaps */
--space-2: 8px;   /* inner card padding */
--space-3: 12px;  /* card margin & text gaps */
--space-4: 16px;  /* mobile container edge padding */
--space-6: 24px;  /* mobile section spacing */
--space-8: 32px;  /* major section divider */
```

### B. Typography Tokens
```css
--font-mobile-h1: 20px / 24px leading / 800 weight;
--font-mobile-h2: 18px / 22px leading / 700 weight;
--font-mobile-h3: 13px / 16px leading / 700 weight;
--font-mobile-body: 13px / 18px leading / 400 weight;
--font-mobile-caption: 11px / 14px leading / 600 weight;
```

### C. Touch Target Guidelines
- All interactive controls: **Minimum 44px × 44px**.
- Input fields: **Height 44px (`h-11`), Font-size 16px (`text-base`)** (Prevents iOS Safari auto-zoom).

---

## 3. COMPONENT GOVERNANCE MAPPING (OLD → REFACTORED)

| Legacy Component | Issue / Limitation | Refactored Architecture | Strategy |
|---|---|---|---|
| `Header.tsx` | 192px tall, stacked search row, dark horizontal scroll sub-nav | `Header.tsx` (54px compact) + `MobileBottomNav.tsx` | Refactor Header layout & create reusable `MobileBottomNav.tsx` |
| `ProductCard.tsx` | Oversized 1-column grid card, hover-only Add CTA, 20px price | `ProductCard.tsx` (Supports high-density 2-column mobile layout with touch `+ Add` CTA) | Update existing grid variant with mobile-first classes |
| `ProductGrid.tsx` | `grid-cols-1 sm:grid-cols-2` default | `ProductGrid.tsx` (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4`) | Refactor responsive grid defaults |
| `src/app/product/[id]/page.tsx` | Unanchored buy buttons, vertical specs table, vertical variant stack | Enhanced PDP layout with horizontal variant pills + `StickyAddToCartBar.tsx` | Refactor PDP structure & sticky action bar |
