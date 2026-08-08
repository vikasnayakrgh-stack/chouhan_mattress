# CHOUHAN MATTRESS — COMPREHENSIVE MOBILE UX AUDIT REPORT (52 FINDINGS)

**Audit Date:** August 8, 2026  
**Audit Scope:** Mobile Viewports (375px - 412px iPhone & Android Devices)  
**Reference Benchmarks:** Amazon, Pepperfry, IKEA, Apple Store, Nike Mobile  

---

## EXECUTIVE AUDIT SUMMARY

A brutal, expert-level mobile UX audit of the current Chouhan Mattress platform identified **52 distinct usability, conversion, and performance issues**. The primary bottleneck on mobile is **low screen information density**, **excessive vertical header bloat**, **hover-dependent action buttons**, and **sub-optimal thumb-zone placement**.

| Severity | Count | Primary Impact |
|---|---|---|
| 🔴 **Critical** | 12 | Directly breaks mobile conversion, hides Add to Cart CTAs, or blocks purchasing flow. |
| 🟠 **High** | 18 | Harms mobile usability, causes severe scroll fatigue, or degrades visual hierarchy. |
| 🟡 **Medium** | 14 | Noticeable design flaws, tap target violations (< 44px), or font contrast issues. |
| 🔵 **Low** | 8 | Visual polish, minor animation stutter, or padding inconsistency. |

---

## 1. HEADER, SEARCH & NAVIGATION ISSUES

### Issue 01 — Excessive Sticky Header Height (192px Bloat)
- **Severity:** 🔴 Critical
- **Problem:** Sticky header stacks Announcement Bar (36px) + Main Navy Bar (64px) + Search Row (52px) + Sub-nav (40px) = 192px total height on mobile.
- **UX Principle Violation:** Obscures 30% of the mobile viewport, hiding primary shop content and causing disorienting scroll jumps.
- **Benchmark Reference:** Amazon Mobile & Nike app maintain a 54px compact sticky header.
- **Recommendation:** Collapse header into a 54px compact bar. Hide announcement bar and sub-nav on mobile scroll; trigger search via modal icon.

### Issue 02 — Hover-Only Search Bar Shortcut Key (⌘K)
- **Severity:** 🟡 Medium
- **Problem:** Search trigger input displays desktop shortcut `⌘K` on mobile browsers.
- **UX Principle Violation:** Irrelevant shortcut key on mobile touchscreens creates cognitive noise.
- **Recommendation:** Replace `⌘K` badge with a clean search icon or `Search` label on mobile viewports.

### Issue 03 — Horizontal Overflow Category Bar Contrast & Size
- **Severity:** 🟠 High
- **Problem:** Sub-nav bar (`bg-[#0B132B]`) uses horizontal scrolling with tiny 11px text and dark background.
- **UX Principle Violation:** Hard to read in bright outdoor conditions; lacks visual affordance for horizontal scrollability.
- **Recommendation:** Replace dark overflow bar with a clean icon category grid on the homepage and a bottom thumb menu for navigation.

### Issue 04 — Missing Bottom Navigation Bar (Thumb Zone Deficit)
- **Severity:** 🔴 Critical
- **Problem:** All navigation triggers (Account, Cart, Wishlist, Menu) are anchored at the top of the mobile screen.
- **UX Principle Violation:** Violates Steven Hoober’s Thumb Zone principle—the top 30% of a mobile screen is the hardest area for one-handed thumb interaction.
- **Benchmark Reference:** Flipkart, Pepperfry, and IKEA apps feature a 56px fixed bottom navigation bar.
- **Recommendation:** Build `MobileBottomNav.tsx` containing `Home`, `Catalog`, `Search`, `Wishlist`, and `Cart (with live badge)`.

### Issue 05 — Header Account Icon Double-Tap Trap
- **Severity:** 🟠 High
- **Problem:** Account icon in header redirects directly to `/account` without showing login state on mobile.
- **UX Principle Violation:** Unexpected navigation when user is unauthenticated.
- **Recommendation:** Link account icon to unified auth modal/drawer or login route cleanly.

