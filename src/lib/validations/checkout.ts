import { z } from 'zod'

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantSize: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Quantity limit per line item is 10'),
})

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, 'Invalid phone number format'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid 6-digit Indian pincode'),
  houseNo: z.string().min(1, 'House/Flat number is required').max(200),
  street: z.string().min(2, 'Street address is required').max(200),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  addressType: z.enum(['home', 'work', 'other']).optional(),
})

export const createOrderPayloadSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item').max(20, 'Order exceeds maximum items per transaction'),
  shippingAddress: shippingAddressSchema,
  couponCode: z.string().trim().max(30).optional(),
  shippingMethod: z.enum(['standard', 'express']).optional(),
})

export type CreateOrderPayload = z.infer<typeof createOrderPayloadSchema>
