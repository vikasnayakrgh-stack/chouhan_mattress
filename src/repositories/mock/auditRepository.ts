import type { AuditLog } from '@/features/audit/types'
import { mockAuditLogs } from '@/data/admin/audit.mock'

const logs: AuditLog[] = mockAuditLogs.map((l) => ({ ...l }))

export class MockAuditRepository {
  async getAll(): Promise<AuditLog[]> {
    return logs.map((l) => ({ ...l })).sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  }
}

export const auditRepository = new MockAuditRepository()
