import 'server-only'
import crypto from 'crypto'

export interface CreateRazorpayOrderParams {
  amountInRupees: number
  receipt: string
  notes?: Record<string, string>
}

export interface RazorpayOrderResponse {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: 'created' | 'attempted' | 'paid'
  attempts: number
  notes: Record<string, string>
  created_at: number
}

const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
const keySecret = process.env.RAZORPAY_KEY_SECRET || ''
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ''

/**
 * Creates an authoritative Razorpay order via Razorpay REST API
 */
export async function createRazorpayOrder(
  params: CreateRazorpayOrderParams
): Promise<RazorpayOrderResponse> {
  const amountInPaise = Math.round(params.amountInRupees * 100)

  // If Razorpay keys are not configured or running in mock sandbox mode
  if (!keyId || !keySecret) {
    console.warn('[RAZORPAY] Missing API credentials in environment. Generating sandbox test order.')
    return {
      id: `order_sandbox_${crypto.randomBytes(8).toString('hex')}`,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: 'INR',
      receipt: params.receipt,
      status: 'created',
      attempts: 0,
      notes: params.notes || {},
      created_at: Math.floor(Date.now() / 1000),
    }
  }

  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: params.receipt,
      notes: params.notes || {},
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Razorpay Order API failed with status ${response.status}: ${errorBody}`)
  }

  const orderData = (await response.json()) as RazorpayOrderResponse
  return orderData
}

/**
 * Verifies Razorpay payment signature post-checkout
 */
export function verifyRazorpayPaymentSignature(params: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}): boolean {
  if (!keySecret) {
    // Sandbox test verification
    return params.razorpaySignature.startsWith('sandbox_sig_') || params.razorpayOrderId.startsWith('order_sandbox_')
  }

  const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf-8'),
    Buffer.from(params.razorpaySignature, 'utf-8')
  )
}

/**
 * Verifies webhook payload signature from Razorpay
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  const secret = webhookSecret || keySecret
  if (!secret) {
    return true // Allowed in dev/sandbox when no webhook secret configured
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(signatureHeader, 'utf-8')
    )
  } catch (err) {
    console.error('[RAZORPAY_WEBHOOK] Signature verification exception:', err)
    return false
  }
}
