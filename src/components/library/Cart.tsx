/**
 * Wakefit Clone - Cart Component
 * Reusable, accessible cart drawer and cart page component
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import type { CartProps, CartItem, CartSummary, BaseComponentProps } from '@/types';

export function Cart({
  className = '',
  items = [],
  summary,
  onRemoveItem = () => {},
  onUpdateQuantity = () => {},
  onCheckout = () => {},
  onContinueShopping = () => {},
  showCoupon = true,
  couponPlaceholder = 'Enter coupon code',
  onApplyCoupon = () => {},
  couponCode = '',
  couponError,
  loading = false,
  emptyMessage = 'Your cart is empty',
  emptyAction,
  'data-testid': testId,
}: CartProps & { couponCode?: string; couponError?: string; loading?: boolean; emptyMessage?: string; emptyAction?: React.ReactNode; couponPlaceholder?: string }) {
  return (
    <div
      className={cn('bg-white rounded-2xl border border-wakefit-gray/20 overflow-hidden', className)}
      data-testid={testId}
      role="region"
      aria-label="Shopping cart"
    >
      {/* Cart Header */}
      <div className="flex items-center justify-between p-6 border-b border-wakefit-gray/20">
        <h2 className="text-xl font-bold text-wakefit-dark">Shopping Cart</h2>
        <span className="text-sm text-wakefit-gray">
          {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-wakefit-gray/20">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <svg
              className="h-16 w-16 text-wakefit-gray/30 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-wakefit-dark mb-2">{emptyMessage}</h3>
            <p className="text-wakefit-gray/60 mb-6 max-w-xs">
              Looks like you haven't added any products to your cart yet.
            </p>
            {emptyAction || (
              <Button
                variant="primary"
                size="lg"
                onClick={onContinueShopping}
                data-testid={`${testId}-continue-shopping`}
              >
                Continue Shopping
              </Button>
            )}
            {emptyAction}
          </motion.div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {items.map((item, index) => (
              <CartItem
                key={item.id}
                item={item}
                index={index}
                onRemove={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
                data-testid={`${testId}-item-${index}`}
              />
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <>
          {/* Coupon Section */}
          {showCoupon && (
            <CouponSection
              placeholder={couponPlaceholder}
              couponCode={couponCode}
              onApplyCoupon={onApplyCoupon}
              couponError={couponError}
              loading={loading}
              data-testid={`${testId}-coupon`}
            />
          )}

          {/* Cart Summary */}
          <CartSummaryDisplay
            summary={summary}
            onCheckout={onCheckout}
            loading={loading}
            checkoutDisabled={loading || items.length === 0}
            checkoutText="Proceed to Checkout"
            data-testid={`${testId}-summary`}
          />
        </>
      )}
    </div>
  );
}

// Cart Item Sub-component
function CartItem({
  item,
  index,
  onRemove,
  onUpdateQuantity,
  'data-testid': testId,
}: {
  item: CartItem;
  index: number;
  onRemove: (itemId: string | number) => void;
  onUpdateQuantity: (itemId: string | number, quantity: number) => void;
  'data-testid'?: string;
}) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 200);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(item.maxQuantity || 99, item.quantity + delta));
    onUpdateQuantity(item.id, newQuantity);
  };

  const currentPrice = typeof item.price === 'number' ? item.price : (item.price?.current || 0);
  const origPrice = item.originalPrice || (typeof item.price === 'object' ? item.price?.original : undefined);
  const discountPercent = origPrice && origPrice > currentPrice
    ? Math.round(((origPrice - currentPrice) / origPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn('flex gap-4 p-4', removing && 'opacity-50')}
      data-testid={testId}
    >
      {/* Product Image */}
      <Link
        href={`/product/${item.slug}`}
        className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-wakefit-gray/50"
        aria-label={`View ${item.name}`}
      >
        <OptimizedImage
          src={item.image || item.primaryImage || item.images?.[0] || '/images/placeholder.jpg'}
          alt={item.alt || item.name}
          preset="thumbnail"
          placeholder="blur"
          className="w-full h-full object-cover"
          containerClassName="h-full"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link
            href={`/product/${item.slug}`}
            className="font-medium text-wakefit-dark hover:text-wakefit-orange transition-colors line-clamp-2 mb-1"
            onClick={(e) => e.stopPropagation()}
          >
            {item.name}
          </Link>

          {/* Attributes */}
          {item.attributes && Object.keys(item.attributes).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.entries(item.attributes).map(([key, value]) => (
                <span
                  key={key}
                  className="text-xs text-wakefit-gray/60 px-2 py-0.5 bg-wakefit-gray/10 rounded"
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          )}

          {/* Stock Status */}
          {!item.inStock && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Out of Stock
            </span>
          )}
        </div>

        {/* Price & Quantity */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-brand-dark">
              ₹{currentPrice.toLocaleString()}
            </span>
            {origPrice && origPrice > currentPrice && (
              <span className="text-sm text-brand-gray line-through">
                ₹{origPrice.toLocaleString()}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 1 || !item.inStock}
              aria-label={`Decrease quantity of ${item.name}`}
              className={cn(
                'p-1.5 rounded-lg border border-wakefit-gray/30 text-wakefit-gray hover:border-wakefit-orange hover:text-wakefit-orange',
                'transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-10 text-center font-medium text-wakefit-dark">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={item.quantity >= (item.maxQuantity || 99) || !item.inStock}
              aria-label={`Increase quantity of ${item.name}`}
              className={cn(
                'p-1.5 rounded-lg border border-wakefit-gray/30 text-wakefit-gray hover:border-wakefit-orange hover:text-wakefit-orange',
                'transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <motion.button
        onClick={handleRemove}
        disabled={removing}
        aria-label={`Remove ${item.name} from cart`}
        className="flex-shrink-0 p-2 text-wakefit-gray/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        data-testid={`${testId}-remove`}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>
    </motion.div>
  );
}

// Coupon Section
function CouponSection({
  placeholder,
  couponCode,
  onApplyCoupon,
  couponError,
  loading,
  'data-testid': testId,
}: {
  placeholder: string;
  couponCode: string;
  onApplyCoupon?: (code: string) => void;
  couponError?: string;
  loading: boolean;
  'data-testid'?: string;
}) {
  const [code, setCode] = useState(couponCode);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() && onApplyCoupon) {
      onApplyCoupon(code.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="border-t border-wakefit-gray/20 p-4"
      data-testid={testId}
    >
      <form onSubmit={handleApply} className="flex gap-2">
        <label htmlFor="coupon-code" className="sr-only">
          Coupon code
        </label>
        <input
          id="coupon-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className={cn(
            'flex-1 h-11 px-4 text-base border rounded-lg',
            'bg-white text-wakefit-dark placeholder:text-wakefit-gray/40',
            'focus:outline-none focus:ring-2 focus:ring-wakefit-orange/50 focus:border-transparent',
            couponError && 'border-red-500 focus:ring-red-500/50',
            loading && 'opacity-50'
          )}
          aria-describedby={couponError ? `${testId}-error` : undefined}
          data-testid={`${testId}-input`}
        />
        <Button
          type="submit"
          variant="outline"
          size="md"
          disabled={loading || !code.trim()}
          isLoading={loading}
          data-testid={`${testId}-apply`}
        >
          Apply
        </Button>
      </form>
      {couponError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id={`${testId}-error`}
          className="mt-2 text-sm text-red-500 flex items-center gap-1"
          role="alert"
          data-testid={`${testId}-error`}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {couponError}
        </motion.p>
      )}
    </motion.div>
  );
}

// Cart Summary Display
function CartSummaryDisplay({
  summary,
  onCheckout,
  loading,
  checkoutDisabled,
  checkoutText,
  'data-testid': testId,
}: {
  summary: CartSummary;
  onCheckout: () => void;
  loading: boolean;
  checkoutDisabled: boolean;
  checkoutText: string;
  'data-testid'?: string;
}) {
  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-wakefit-gray/20 p-6 bg-wakefit-gray/30"
      data-testid={testId}
    >
      <div className="space-y-3">
        <div className="flex justify-between text-wakefit-dark">
          <span>Subtotal ({summary.itemCount} items)</span>
          <span className="font-medium">{formatPrice(summary.subtotal)}</span>
        </div>

        {summary.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">-{formatPrice(summary.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-wakefit-dark">
          <span>Tax (GST)</span>
          <span className="font-medium">{formatPrice(summary.tax)}</span>
        </div>

        <div className="flex justify-between text-wakefit-dark">
          <span>Shipping</span>
          <span className="font-medium">
            {summary.shipping === 0 ? 'Free' : formatPrice(summary.shipping)}
          </span>
        </div>

        <div className="border-t border-wakefit-gray/30 pt-3 flex justify-between text-lg font-bold text-wakefit-dark">
          <span>Total</span>
          <span>{formatPrice(summary.total)}</span>
        </div>
      </div>

      {/* Savings Message */}
      {summary.discount > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center gap-2"
        >
          <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          You saved {formatPrice(summary.discount)} on this order!
        </motion.p>
      )}

      <Button
        variant="primary"
        size="xl"
        fullWidth
        onClick={onCheckout}
        disabled={checkoutDisabled}
        isLoading={loading}
        className="mt-6"
        data-testid={`${testId}-checkout`}
      >
        {checkoutText}
      </Button>

      <p className="mt-4 text-center text-sm text-wakefit-gray/60">
        Secure checkout • 100% Safe & Secure
      </p>
    </motion.div>
  );
}

// Cart Drawer Component
export interface CartDrawerProps extends CartProps, BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'right' | 'left';
  showOverlay?: boolean;
  children?: React.ReactNode;
}

