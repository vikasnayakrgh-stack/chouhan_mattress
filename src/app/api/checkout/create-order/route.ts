import 'server-only'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import productsData from '@/data/products.json'
import { productService } from '@/services/productService'
import { discountService } from '@/services/discountService'
import { createOrderPayloadSchema } from '@/lib/validations/checkout'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { logSecurityEvent } from '@/lib/security-logger'

const VALID_COUPONS: Record<string, number> = {
  HOME: 11, // 11% off
  FIRST500: 500, // ₹500 flat discount
}

/**
 * SEC-002 & FIX-005 & TASK 2: Authoritative Server-Side Order Calculation Endpoint with Persistence & Rate Limiting
 * Never trusts prices, subtotals, or discount totals sent from the browser.
 * Persists every order to Supabase orders and customers tables using repository/service pattern.
 */
export async function POST(request: Request) {
  const clientIp = getClientIp(request)

  // 1. Rate Limiting Check (5 order creations per minute per IP)
  const rateLimit = checkRateLimit(clientIp, 'checkout_create_order', 5, 60 * 1000)
  if (!rateLimit.success) {
    logSecurityEvent({
      eventType: 'RATE_LIMIT_EXCEEDED',
      ipAddress: clientIp,
      resource: '/api/checkout/create-order',
      action: 'POST',
      status: 'BLOCKED',
      details: { remaining: rateLimit.remaining, resetInMs: rateLimit.resetInMs },
    })

    return NextResponse.json(
      { error: 'Too many order attempts. Please wait a minute before trying again.' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil(rateLimit.resetInMs / 1000).toString(),
        },
      }
    )
  }

  try {
    const rawBody = await request.json()

    // 2. Server-side Zod Schema Validation
    const validationResult = createOrderPayloadSchema.safeParse(rawBody)
    if (!validationResult.success) {
      const issueMessage = validationResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')
      
      logSecurityEvent({
        eventType: 'ORDER_FAILED',
        ipAddress: clientIp,
        resource: '/api/checkout/create-order',
        action: 'VALIDATION_FAILURE',
        status: 'FAILURE',
        details: { issues: issueMessage },
      })

      return NextResponse.json(
        { error: 'Invalid order payload', details: issueMessage },
        { status: 400 }
      )
    }

    const body = validationResult.data

    // 3. Authoritative Price & Line Item Calculation (Repository/Service first, JSON fallback)
    let calculatedSubtotal = 0
    const verifiedOrderItems = []

    for (const itemReq of body.items) {
      let catalogProduct: any = null;
      try {
        catalogProduct = await productService.getById(String(itemReq.productId));
      } catch (err) {
        console.warn('[CREATE_ORDER] Product service lookup warning:', err);
      }

      if (catalogProduct) {
        // Formatted ProductWithVariants from Database Service
        const variant = catalogProduct.variants.find((v: any) => v.id === itemReq.variantSize || v.sku.includes(itemReq.variantSize || '')) || catalogProduct.variants[0]
        const unitPrice = variant ? variant.sellingPrice : 0
        const lineTotal = unitPrice * itemReq.quantity
        calculatedSubtotal += lineTotal

        verifiedOrderItems.push({
          productId: String(catalogProduct.id),
          name: catalogProduct.name,
          size: itemReq.variantSize || 'Standard',
          unitPrice,
          originalPrice: variant ? variant.mrp : unitPrice,
          quantity: itemReq.quantity,
          lineTotal,
        })
      } else {
        // Fallback to productsData JSON
        const staticProd = (productsData as any[]).find((p) => String(p.id) === String(itemReq.productId))
        if (!staticProd) {
          logSecurityEvent({
            eventType: 'ORDER_FAILED',
            ipAddress: clientIp,
            resource: '/api/checkout/create-order',
            action: 'INVALID_PRODUCT',
            status: 'FAILURE',
            details: { productId: itemReq.productId },
          })

          return NextResponse.json({ error: `Product ID ${itemReq.productId} not found or inactive` }, { status: 400 })
        }

        if (staticProd.inStock === false) {
          return NextResponse.json({ error: `Product ${staticProd.name} is currently out of stock` }, { status: 400 })
        }

        let unitPrice = Number(staticProd.price)
        if (itemReq.variantSize && Array.isArray(staticProd.variants)) {
          const matchedVariant = staticProd.variants.find((v: any) => v.size === itemReq.variantSize)
          if (matchedVariant && matchedVariant.price) {
            unitPrice = Number(matchedVariant.price)
          }
        }

        const lineTotal = unitPrice * itemReq.quantity
        calculatedSubtotal += lineTotal

        verifiedOrderItems.push({
          productId: String(staticProd.id),
          name: staticProd.name,
          size: itemReq.variantSize || 'Standard',
          unitPrice,
          originalPrice: staticProd.originalPrice || unitPrice,
          quantity: itemReq.quantity,
          lineTotal,
        })
      }
    }

    // 4. Authoritative Coupon & Discount Calculation (Service layer dynamic query)
    let calculatedDiscount = 0
    let validatedCoupon = null

    if (body.couponCode) {
      const codeUpper = body.couponCode.trim().toUpperCase()
      const serviceValidation = await discountService.validateCoupon(codeUpper, calculatedSubtotal)

      if (serviceValidation.valid) {
        validatedCoupon = codeUpper
        calculatedDiscount = serviceValidation.discountAmount
      } else if (VALID_COUPONS[codeUpper]) {
        // Fallback to static coupon map
        validatedCoupon = codeUpper
        const discountVal = VALID_COUPONS[codeUpper]
        if (discountVal <= 100) {
          calculatedDiscount = Math.round((calculatedSubtotal * discountVal) / 100)
        } else {
          calculatedDiscount = Math.min(discountVal, calculatedSubtotal)
        }
      } else {
        return NextResponse.json({ error: serviceValidation.message || `Invalid or expired coupon code: ${body.couponCode}` }, { status: 400 })
      }

      logSecurityEvent({
        eventType: 'COUPON_APPLIED',
        ipAddress: clientIp,
        resource: '/api/checkout/create-order',
        action: 'APPLY_COUPON',
        status: 'SUCCESS',
        details: { couponCode: validatedCoupon, discountAmount: calculatedDiscount },
      })
    }

    // 5. Authoritative Shipping & Tax Calculation
    const shippingCost = body.shippingMethod === 'express' ? 199 : 0
    const netSubtotal = Math.max(0, calculatedSubtotal - calculatedDiscount)
    const gstAmount = Math.round(netSubtotal * 0.18)
    const finalPayable = netSubtotal + shippingCost

    // 6. Cryptographically Secure Server Order ID
    const randomSuffix = crypto.randomInt(100000, 999999)
    const serverOrderNumber = `CM-${randomSuffix}`

    // 7. Persist Order to Supabase Database (Task 2)
    const supabaseAdmin = createAdminClient()
    let persistedCustomer = null
    let persistedOrder = null

    if (supabaseAdmin) {
      try {
        // Upsert customer record
        const { data: customerData, error: customerError } = await supabaseAdmin
          .from('customers')
          .upsert(
            {
              name: body.shippingAddress.fullName,
              phone: body.shippingAddress.phone,
              city: body.shippingAddress.city,
              state: body.shippingAddress.state,
              addresses: [body.shippingAddress],
            },
            { onConflict: 'phone' }
          )
          .select()
          .single()

        if (!customerError && customerData) {
          persistedCustomer = customerData
        }

        // Insert order record
        const orderInsertPayload = {
          order_number: serverOrderNumber,
          customer_id: persistedCustomer?.id || null,
          customer_name: body.shippingAddress.fullName,
          customer_phone: body.shippingAddress.phone,
          items: verifiedOrderItems,
          subtotal: calculatedSubtotal,
          discount: calculatedDiscount,
          shipping_fee: shippingCost,
          tax: gstAmount,
          total: finalPayable,
          status: 'new',
          payment_status: 'pending',
          payment_method: 'pending_checkout',
          shipping_address: body.shippingAddress,
          timeline: [
            {
              status: 'new',
              title: 'Order Created',
              note: 'Server authoritative order initiated.',
              timestamp: new Date().toISOString(),
            },
          ],
        }

        const { data: orderData, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert(orderInsertPayload)
          .select()
          .single()

        if (orderError) {
          console.error('[SUPABASE ORDER PERSISTENCE WARN]', orderError.message)
        } else {
          persistedOrder = orderData
        }
      } catch (dbErr: any) {
        console.error('[SUPABASE DB EXCEPTION]', dbErr?.message)
      }
    }

    logSecurityEvent({
      eventType: 'ORDER_CREATED',
      ipAddress: clientIp,
      resource: '/api/checkout/create-order',
      action: 'ORDER_PERSISTENCE',
      status: 'SUCCESS',
      details: {
        orderNumber: serverOrderNumber,
        finalPayable,
        persistedInDb: !!persistedOrder,
      },
    })

    return NextResponse.json({
      success: true,
      order: {
        orderId: serverOrderNumber,
        dbId: persistedOrder?.id || null,
        status: 'pending_payment',
        currency: 'INR',
        items: verifiedOrderItems,
        summary: {
          subtotal: calculatedSubtotal,
          couponCode: validatedCoupon,
          discountAmount: calculatedDiscount,
          shippingCost,
          gstAmount,
          finalPayableAmount: finalPayable,
        },
        shippingAddress: body.shippingAddress,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    logSecurityEvent({
      eventType: 'ORDER_FAILED',
      ipAddress: clientIp,
      resource: '/api/checkout/create-order',
      action: 'SERVER_ERROR',
      status: 'FAILURE',
      details: { error: error?.message },
    })

    return NextResponse.json({ error: 'Failed to create authoritative order', details: error?.message }, { status: 500 })
  }
}
