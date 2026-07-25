/**
 * Chouhan Mattress - Full Interactive Cart Page (/cart)
 * Full page cart manager with item editing, coupon validation, order summary breakdown, and cross-sells
 */

'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { ProductGrid } from '@/components/library/ProductGrid';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Breadcrumbs } from '@/components/plp/Breadcrumbs';

import { useCart } from '@/context/CartContext';
import productsData from '@/data/products.json';
import footerData from '@/data/footer.json';
import navigationData from '@/data/navigation.json';
import {
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ShoppingBagIcon,
} from 'lucide-react';

const NAV_ITEMS = navigationData.primary.map((item) => ({
  label: item.label,
  href: item.href,
  children: [] as { label: string; href: string }[],
}));

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

function CartPageContent() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    originalSubtotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    totalSavings,
    shippingFee,
    gstAmount,
    grandTotal,
    amountNeededForFreeShipping,
    freeShippingThreshold,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const success = applyCoupon(couponCodeInput);
    if (success) {
      setCouponCodeInput('');
    }
  };

  // Cross sell items (pillows & bedding)
  const crossSellProducts = productsData
    .filter((p) => p.category === 'bedding' || p.category === 'furniture')
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      primaryImage: p.thumbnail || p.images[0],
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      rating: p.rating,
      reviewCount: p.reviewCount,
      thumbnail: p.thumbnail,
      images: p.images,
      href: `/product/${p.id}`,
      badges: p.badges?.map((b: string) => ({
        text: b,
        variant: b.includes('%') ? ('warning' as const) : ('primary' as const),
      })),
      inStock: p.inStock,
      category: p.category,
      delivery: p.delivery,
    }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <CartDrawer />
      <SearchModal />

      <Header
        brandName="Chouhan Mattress"
        brandLink="/"
        navItems={NAV_ITEMS}
        showCart
        showSearch
        showAccount
        showWishlist
        data-testid="main-header"
      />

      <main id="main-content" className="flex-1 pb-16">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: 'Shopping Cart', isCurrent: true },
            ]}
          />

          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
            <span>Shopping Cart</span>
            <span className="text-sm font-semibold bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </span>
          </h1>

          {items.length === 0 ? (
            /* Empty Cart View */
            <div className="py-20 bg-white rounded-3xl border border-gray-100 p-8 text-center max-w-xl mx-auto shadow-xs">
              <div className="w-20 h-20 rounded-full bg-orange-100/60 text-[#F26522] flex items-center justify-center mx-auto mb-4 text-3xl">
                🛒
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                Looks like you haven't added any products to your cart yet. Explore our handcrafted collection!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors shadow-sm"
              >
                <ShoppingBagIcon className="w-4 h-4" />
                <span>Browse All Products</span>
              </Link>
            </div>
          ) : (
            /* Full Cart Grid Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cart Items List (8 Columns) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Shipping Progress Banner */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                    <span className="flex items-center gap-2">
                      <TruckIcon className="w-5 h-5 text-[#F26522]" />
                      {amountNeededForFreeShipping > 0 ? (
                        <>
                          Add <span className="text-[#F26522] font-bold">₹{amountNeededForFreeShipping.toLocaleString()}</span> more for FREE Shipping!
                        </>
                      ) : (
                        <span className="text-green-700 font-bold">🎉 You unlocked FREE Pan-India Shipping!</span>
                      )}
                    </span>
                    <span className="text-gray-500 font-bold">{freeShippingProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-orange-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F26522] transition-all duration-500 rounded-full"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Items Table / Cards */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
                          {item.name}
                        </h3>
                        {(item.size || item.thickness) && (
                          <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full mb-2">
                            {item.size} {item.thickness ? `• ${item.thickness}` : ''}
                          </span>
                        )}

                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{(item.originalPrice * item.quantity).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-bold text-gray-900 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          aria-label={`Remove ${item.name}`}
                          title="Remove Item"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust Callout Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-[#F26522] flex items-center justify-center flex-shrink-0">
                      <TruckIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">Free Shipping</h4>
                      <p className="text-[11px] text-gray-500">Pan-India doorstep delivery</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <RotateCcwIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">100 Night Trial</h4>
                      <p className="text-[11px] text-gray-500">Risk-free home trial</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                      <ShieldCheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">10 Year Warranty</h4>
                      <p className="text-[11px] text-gray-500">Full factory warranty</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary & Coupon Engine (4 Columns) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Coupon Code Card */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <TagIcon className="w-4 h-4 text-[#F26522]" />
                    <span>Apply Coupon Code</span>
                  </h3>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200 text-xs">
                      <div>
                        <span className="font-bold text-green-800 flex items-center gap-1">
                          <CheckCircle2Icon className="w-3.5 h-3.5" /> '{appliedCoupon.code}' Applied
                        </span>
                        <p className="text-green-700 text-[11px] mt-0.5">{appliedCoupon.description}</p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try code HOME"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#F26522] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#d85519] transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <XCircleIcon className="w-3.5 h-3.5" /> {couponError}
                    </p>
                  )}

                  {/* Available Coupon Chips */}
                  <div className="pt-2">
                    <span className="text-[11px] text-gray-400 font-semibold block mb-2">Available Coupons:</span>
                    <div className="flex flex-wrap gap-2">
                      {['HOME', 'FIRST500', 'SLEEPWELL'].map((code) => (
                        <button
                          key={code}
                          onClick={() => applyCoupon(code)}
                          className="px-2.5 py-1 text-[11px] font-bold border border-dashed border-orange-300 bg-orange-50 text-[#F26522] rounded-lg hover:bg-orange-100 transition-colors"
                        >
                          🏷️ {code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
                    Order Summary
                  </h3>

                  <div className="space-y-2.5 text-xs sm:text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Original Price</span>
                      <span className="text-gray-400 line-through">₹{originalSubtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Catalog Discount</span>
                      <span className="font-semibold text-green-700">-₹{(originalSubtotal - subtotal).toLocaleString()}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-green-700 font-bold">
                        <span>Coupon Discount ({appliedCoupon.code})</span>
                        <span>-₹{couponDiscount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Estimated GST (18% included)</span>
                      <span>₹{gstAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span className="font-bold text-green-700">
                        {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-lg font-black text-gray-900">
                    <span>Grand Total:</span>
                    <span className="text-2xl text-[#F26522]">₹{grandTotal.toLocaleString()}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="p-2.5 bg-green-50 rounded-xl text-center text-xs font-bold text-green-800 border border-green-200">
                      🎉 Total Savings on this order: ₹{totalSavings.toLocaleString()}
                    </div>
                  )}

                  {/* Checkout Primary Button */}
                  <Link
                    href="/checkout"
                    className="w-full py-4 bg-[#F26522] text-white font-black text-base rounded-2xl hover:bg-[#d85519] transition-colors flex items-center justify-center gap-2 shadow-md focus-visible:outline-none"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>

                  <p className="text-center text-[11px] text-gray-400">
                    100% Encrypted & Safe Checkout • Free Returns
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cross-Sell Recommendations */}
          {crossSellProducts.length > 0 && (
            <div className="mt-16 pt-10 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Bought Together
              </h3>
              <ProductGrid
                products={crossSellProducts}
                columns={4}
                gap="md"
                variant="grid"
                showActions
                showBadges
                showRating
              />
            </div>
          )}
        </div>
      </main>

      <Footer
        brandName="Chouhan Mattress"
        brandDescription={footerData.company.description}
        navSections={FOOTER_NAV_SECTIONS}
        socialLinks={footerData.social.map((s) => ({
          platform: s.platform,
          href: s.href,
          label: s.platform,
          icon: <span className="sr-only">{s.platform}</span>,
        }))}
        newsletter={{
          placeholder: 'Enter your email',
          buttonText: 'Subscribe',
        }}
        contactInfo={{
          phone: footerData.company.phone,
          email: footerData.company.email,
          address: footerData.company.address,
          hours: footerData.company.hours,
        }}
        legalLinks={footerData.links.policies}
        showCopyright
        copyrightText={`© ${new Date().getFullYear()} Chouhan Mattress Private Limited. CIN: ${footerData.company.cin}`}
        data-testid="main-footer"
      />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Cart...</div>}>
      <CartPageContent />
    </Suspense>
  );
}
