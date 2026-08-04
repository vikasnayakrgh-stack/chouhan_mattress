import type { IIntegrationRepository } from '@/repositories/types'
import type { Integration, IntegrationStatus } from '@/features/integrations/types'

const STATIC_INTEGRATIONS: Integration[] = [
  {
    id: 'int-payment',
    name: 'Payment Gateway',
    provider: 'none',
    type: 'payments',
    status: 'disconnected',
    description: 'Payment provider placeholder — Razorpay/Stripe will be plugged in during the next phase.',
    apiKeys: [],
    webhooks: [],
    configFields: [
      { key: 'api_key', label: 'API Key', value: '', secret: true },
      { key: 'webhook_secret', label: 'Webhook Secret', value: '', secret: true },
    ],
  },
  {
    id: 'int-shipping',
    name: 'Shipping Provider',
    provider: 'none',
    type: 'shipping',
    status: 'disconnected',
    description: 'Shipping provider placeholder — Shiprocket/Delhivery integration in next phase.',
    apiKeys: [],
    webhooks: [],
    configFields: [{ key: 'api_token', label: 'API Token', value: '', secret: true }],
  },
  {
    id: 'int-email',
    name: 'Email Service',
    provider: 'smtp',
    type: 'email',
    status: 'disconnected',
    description: 'Email sending service for order confirmations and notifications.',
    apiKeys: [],
    webhooks: [],
    configFields: [
      { key: 'smtp_host', label: 'SMTP Host', value: '', secret: false },
      { key: 'smtp_port', label: 'SMTP Port', value: '587', secret: false },
    ],
  },
  {
    id: 'int-whatsapp',
    name: 'WhatsApp Business',
    provider: 'gupshup',
    type: 'messaging',
    status: 'disconnected',
    description: 'WhatsApp Business API for customer notifications.',
    apiKeys: [],
    webhooks: [],
    configFields: [{ key: 'api_key', label: 'API Key', value: '', secret: true }],
  },
]

export class SupabaseIntegrationRepository implements IIntegrationRepository {
  async getAll(): Promise<Integration[]> {
    return STATIC_INTEGRATIONS
  }

  async getById(id: string): Promise<Integration | null> {
    return STATIC_INTEGRATIONS.find((i) => i.id === id) ?? null
  }

  async setStatus(id: string, status: IntegrationStatus): Promise<Integration | null> {
    const integration = STATIC_INTEGRATIONS.find((i) => i.id === id)
    if (!integration) return null
    integration.status = status
    if (status === 'connected') integration.connectedAt = new Date().toISOString()
    return integration
  }

  async rotateKey(integrationId: string, keyId: string): Promise<Integration | null> {
    return this.getById(integrationId)
  }
}
