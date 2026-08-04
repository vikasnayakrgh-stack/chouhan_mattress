import type { Integration, IntegrationStatus } from '@/features/integrations/types'
import { mockIntegrations } from '@/data/admin/integrations.mock'

let integrations: Integration[] = mockIntegrations.map((i) => ({
  ...i,
  apiKeys: i.apiKeys.map((k) => ({ ...k })),
  webhooks: i.webhooks.map((w) => ({ ...w })),
  configFields: i.configFields.map((c) => ({ ...c })),
}))

export class MockIntegrationRepository {
  async getAll(): Promise<Integration[]> {
    return integrations.map((i) => ({ ...i }))
  }

  async getById(id: string): Promise<Integration | null> {
    const i = integrations.find((x) => x.id === id)
    return i ? { ...i } : null
  }

  async setStatus(id: string, status: IntegrationStatus): Promise<Integration | null> {
    const idx = integrations.findIndex((i) => i.id === id)
    if (idx === -1) return null
    const now = new Date().toISOString()
    integrations[idx] = {
      ...integrations[idx],
      status,
      connectedAt: status === 'connected' ? (integrations[idx].connectedAt ?? now) : integrations[idx].connectedAt,
      lastSyncAt: status === 'connected' ? now : integrations[idx].lastSyncAt,
    }
    return { ...integrations[idx] }
  }

  async rotateKey(integrationId: string, keyId: string): Promise<Integration | null> {
    const idx = integrations.findIndex((i) => i.id === integrationId)
    if (idx === -1) return null
    const suffix = Math.random().toString(36).slice(2, 6)
    integrations[idx] = {
      ...integrations[idx],
      apiKeys: integrations[idx].apiKeys.map((k) =>
        k.id === keyId ? { ...k, maskedKey: k.maskedKey.replace(/....$/, suffix), createdAt: new Date().toISOString() } : k
      ),
    }
    return { ...integrations[idx] }
  }
}

export const integrationRepository = new MockIntegrationRepository()