export function CartDrawer({
  className = '',
  isOpen,
  onClose,
  position = 'right',
  showOverlay = true,
  children,
  ...cartProps
}: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab') {
        const focusableElements = drawerRef.current?.querySelectorAll<
          HTMLElement
        >(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    setTimeout(() => {
      const firstFocusable = drawerRef.current?.querySelector<
        HTMLElement
      >('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      firstFocusable?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Overlay */}
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <motion.aside
        ref={drawerRef}
        initial={{ x: position === 'right' ? '100%' : '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: position === 'right' ? '100%' : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          'fixed top-0 bottom-0 z-50 w-full max-w-md md:max-w-lg lg:max-w-xl',
          'bg-white shadow-2xl flex flex-col',
          position === 'right' ? 'right-0' : 'left-0'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        data-testid={`${cartProps['data-testid']}-drawer`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-wakefit-gray/20">
            <h2 className="text-lg font-bold text-wakefit-dark">Shopping Cart</h2>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 rounded-lg text-wakefit-gray/50 hover:text-wakefit-dark hover:bg-wakefit-gray/10 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <Cart {...cartProps} />
          </div>

          {/* Continue Shopping Footer */}
          <div className="p-4 border-t border-wakefit-gray/20">
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
              data-testid={`${cartProps['data-testid']}-continue-shopping`}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

export default Cart;