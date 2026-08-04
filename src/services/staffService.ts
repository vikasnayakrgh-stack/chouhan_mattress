import { getRepositories } from '@/repositories'
import type { AdminUser, AdminRole, Invitation, RolePermissions, StaffActivityEntry, StaffStatus } from '@/features/staff/types'

export const staffService = {
  async getAll(): Promise<AdminUser[]> {
    return getRepositories().staff.getAll()
  },

  async getById(id: string): Promise<AdminUser | null> {
    return getRepositories().staff.getById(id)
  },

  async invite(email: string, name: string, role: AdminRole, invitedBy = 'Admin'): Promise<AdminUser> {
    return getRepositories().staff.invite(email, name, role, invitedBy)
  },

  async assignRole(id: string, role: AdminRole): Promise<AdminUser | null> {
    return getRepositories().staff.update(id, { role })
  },

  async update(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> {
    return getRepositories().staff.update(id, updates)
  },

  async revoke(id: string): Promise<AdminUser | null> {
    return getRepositories().staff.setStatus(id, 'suspended')
  },

  async reactivate(id: string): Promise<AdminUser | null> {
    return getRepositories().staff.setStatus(id, 'active')
  },

  async resendInvite(email: string): Promise<Invitation | null> {
    return getRepositories().staff.resendInvite(email)
  },

  async getInvitations(): Promise<Invitation[]> {
    return getRepositories().staff.getInvitations()
  },

  async getRolePermissions(): Promise<RolePermissions[]> {
    return getRepositories().staff.getRolePermissions() as unknown as RolePermissions[]
  },

  async getRoleLabel(role: AdminRole): Promise<string> {
    const roles = await this.getRolePermissions()
    return roles.find((r) => r.role === role)?.label ?? role
  },

  async getActivity(userId: string): Promise<StaffActivityEntry[]> {
    return getRepositories().staff.getActivity(userId)
  },

  statusTone(status: StaffStatus): 'green' | 'yellow' | 'red' {
    if (status === 'active') return 'green'
    if (status === 'invited') return 'yellow'
    return 'red'
  },
}