### Issue 06 — Tiny Tap Target Size on Mobile Menu Icon (32px)
- **Severity:** 🟡 Medium
- **Problem:** Mobile hamburger toggle button is 32px × 32px.
- **UX Principle Violation:** WCAG 2.1 AA Target Size (Minimum 44px × 44px).
- **Recommendation:** Set minimum padding and container bounds to `min-h-[44px] min-w-[44px]`.

### Issue 07 — Lack of Sticky Cart Counter Visibility During Fast Scroll
- **Severity:** 🟠 High
- **Problem:** Cart badge is only visible inside the top header. When user scrolls past 300px, cart item count is lost from view.
- **UX Principle Violation:** Reduces cart awareness and checkout impulse.
- **Recommendation:** Keep live cart counter active in the sticky bottom navigation bar.

### Issue 08 — Mobile Search Input Width Overflow
- **Severity:** 🟡 Medium
- **Problem:** Search input inside modal touches screen edges on 375px screens.
- **Recommendation:** Apply `px-4` safe area margins.

### Issue 09 — Mobile Category Sub-menu Horizontal Scroll Indicator Missing
- **Severity:** 🔵 Low
- **Problem:** Category bar cuts off text without a scroll shadow gradient.
- **Recommendation:** Add right-side fade mask `mask-image: linear-gradient(to right, black 85%, transparent 100%)`.

### Issue 10 — Announcement Bar Code Link Tap Difficulty
- **Severity:** 🔵 Low
- **Problem:** Coupon code `ROYALBED` is non-copyable on mobile touch.
- **Recommendation:** Make coupon code tap-to-copy with toast notification.

---

## 2. PRODUCT CARD & PLP GRID ISSUES

### Issue 11 — Oversized 1-Column Product Cards (Low Density)
- **Severity:** 🔴 Critical
- **Problem:** Mobile product grid renders 1 product card per row taking `100%` viewport width.
- **UX Principle Violation:** Severe scroll fatigue; shows only 1 to 1.5 products per screen scroll.
- **Benchmark Reference:** Amazon, Pepperfry, and Flipkart use 2-column mobile grids (`grid-cols-2`).
- **Recommendation:** Re-architect product grid to `grid-cols-2 gap-2.5 sm:gap-4` on mobile viewports.

### Issue 12 — Hover-Only "Add to Cart" Button Hidden on Mobile
- **Severity:** 🔴 Critical
- **Problem:** `ProductCard.tsx` uses `opacity-0 group-hover:opacity-100` for the "Add to Cart" CTA.
- **UX Principle Violation:** Mobile touchscreens do not support hover. The CTA remains invisible until the user long-presses or taps the card.
- **Recommendation:** Render an always-visible, touch-friendly `+ Add` button in the bottom right thumb area of the card.

### Issue 13 — Oversized Card Padding (p-4) Wasting Mobile Space
- **Severity:** 🟠 High
- **Problem:** Product cards use `p-4` (16px padding on all sides) inside compact cards.
- **UX Principle Violation:** Reduces image and typography area, forcing text wrapping.
- **Recommendation:** Reduce mobile card padding to `p-2.5` (10px).

### Issue 14 — Large Font Price (text-xl) Overcrowding Card Footer
- **Severity:** 🟠 High
- **Problem:** Product price uses `text-xl` (20px font) on mobile cards.
- **UX Principle Violation:** Forces price and discount onto multiple lines.
- **Recommendation:** Scale current price to `text-sm font-extrabold` (14px) and original price to `text-[11px] line-through`.

### Issue 15 — Product Title Over-length (No Strict Line Truncation)
- **Severity:** 🟡 Medium
- **Problem:** Long product names expand card height unevenly.
- **UX Principle Violation:** Broken grid alignment.
- **Recommendation:** Enforce `line-clamp-2` with `min-h-[2.25rem]`.

