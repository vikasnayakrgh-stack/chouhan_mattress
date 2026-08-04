export type IntegrationType =
  | 'payments'
  | 'shipping'
  | 'messaging'
  | 'email'
  | 'sms'
  | 'analytics'
  | 'erp'
  | 'database'

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending'

export interface APIKey {
  id: string
  label: string
  maskedKey: string
  createdAt: string
  lastUsedAt?: string
}

export interface Webhook {
  id: string
  url: string
  events: string[]
  active: boolean
  lastDeliveryAt?: string
  lastDeliveryStatus?: 'success' | 'failed'
}

export interface Integration {
  id: string
  name: string
  provider: string
  type: IntegrationType
  status: IntegrationStatus
  description: string
  connectedAt?: string
  lastSyncAt?: string
  apiKeys: APIKey[]
  webhooks: Webhook[]
  configFields: { key: string; label: string; value: string; secret: boolean }[]
}
