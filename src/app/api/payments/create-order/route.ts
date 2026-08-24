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
import { createRazorpayOrder } from '@/lib/payments/razorpay'
import { createStripePaymentIntent } from '@/lib/payments/stripe'

const VALID_COUPONS: Record<string, number> = {
  HOME: 11, // 11% off
  FIRST500: 500, // ₹500 flat discount
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request)

  // 1. Rate Limiting Check (5 order creations per minute per IP)
  const rateLimit = checkRateLimit(clientIp, 'payments_create_order', 5, 60 * 1000)
  if (!rateLimit.success) {
    logSecurityEvent({
      eventType: 'RATE_LIMIT_EXCEEDED',
      ipAddress: clientIp,
      resource: '/api/payments/create-order',
      action: 'POST',
      status: 'BLOCKED',
      details: { remaining: rateLimit.remaining, resetInMs: rateLimit.resetInMs },
    })

    return NextResponse.json(
      { error: 'Too many payment order attempts. Please wait a minute before trying again.' },
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
    const { gateway = 'razorpay', ...orderPayload } = rawBody

    // 2. Server-side Zod Schema Validation
    const validationResult = createOrderPayloadSchema.safeParse(orderPayload)
    if (!validationResult.success) {
      const issueMessage = validationResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')
      return NextResponse.json(
        { error: 'Invalid order payload', details: issueMessage },
        { status: 400 }
      )
    }

    const body = validationResult.data

    // 3. Authoritative Server-Side Price & Line Item Calculation
    let calculatedSubtotal = 0
    const verifiedOrderItems = []

    for (const itemReq of body.items) {
      let catalogProduct: any = null
      try {
        catalogProduct = await productService.getById(String(itemReq.productId))
      } catch (err) {
        console.warn('[CREATE_PAYMENT_ORDER] Lookup warning:', err)
      }

      if (catalogProduct) {
        const variant =
          catalogProduct.variants.find(
            (v: any) => v.id === itemReq.variantSize || v.sku.includes(itemReq.variantSize || '')
          ) || catalogProduct.variants[0]

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
        const staticProd = (productsData as any[]).find((p) => String(p.id) === String(itemReq.productId))
        if (!staticProd) {
          return NextResponse.json({ error: `Product ID ${itemReq.productId} not found or inactive` }, { status: 400 })
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

    // 4. Authoritative Coupon & Discount Calculation
    let calculatedDiscount = 0
    let validatedCoupon = null

    if (body.couponCode) {
      const codeUpper = body.couponCode.trim().toUpperCase()
      const serviceValidation = await discountService.validateCoupon(codeUpper, calculatedSubtotal)

      if (serviceValidation.valid) {
        validatedCoupon = codeUpper
        calculatedDiscount = serviceValidation.discountAmount
      } else if (VALID_COUPONS[codeUpper]) {
        validatedCoupon = codeUpper
        const discountVal = VALID_COUPONS[codeUpper]
        if (discountVal <= 100) {
          calculatedDiscount = Math.round((calculatedSubtotal * discountVal) / 100)
        } else {
          calculatedDiscount = Math.min(discountVal, calculatedSubtotal)
        }
      } else {
        return NextResponse.json({ error: `Invalid or expired coupon code: ${body.couponCode}` }, { status: 400 })
      }
    }

    // 5. Shipping & Tax Calculation
    const shippingCost = body.shippingMethod === 'express' ? 199 : 0
    const netSubtotal = Math.max(0, calculatedSubtotal - calculatedDiscount)
    const gstAmount = Math.round(netSubtotal * 0.18)
    const finalPayable = netSubtotal + shippingCost

    // 6. Cryptographically Secure Server Order Number
    const randomSuffix = crypto.randomInt(100000, 999999)
    const serverOrderNumber = `CM-${randomSuffix}`

    // 7. Initialize Gateway Order
    let razorpayOrderId: string | null = null
    let stripeClientSecret: string | null = null

    if (gateway === 'stripe') {
      const stripeIntent = await createStripePaymentIntent({
        amountInRupees: finalPayable,
        orderNumber: serverOrderNumber,
        customerEmail: body.shippingAddress.fullName,
      })
      stripeClientSecret = stripeIntent.client_secret
    } else {
      const rzpOrder = await createRazorpayOrder({
        amountInRupees: finalPayable,
        receipt: serverOrderNumber,
        notes: {
          customerName: body.shippingAddress.fullName,
          phone: body.shippingAddress.phone,
          pincode: body.shippingAddress.pincode,
        },
      })
      razorpayOrderId = rzpOrder.id
    }

    // 8. Persist Order in Supabase Database
    const supabaseAdmin = createAdminClient()
    let persistedOrder = null

    if (supabaseAdmin) {
      try {
        const orderInsertPayload = {
          order_number: serverOrderNumber,
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
          payment_method: gateway,
          razorpay_order_id: razorpayOrderId,
          shipping_address: body.shippingAddress,
          timeline: [
            {
              status: 'new',
              title: 'Order Initiated',
              note: `Server order generated for payment via ${gateway.toUpperCase()} (ID: ${razorpayOrderId || serverOrderNumber}).`,
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
          console.warn('[SUPABASE_ORDER_INSERT_WARN]', orderError.message)
        } else {
          persistedOrder = orderData
        }
      } catch (dbErr: any) {
        console.error('[SUPABASE_DB_EXCEPTION]', dbErr?.message)
      }
    }

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_sandbox'

    return NextResponse.json({
      success: true,
      order: {
        orderId: serverOrderNumber,
        dbId: persistedOrder?.id || null,
        status: 'pending_payment',
        currency: 'INR',
        amount: finalPayable,
        razorpayOrderId,
        razorpayKeyId,
        stripeClientSecret,
        summary: {
          subtotal: calculatedSubtotal,
          discountAmount: calculatedDiscount,
          shippingCost,
          gstAmount,
          finalPayableAmount: finalPayable,
        },
      },
    })
  } catch (error: any) {
    console.error('[CREATE_PAYMENT_ORDER_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to create payment order', details: error?.message },
      { status: 500 }
    )
  }
}
