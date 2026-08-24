import 'server-only'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyRazorpayWebhookSignature } from '@/lib/payments/razorpay'
import { verifyStripeWebhookSignature } from '@/lib/payments/stripe'
import { logSecurityEvent } from '@/lib/security-logger'
import { getClientIp } from '@/lib/rate-limit'
import { autoCreateShipmentForOrder } from '@/services/shippingService'

export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const rawBody = await request.text()

  const rzpSignature = request.headers.get('x-razorpay-signature')
  const stripeSignature = request.headers.get('stripe-signature')

  // 1. Webhook Signature Verification
  if (rzpSignature) {
    const isValid = verifyRazorpayWebhookSignature(rawBody, rzpSignature)
    if (!isValid) {
      logSecurityEvent({
        eventType: 'SUSPICIOUS_ACTIVITY',
        ipAddress: clientIp,
        resource: '/api/payments/webhook',
        action: 'POST',
        status: 'BLOCKED',
        details: { reason: 'Invalid Razorpay webhook signature' },
      })
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }
  } else if (stripeSignature) {
    const isValid = verifyStripeWebhookSignature(rawBody, stripeSignature)
    if (!isValid) {
      logSecurityEvent({
        eventType: 'SUSPICIOUS_ACTIVITY',
        ipAddress: clientIp,
        resource: '/api/payments/webhook',
        action: 'POST',
        status: 'BLOCKED',
        details: { reason: 'Invalid Stripe webhook signature' },
      })
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }
  }

  let eventPayload: any
  try {
    eventPayload = JSON.parse(rawBody)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const supabaseAdmin = createAdminClient()
  const eventName = eventPayload.event || eventPayload.type

  console.log(`[PAYMENT_WEBHOOK] Received event: ${eventName}`)

  // 2. Process Razorpay / Stripe Events
  if (eventName === 'payment.captured' || eventName === 'order.paid' || eventName === 'payment_intent.succeeded') {
    let orderIdOrNumber: string | null = null
    let paymentId: string | null = null

    if (eventName.startsWith('payment_intent')) {
      orderIdOrNumber = eventPayload.data?.object?.metadata?.orderNumber
      paymentId = eventPayload.data?.object?.id
    } else {
      const paymentEntity = eventPayload.payload?.payment?.entity
      const orderEntity = eventPayload.payload?.order?.entity
      orderIdOrNumber = orderEntity?.receipt || paymentEntity?.order_id || paymentEntity?.notes?.orderNumber
      paymentId = paymentEntity?.id
    }

    if (supabaseAdmin && orderIdOrNumber) {
      try {
        // Query order by order_number or razorpay_order_id
        const { data: order } = await supabaseAdmin
          .from('orders')
          .select('*')
          .or(`order_number.eq.${orderIdOrNumber},razorpay_order_id.eq.${orderIdOrNumber}`)
          .single()

        if (order) {
          // Idempotency: skip if already paid
          if (order.payment_status === 'paid') {
            return NextResponse.json({ received: true, message: 'Order already marked as paid' })
          }

          const existingTimeline = Array.isArray(order.timeline) ? order.timeline : []
          const updatedTimeline = [
            ...existingTimeline,
            {
              status: 'processing',
              title: 'Payment Confirmed',
              note: `Payment of ₹${order.total} successfully captured via Gateway (Payment ID: ${paymentId || 'Captured'}).`,
              timestamp: new Date().toISOString(),
            },
          ]

          await supabaseAdmin
            .from('orders')
            .update({
              payment_status: 'paid',
              status: 'processing',
              razorpay_payment_id: paymentId,
              timeline: updatedTimeline,
              updated_at: new Date().toISOString(),
            })
            .eq('id', order.id)

          // 3. Trigger Automated Shipment Creation
          try {
            await autoCreateShipmentForOrder(order.id)
          } catch (shipErr) {
            console.warn('[WEBHOOK_AUTO_SHIP_WARN]', shipErr)
          }
        }
      } catch (dbErr) {
        console.error('[WEBHOOK_DB_UPDATE_ERROR]', dbErr)
      }
    }
  } else if (eventName === 'payment.failed' || eventName === 'payment_intent.payment_failed') {
    const paymentEntity = eventPayload.payload?.payment?.entity
    const orderIdOrNumber = paymentEntity?.order_id || paymentEntity?.notes?.orderNumber
    const failureReason = paymentEntity?.error_description || 'Payment was declined or cancelled.'

    if (supabaseAdmin && orderIdOrNumber) {
      try {
        const { data: order } = await supabaseAdmin
          .from('orders')
          .select('*')
          .or(`order_number.eq.${orderIdOrNumber},razorpay_order_id.eq.${orderIdOrNumber}`)
          .single()

        if (order && order.payment_status !== 'paid') {
          const existingTimeline = Array.isArray(order.timeline) ? order.timeline : []
          await supabaseAdmin
            .from('orders')
            .update({
              payment_status: 'failed',
              timeline: [
                ...existingTimeline,
                {
                  status: 'payment_failed',
                  title: 'Payment Failed',
                  note: `Payment attempt failed: ${failureReason}`,
                  timestamp: new Date().toISOString(),
                },
              ],
              updated_at: new Date().toISOString(),
            })
            .eq('id', order.id)
        }
      } catch (dbErr) {
        console.error('[WEBHOOK_DB_FAIL_UPDATE_ERROR]', dbErr)
      }
    }
  }

  return NextResponse.json({ success: true, received: true })
}