### Issue 16 — Missing Quick Add Size Variant Modal on Card Tap
- **Severity:** 🟠 High
- **Problem:** Tapping "Add to Cart" adds default variant without letting user choose mattress size.
- **Recommendation:** Trigger a bottom sheet variant drawer when tapping `+ Add` if multiple sizes exist.

### Issue 17 — Rating Stars Overcrowding Mobile Card
- **Severity:** 🟡 Medium
- **Problem:** Rendering 5 individual SVG star icons takes 90px of horizontal card space.
- **Recommendation:** Collapse rating to a sleek single-star pill badge `⭐ 4.8 (1.2k)`.

### Issue 18 — Unanchored Discount Badges Obscuring Product Images
- **Severity:** 🟡 Medium
- **Problem:** Badges overlap product focal points.
- **Recommendation:** Position discount badge as a crisp pill `-55% OFF` in top right corner.

### Issue 19 — Missing Compact Delivery SLA Tag
- **Severity:** 🟠 High
- **Problem:** Mobile cards do not show delivery timeline (`Express Delivery` or `Free Shipping`).
- **Recommendation:** Add compact `⚡ Free Delivery` tag above price.

### Issue 20 — Wishlist Button Positioned Out of Thumb Reach
- **Severity:** 🔵 Low
- **Problem:** Wishlist heart icon is placed in top right of card.
- **Recommendation:** Keep heart icon in top right with 44px tap target area.

---

## 3. PRODUCT DETAIL PAGE (PDP) ISSUES

### Issue 21 — Primary "Buy Now" CTA Pushed Below the Fold
- **Severity:** 🔴 Critical
- **Problem:** Large product gallery and specs push main purchase buttons 800px down the page.
- **UX Principle Violation:** Direct conversion loss. Users must scroll endlessly to purchase.
- **Benchmark Reference:** Amazon & Apple Mobile feature a fixed sticky bottom buy bar.
- **Recommendation:** Implement `StickyAddToCartBar.tsx` anchored to the bottom screen with `Add to Cart` and `Buy Now` buttons.

### Issue 22 — Image Gallery Missing Swipe Pagination Dots
- **Severity:** 🟠 High
- **Problem:** Product gallery relies on thumbnail grid below main image instead of native mobile swipe indicators.
- **Recommendation:** Convert image gallery to touch-swipe container with active pagination dots (`swiper` pattern).

### Issue 23 — Size Variant Selector Grid Overflow
- **Severity:** 🟠 High
- **Problem:** Variant buttons stacked vertically take up 250px of vertical height.
- **Recommendation:** Convert size selector to horizontal scrollable pill bar (`Single`, `Double`, `Queen`, `King`).

### Issue 24 — Custom Dimension Calculator Modal Friction
- **Severity:** 🔴 Critical
- **Problem:** Custom size calculator opens a large desktop modal that gets cut off on 375px screens.
- **Recommendation:** Convert calculator into a full-height mobile bottom sheet drawer.

### Issue 25 — Pincode Delivery Checker Unaligned with Keyboard
- **Severity:** 🟡 Medium
- **Problem:** Mobile soft keyboard covers the `Check` button when typing pincode.
- **Recommendation:** Scroll active pincode input into center view on focus (`scrollIntoView`).

### Issue 26 — Trust Badges Rendered as Tall Vertical Stack
- **Severity:** 🟠 High
- **Problem:** `100-Night Trial`, `Free Shipping`, `10-Year Warranty` render as vertical list items taking 180px height.
- **Recommendation:** Layout trust signals in a compact 3-column horizontal grid with icons and text.

### Issue 27 — Long Product Specs Table Causing Horizontal Page Overflow
- **Severity:** 🔴 Critical
- **Problem:** Specification tables force page wide, creating unwanted horizontal scroll (viewport leak).
- **Recommendation:** Wrap tables in `overflow-x-auto` container with `max-w-full`.

