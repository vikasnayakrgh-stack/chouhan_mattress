import { z } from 'zod';

// Auth validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number').optional(),
  marketingOptIn: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
  type: z.enum(['signup', 'email_change']),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

// Cart validation
export const cartItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  variantId: z.string().uuid('Invalid variant ID').optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity cannot exceed 99'),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().uuid('Invalid item ID'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative').max(99, 'Quantity cannot exceed 99'),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(20, 'Invalid coupon code'),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;

// Address validation
export const addressSchema = z.object({
  type: z.enum(['shipping', 'billing', 'both']),
  label: z.string().min(1, 'Label is required').max(50, 'Label too long').optional(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Name too long'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  line1: z.string().min(5, 'Address line 1 is required').max(200, 'Address too long'),
  line2: z.string().max(200, 'Address too long').optional(),
  city: z.string().min(2, 'City is required').max(100, 'City name too long'),
  state: z.string().min(2, 'State is required').max(100, 'State name too long'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid PIN code (must be 6 digits)'),
  country: z.string().default('India'),
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

// Checkout validation
export const checkoutAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid PIN code'),
  houseNo: z.string().min(1, 'House/Building name is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  addressType: z.enum(['Home', 'Work']),
});

export const shippingMethodSchema = z.object({
  method: z.enum(['standard', 'express']),
});

export const paymentMethodSchema = z.object({
  method: z.enum(['upi', 'card', 'netbanking', 'emi', 'cod']),
  upiApp: z.enum(['gpay', 'phonepe', 'paytm', 'bhim']).optional(),
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Invalid UPI ID').optional(),
});

export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;
export type ShippingMethodInput = z.infer<typeof shippingMethodSchema>;
export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>;

// Order creation
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid('Invalid product ID'),
    variantId: z.string().uuid('Invalid variant ID').optional(),
    quantity: z.number().int().min(1),
  })).min(1, 'At least one item is required'),
  shippingAddress: checkoutAddressSchema,
  shippingMethod: shippingMethodSchema,
  paymentMethod: paymentMethodSchema,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;