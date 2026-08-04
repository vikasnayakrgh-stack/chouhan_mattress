import type { IStaffRepository } from '@/repositories/types'
import type { AdminUser, AdminRole, Invitation, RolePermissions, StaffActivityEntry, StaffStatus } from '@/features/staff/types'
import { supabaseMappers } from './mappers'

const ROLE_PERMISSIONS: { role: AdminRole; label: string; description: string; permissions: string[] }[] = [
  { role: 'super_admin', label: 'Super Admin', description: 'Full access to everything', permissions: ['*'] },
  { role: 'catalog_manager', label: 'Catalog Manager', description: 'Manage products, categories, collections', permissions: ['products.read', 'products.write', 'categories.read', 'categories.write'] },
  { role: 'order_manager', label: 'Order Manager', description: 'Manage orders and returns', permissions: ['orders.read', 'orders.write', 'returns.read', 'returns.write'] },
  { role: 'inventory_manager', label: 'Inventory Manager', description: 'Manage stock levels', permissions: ['inventory.read', 'inventory.write'] },
  { role: 'marketing_manager', label: 'Marketing Manager', description: 'Manage CMS, reviews, discounts', permissions: ['cms.read', 'cms.write', 'reviews.read', 'reviews.write', 'discounts.read', 'discounts.write'] },
  { role: 'support_agent', label: 'Support Agent', description: 'Handle customer queries', permissions: ['customers.read', 'orders.read'] },
  { role: 'finance', label: 'Finance', description: 'Financial reports and refunds', permissions: ['orders.read', 'analytics.read'] },
  { role: 'developer', label: 'Developer', description: 'Technical configuration', permissions: ['settings.read', 'integrations.read'] },
]

export class SupabaseStaffRepository implements IStaffRepository {
  async getAll(): Promise<AdminUser[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('staff').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((r) => this.mapRow(r as Record<string, unknown>))
  }

  async getById(id: string): Promise<AdminUser | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('staff').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    if (!data) return null
    return this.mapRow(data as Record<string, unknown>)
  }

  async invite(email: string, name: string, role: AdminRole, invitedBy: string): Promise<AdminUser> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('staff')
      .insert({
        name,
        email,
        role,
        status: 'invited',
        invited_by: invitedBy,
      })
      .select()
      .single()
    if (error) throw error
    return this.mapRow(data as Record<string, unknown>)
  }

  async update(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> {
    const sb = supabaseMappers.getClient()
    const patch: Record<string, unknown> = {}
    if (updates.name !== undefined) patch.name = updates.name
    if (updates.email !== undefined) patch.email = updates.email
    if (updates.role !== undefined) patch.role = updates.role
    if (updates.avatarInitials !== undefined) patch.avatar_initials = updates.avatarInitials
    const { data, error } = await sb.from('staff').update(patch).eq('id', id).select().single()
    if (error) throw error
    return this.mapRow(data as Record<string, unknown>)
  }

  async setStatus(id: string, status: 'active' | 'invited' | 'suspended'): Promise<AdminUser | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('staff').update({ status }).eq('id', id).select().single()
    if (error) throw error
    return this.mapRow(data as Record<string, unknown>)
  }

  async resendInvite(email: string) {
    return null
  }

  async getInvitations() {
    return []
  }

  async getRolePermissions() {
    return ROLE_PERMISSIONS as unknown as RolePermissions[]
  }

  async getActivity(userId: string) {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('audit_logs').select('id, action, created_at').eq('actor_id', userId).order('created_at', { ascending: false }).limit(20)
    if (error) return []
    return (data ?? []).map((r) => ({
      id: String((r as Record<string, unknown>).id),
      userId,
      action: String((r as Record<string, unknown>).action ?? ''),
      timestamp: String((r as Record<string, unknown>).created_at ?? new Date().toISOString()),
    })) as unknown as StaffActivityEntry[]
  }

  private mapRow(row: Record<string, unknown>): AdminUser {
    return {
      id: String(row.id),
      name: String(row.name ?? ''),
      email: String(row.email ?? ''),
      role: (row.role as AdminRole) ?? 'support_agent',
      avatarInitials: String(row.avatar_initials ?? ''),
      lastLoginAt: row.last_login_at ? String(row.last_login_at) : '',
    } as unknown as AdminUser
  }
}