### Issue 28 — EMI Calculator Missing Quick Breakdown Visibility
- **Severity:** 🟡 Medium
- **Problem:** EMI cost per month (`₹599/mo`) is hidden inside text description.
- **Recommendation:** Display prominent `No Cost EMI from ₹599/mo` badge next to current price.

### Issue 29 — Missing Instant "Buy Now" Direct Checkout Trigger
- **Severity:** 🔴 Critical
- **Problem:** PDP only features "Add to Cart", requiring 2 extra taps to reach checkout.
- **Recommendation:** Provide dual CTAs: `Add to Cart` (Outline) + `Buy Now` (Solid Accent).

### Issue 30 — Customer Reviews Section Lacks Filter Pills
- **Severity:** 🟡 Medium
- **Problem:** Reviews scroll indefinitely without photo/rating filter pills.
- **Recommendation:** Add filter pills `With Photos`, `5 Stars`, `Verified Buyers`.

---

## 4. CART & CHECKOUT MOBILE UX ISSUES

### Issue 31 — Cart Drawer Width 100% Without Safe Margin
- **Severity:** 🟡 Medium
- **Problem:** Cart drawer on mobile touches full screen edge, feeling like a page replace rather than a sheet overlay.
- **Recommendation:** Use full height bottom-up drawer or 90% right sheet with backdrop shadow.

### Issue 32 — Coupon Code Input Obscured by Checkout Button
- **Severity:** 🟠 High
- **Problem:** Coupon input is placed below cart items requiring scrolling down past 4 items.
- **Recommendation:** Place expandable `Have a Coupon?` accordion right above order summary total.

### Issue 33 — Missing Sticky Checkout Button inside Cart Drawer
- **Severity:** 🔴 Critical
- **Problem:** When cart contains 3+ items, "Proceed to Checkout" button scrolls off screen.
- **Recommendation:** Make cart total and Checkout CTA fixed at the bottom of the cart drawer.

### Issue 34 — Form Input Heights Under 44px
- **Severity:** 🟠 High
- **Problem:** Address form inputs use `py-2` (36px height).
- **UX Principle Violation:** Hard to tap on mobile touchscreens without mis-tapping adjacent fields.
- **Recommendation:** Set form inputs to `h-11` (44px height) with `text-base` font size (prevents iOS auto-zoom).

### Issue 35 — iOS Safari Auto-Zoom Trap on Form Focus
- **Severity:** 🔴 Critical
- **Problem:** Inputs with `text-xs` or `text-sm` (12px-14px) cause iOS Safari to forcibly zoom in on focus, breaking layout.
- **Recommendation:** Set all input `font-size: 16px` (`text-base`) on mobile viewports.

### Issue 36 — Unstacked Shipping Address Form Fields
- **Severity:** 🟡 Medium
- **Problem:** City and State fields render side-by-side on 375px screens causing input text truncation.
- **Recommendation:** Stack fields vertically on `xs` viewports (`grid-cols-1 sm:grid-cols-2`).

### Issue 37 — Missing Visual Payment Method Badges (UPI, GPay, Cards)
- **Severity:** 🟠 High
- **Problem:** Payment section only shows plain text options.
- **Recommendation:** Display recognized logos for UPI, GPay, PhonePe, Paytm, Visa, Mastercard.

### Issue 38 — Order Confirmation Receipt Print Button Irrelevant on Mobile
- **Severity:** 🔵 Low
- **Problem:** Showing "Print Receipt" CTA on mobile browsers.
- **Recommendation:** Replace with `Download PDF` or `Share Order Details via WhatsApp`.

### Issue 39 — Missing One-Tap Address Selection for Returning Users
- **Severity:** 🟠 High
- **Problem:** Saved delivery addresses require multiple taps to select.
- **Recommendation:** Render radio card selector with bold default highlight.

