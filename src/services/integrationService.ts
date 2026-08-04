import { getRepositories } from '@/repositories'
import type { Integration } from '@/features/integrations/types'

export const integrationService = {
  async getAll(): Promise<Integration[]> {
    return getRepositories().integrations.getAll()
  },

  async getById(id: string): Promise<Integration | null> {
    return getRepositories().integrations.getById(id)
  },

  async connect(id: string): Promise<Integration | null> {
    return getRepositories().integrations.setStatus(id, 'connected')
  },

  async disconnect(id: string): Promise<Integration | null> {
    return getRepositories().integrations.setStatus(id, 'disconnected')
  },

  async testConnection(id: string): Promise<{ ok: boolean; message: string }> {
    const integration = await getRepositories().integrations.getById(id)
    if (!integration) return { ok: false, message: 'Integration not found' }
    if (integration.status === 'error') {
      return { ok: false, message: `${integration.name}: authentication failed. Check credentials.` }
    }
    if (integration.status === 'disconnected') {
      return { ok: false, message: `${integration.name} is not connected.` }
    }
    return { ok: true, message: `${integration.name} connection healthy.` }
  },

  async rotateKey(integrationId: string, keyId: string): Promise<Integration | null> {
    return getRepositories().integrations.rotateKey(integrationId, keyId)
  },
}
