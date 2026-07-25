/**
 * Chouhan Mattress - Interactive Slide-over Cart Drawer Component
 * Connected to global CartContext with free shipping progress bar, promo code engine, and checkout link
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  XIcon,
  PlusIcon,
  MinusIcon,
  Trash2Icon,
  TruckIcon,
  CreditCardIcon,
  TagIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    subtotal,
    totalSavings,
    grandTotal,
    appliedCoupon,
    amountNeededForFreeShipping,
    freeShippingThreshold,
  } = useCart();

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Slide-over Cart Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Your Cart</h2>
            <span className="bg-[#F26522] text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors focus-visible:outline-none"
            aria-label="Close cart drawer"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-orange-50 p-3.5 border-b border-orange-100">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <TruckIcon className="w-4 h-4 text-[#F26522]" />
              {amountNeededForFreeShipping > 0 ? (
                <>
                  Add <span className="text-[#F26522] font-bold">₹{amountNeededForFreeShipping.toLocaleString()}</span> more for FREE Shipping!
                </>
              ) : (
                <span className="text-green-700 font-bold">🎉 You unlocked FREE Shipping!</span>
              )}
            </span>
            <span className="text-gray-500 font-bold">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-orange-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F26522] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 rounded-full bg-orange-100/60 text-[#F26522] flex items-center justify-center mb-4 text-3xl">
                🛒
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mb-6">
                Discover our handcrafted mattresses and comfort collection to get started.
              </p>
              <button
                onClick={closeDrawer}
                className="px-6 py-3 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4" role="list">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  {/* Item Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>

                      {(item.size || item.thickness) && (
                        <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                          {item.size} {item.thickness ? `• ${item.thickness}` : ''}
                        </p>
                      )}
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-sm font-extrabold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-1.5">
                            ₹{(item.originalPrice * item.quantity).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-[#F26522] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-[#F26522] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 font-semibold">
                <span className="flex items-center gap-1">
                  <TagIcon className="w-3.5 h-3.5" /> Coupon '{appliedCoupon.code}' Applied
                </span>
                <span>Active</span>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Total Savings</span>
                  <span>-₹{totalSavings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-bold text-green-700">FREE</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-base font-extrabold text-gray-900">
              <span>Grand Total:</span>
              <span className="text-[#F26522] text-xl">₹{grandTotal.toLocaleString()}</span>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="py-3 px-4 bg-white border-2 border-gray-300 text-gray-900 font-bold text-xs sm:text-sm rounded-xl text-center hover:bg-gray-100 transition-colors"
              >
                View Full Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="py-3 px-4 bg-[#F26522] text-white font-bold text-xs sm:text-sm rounded-xl text-center hover:bg-[#d85519] transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Checkout</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-gray-400" />
              <span>100% Safe & Secure Encrypted Checkout</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;