### Issue 40 — Free Shipping Progress Bar Missing
- **Severity:** 🟡 Medium
- **Problem:** Cart does not show how much more to add for free gifts/shipping.
- **Recommendation:** Add dynamic progress bar `Add ₹472 more to unlock Free Pillows`.

---

## 5. TYPOGRAPHY, SPACING & PERFORMANCE ISSUES

### Issue 41 — Giant H1 Headings on Mobile (32px Oversize)
- **Severity:** 🟠 High
- **Problem:** Section titles use `text-3xl` (30px) or `text-4xl` (36px) on mobile viewports.
- **Recommendation:** Clamp mobile headings to `text-xl sm:text-2xl font-black`.

### Issue 42 — Inconsistent Container Horizontal Padding (px-4 vs px-8)
- **Severity:** 🟡 Medium
- **Problem:** Some sections use `px-4`, others use `px-8` on mobile, creating jagged screen edges.
- **Recommendation:** Enforce universal mobile container padding `px-3.5 sm:px-6`.

### Issue 43 — Heavy Image Payload Slowing Mobile First Contentful Paint (FCP)
- **Severity:** 🔴 Critical
- **Problem:** Uncompressed 2000px wide hero images loaded on 375px mobile screens.
- **Recommendation:** Serve responsive image variants via Next.js `OptimizedImage` (`w=480` for mobile).

### Issue 44 — Missing iOS Safe-Area-Inset-Bottom Padding
- **Severity:** 🔴 Critical
- **Problem:** Sticky bottom bars overlap the home gesture indicator bar on iPhone X and newer.
- **Recommendation:** Add `pb-[env(safe-area-inset-bottom,16px)]` to all fixed bottom components.

### Issue 45 — Layout Shift (CLS) on Dynamic Price Hydration
- **Severity:** 🟠 High
- **Problem:** Price text pops in after JS hydration, causing page layout jump.
- **Recommendation:** Reserve exact font dimensions using skeleton placeholders.

### Issue 46 — Contrast Ratio Failure on Gray Meta Text (text-slate-400)
- **Severity:** 🟡 Medium
- **Problem:** `text-slate-400` on white background fails WCAG 4.5:1 contrast requirement.
- **Recommendation:** Upgrade secondary text to `text-slate-600` or `text-slate-700`.

### Issue 47 — Unused Heavy Animation Re-renders on Mobile Scroll
- **Severity:** 🟠 High
- **Problem:** Framer Motion animating 20+ product cards simultaneously causes dropped frames on mid-range Android devices.
- **Recommendation:** Disable complex entry animations on mobile viewports (`@media (max-width: 640px)`).

### Issue 48 — Missing Skeleton Loaders for Product Grids
- **Severity:** 🟡 Medium
- **Problem:** Empty white space shown while fetching products.
- **Recommendation:** Display 4-card 2-column skeleton grid during data loading.

### Issue 49 — Excessively Long Footer Accordion Un-collapsed
- **Severity:** 🟡 Medium
- **Problem:** Footer links take up 600px vertical space on mobile.
- **Recommendation:** Collapse footer link columns into expandable accordions on mobile.

### Issue 50 — Tap Highlight Color Gray Box Flashing on Mobile Safari
- **Severity:** 🔵 Low
- **Problem:** Tapping buttons causes ugly gray highlight box on iOS.
- **Recommendation:** Add `-webkit-tap-highlight-color: transparent;` to global CSS.

### Issue 51 — Missing Touch Swipe Support on Hero Carousel
- **Severity:** 🔴 Critical
- **Problem:** Hero carousel requires tapping small arrow buttons instead of finger swiping.
- **Recommendation:** Enable native touch drag/swipe gestures on hero slider.

### Issue 52 — Lack of Direct WhatsApp Sleep Assistant Quick Trigger
- **Severity:** 🔵 Low
- **Problem:** Floating chat button overlaps sticky cart bar on mobile.
- **Recommendation:** Reposition floating quiz button cleanly above sticky navigation bar.
