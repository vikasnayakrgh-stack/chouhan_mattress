import { getRepositories } from '@/repositories'
import type { AuditLog, AuditFilters } from '@/features/audit/types'

export const auditService = {
  async getAll(filters: AuditFilters = {}): Promise<AuditLog[]> {
    return getRepositories().audit.getAll(filters)
  },

  toCSV(logs: AuditLog[]): string {
    const header = ['Timestamp', 'Actor', 'Role', 'Action', 'Entity', 'Entity Label', 'Description', 'IP Address']
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
    const rows = logs.map((l) =>
      [l.timestamp, l.actorName, l.actorRole, l.action, l.entity, l.entityLabel, l.description, l.ipAddress]
        .map(escape)
        .join(',')
    )
    return [header.map(escape).join(','), ...rows].join('\n')
  },
}
