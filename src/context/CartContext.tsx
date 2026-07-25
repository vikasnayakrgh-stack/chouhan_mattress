/**
 * Chouhan Mattress - Global Cart Context Provider
 * Manages cart state, localStorage persistence, coupons, taxes, and shipping calculation
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  size?: string;
  thickness?: string;
  variant?: string;
  category?: string;
  isCustomSize?: boolean;
  customDimensions?: { lengthInches: number; widthInches: number; thickness: number };
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 11 for 11% or 500 for ₹500
  minOrderAmount?: number;
  description: string;
}

const VALID_COUPONS: Record<string, Coupon> = {
  HOME: {
    code: 'HOME',
    discountType: 'percentage',
    discountValue: 11,
    description: 'Get extra 11% OFF on Home Sweet Home Sale!',
  },
  FIRST500: {
    code: 'FIRST500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 3000,
    description: 'Flat ₹500 OFF on orders above ₹3,000',
  },
  SLEEPWELL: {
    code: 'SLEEPWELL',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 10000,
    description: 'Get 15% OFF on luxury orders above ₹10,000',
  },
};

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  couponError: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  originalSubtotal: number;
  couponDiscount: number;
  totalSavings: number;
  shippingFee: number;
  gstAmount: number;
  grandTotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'chouhan_mattress_cart';
const COUPON_STORAGE_KEY = 'chouhan_mattress_coupon';

const MOCK_INITIAL_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    productId: '1',
    name: 'ShapeSense Orthopedic Essential Mattress',
    price: 6229,
    originalPrice: 12499,
    quantity: 1,
    image: 'https://ik.imagekit.io/2xkwa8s1i/consumer-react/category-thumb/mattress-recommendation_desk2.jpg?tr=w-400',
    size: 'King Size (72x78 in)',
    thickness: '8 Inch',
    category: 'mattresses',
  },
  {
    id: 'cart-2',
    productId: '8',
    name: 'Memory Foam Pillow (Pack of 2)',
    price: 1299,
    originalPrice: 2499,
    quantity: 1,
    image: 'https://ik.imagekit.io/2xkwa8s1i/img/memory-foam-pillows/memory-foam-pillows-1-new.jpg?tr=w-400',
    size: 'Standard',
    category: 'bedding',
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(MOCK_INITIAL_ITEMS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const freeShippingThreshold = 2000;

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon && VALID_COUPONS[savedCoupon]) {
        setAppliedCoupon(VALID_COUPONS[savedCoupon]);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, isMounted]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems((prevItems) => {
      // Check if item with same productId, size, and thickness exists
      const existingIdx = prevItems.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.size === newItem.size &&
          i.thickness === newItem.thickness
      );

      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += newItem.quantity || 1;
        return updated;
      }

      const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      return [...prevItems, { ...newItem, id }];
    });
    openDrawer();
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const applyCoupon = (code: string): boolean => {
    const formattedCode = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[formattedCode];

    if (!coupon) {
      setCouponError('Invalid coupon code. Try HOME, FIRST500, or SLEEPWELL');
      return false;
    }

    const currentSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    if (coupon.minOrderAmount && currentSubtotal < coupon.minOrderAmount) {
      setCouponError(`Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString()} required for ${formattedCode}`);
      return false;
    }

    setAppliedCoupon(coupon);
    setCouponError('');
    localStorage.setItem(COUPON_STORAGE_KEY, formattedCode);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  // Calculations
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const originalSubtotal = items.reduce(
    (sum, i) => sum + (i.originalPrice || i.price) * i.quantity,
    0
  );
  const catalogDiscount = originalSubtotal - subtotal;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      couponDiscount = Math.min(subtotal, appliedCoupon.discountValue);
    }
  }

  const totalSavings = catalogDiscount + couponDiscount;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 250;
  const gstAmount = Math.round((subtotal - couponDiscount) * 0.18);
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotal,
        originalSubtotal,
        couponDiscount,
        totalSavings,
        shippingFee,
        gstAmount,
        grandTotal,
        freeShippingThreshold,
        amountNeededForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
