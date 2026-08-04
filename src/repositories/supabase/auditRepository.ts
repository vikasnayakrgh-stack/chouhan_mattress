import type { IAuditRepository } from '@/repositories/types'
import type { AuditLog, AuditFilters } from '@/features/audit/types'
import { supabaseMappers } from './mappers'

export class SupabaseAuditRepository implements IAuditRepository {
  async getAll(filters: AuditFilters = {}): Promise<AuditLog[]> {
    const sb = supabaseMappers.getClient()
    let query = sb.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(500)

    if (filters.action && filters.action !== 'all') {
      query = query.eq('action', filters.action)
    }
    if (filters.entity && filters.entity !== 'all') {
      query = query.eq('entity_type', filters.entity)
    }
    if (filters.actorId && filters.actorId !== 'all') {
      query = query.eq('actor_id', filters.actorId)
    }
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom)
    }
    if (filters.dateTo) {
      query = query.lte('created_at', `${filters.dateTo}T23:59:59`)
    }

    const { data, error } = await query
    if (error) throw error

    let logs = (data ?? []).map((r) => this.mapRow(r as Record<string, unknown>))

    if (filters.search) {
      const q = filters.search.toLowerCase()
      logs = logs.filter(
        (l) =>
          l.description.toLowerCase().includes(q) ||
          l.entityLabel.toLowerCase().includes(q) ||
          l.actorName.toLowerCase().includes(q),
      )
    }

    return logs
  }

  private mapRow(row: Record<string, unknown>): AuditLog {
    return {
      id: String(row.id),
      action: String(row.action ?? '') as AuditLog['action'],
      entity: String(row.entity_type ?? '') as AuditLog['entity'],
      entityId: String(row.entity_id ?? ''),
      entityLabel: String(row.entity_label ?? ''),
      actorId: String(row.actor_id ?? ''),
      actorName: String(row.actor_name ?? ''),
      actorRole: String(row.actor_role ?? ''),
      description: String(row.description ?? ''),
      changes: (row.changes as AuditLog['changes']) ?? undefined,
      ipAddress: String(row.ip_address ?? ''),
      timestamp: String(row.created_at ?? new Date().toISOString()),
    }
  }
}
