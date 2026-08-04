export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'archive'
  | 'status_change'
  | 'price_change'
  | 'login'
  | 'invite'
  | 'export'
  | 'settings_change'

export type AuditEntity =
  | 'product'
  | 'order'
  | 'customer'
  | 'category'
  | 'collection'
  | 'inventory'
  | 'discount'
  | 'review'
  | 'content'
  | 'staff'
  | 'settings'
  | 'integration'

export interface AuditLog {
  id: string
  action: AuditAction
  entity: AuditEntity
  entityId: string
  entityLabel: string
  actorId: string
  actorName: string
  actorRole: string
  description: string
  changes?: { field: string; from: string; to: string }[]
  ipAddress: string
  timestamp: string
}

export interface AuditFilters {
  search?: string
  action?: AuditAction | 'all'
  entity?: AuditEntity | 'all'
  actorId?: string | 'all'
  dateFrom?: string
  dateTo?: string
}
