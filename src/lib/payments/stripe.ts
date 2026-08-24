import 'server-only'
import crypto from 'crypto'

export interface CreateStripePaymentIntentParams {
  amountInRupees: number
  currency?: string
  orderNumber: string
  customerEmail?: string
  metadata?: Record<string, string>
}

export interface StripePaymentIntentResponse {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

/**
 * Creates an authoritative Stripe PaymentIntent via Stripe REST API
 */
export async function createStripePaymentIntent(
  params: CreateStripePaymentIntentParams
): Promise<StripePaymentIntentResponse> {
  const amountInCents = Math.round(params.amountInRupees * 100)
  const currency = (params.currency || 'inr').toLowerCase()

  if (!stripeSecretKey) {
    console.warn('[STRIPE] Missing STRIPE_SECRET_KEY. Generating sandbox test intent.')
    const testId = `pi_sandbox_${crypto.randomBytes(8).toString('hex')}`
    return {
      id: testId,
      client_secret: `${testId}_secret_${crypto.randomBytes(12).toString('hex')}`,
      amount: amountInCents,
      currency,
      status: 'requires_payment_method',
    }
  }

  const formData = new URLSearchParams()
  formData.append('amount', amountInCents.toString())
  formData.append('currency', currency)
  formData.append('metadata[orderNumber]', params.orderNumber)
  if (params.customerEmail) {
    formData.append('receipt_email', params.customerEmail)
  }

  const response = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${stripeSecretKey}`,
    },
    body: formData.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Stripe API error (${response.status}): ${errorText}`)
  }

  return (await response.json()) as StripePaymentIntentResponse
}

/**
 * Verifies Stripe Webhook signature
 */
export function verifyStripeWebhookSignature(
  payload: string,
  signatureHeader: string
): boolean {
  if (!stripeWebhookSecret) return true

  try {
    const parts = signatureHeader.split(',')
    const timestampPart = parts.find((p) => p.startsWith('t='))
    const sigPart = parts.find((p) => p.startsWith('v1='))

    if (!timestampPart || !sigPart) return false

    const timestamp = timestampPart.split('=')[1]
    const signature = sigPart.split('=')[1]

    const signedPayload = `${timestamp}.${payload}`
    const expectedSignature = crypto
      .createHmac('sha256', stripeWebhookSecret)
      .update(signedPayload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    )
  } catch (err) {
    console.error('[STRIPE_WEBHOOK] Signature check error:', err)
    return false
  }
}
