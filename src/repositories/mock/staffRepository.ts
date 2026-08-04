import type { AdminUser, AdminRole, Invitation, RolePermissions, StaffActivityEntry, StaffStatus } from '@/features/staff/types'
import { mockStaff, mockInvitations, mockRolePermissions, mockStaffActivity } from '@/data/admin/staff.mock'

let staff: AdminUser[] = mockStaff.map((s) => ({ ...s }))
let invitations: Invitation[] = mockInvitations.map((i) => ({ ...i }))

export class MockStaffRepository {
  async getAll(): Promise<AdminUser[]> {
    return staff.map((s) => ({ ...s }))
  }

  async getById(id: string): Promise<AdminUser | null> {
    const s = staff.find((x) => x.id === id)
    return s ? { ...s } : null
  }

  async update(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> {
    const idx = staff.findIndex((s) => s.id === id)
    if (idx === -1) return null
    staff[idx] = { ...staff[idx], ...updates }
    return { ...staff[idx] }
  }

  async setStatus(id: string, status: StaffStatus): Promise<AdminUser | null> {
    return this.update(id, { status })
  }

  async invite(email: string, name: string, role: AdminRole, invitedBy: string): Promise<AdminUser> {
    const now = new Date()
    const user: AdminUser = {
      id: `staff-${Date.now()}`,
      name,
      email,
      phone: '',
      role,
      status: 'invited',
      avatarInitials: name
        .split(' ')
        .map((p) => p.charAt(0).toUpperCase())
        .slice(0, 2)
        .join(''),
      createdAt: now.toISOString(),
      twoFactorEnabled: false,
    }
    staff = [...staff, user]
    const expiry = new Date(now)
    expiry.setDate(expiry.getDate() + 7)
    invitations = [
      ...invitations,
      { id: `inv-${Date.now()}`, email, role, invitedBy, invitedAt: now.toISOString(), expiresAt: expiry.toISOString(), status: 'pending' },
    ]
    return { ...user }
  }

  async getInvitations(): Promise<Invitation[]> {
    return invitations.map((i) => ({ ...i }))
  }

  async resendInvite(email: string): Promise<Invitation | null> {
    const idx = invitations.findIndex((i) => i.email === email)
    if (idx === -1) return null
    const now = new Date()
    const expiry = new Date(now)
    expiry.setDate(expiry.getDate() + 7)
    invitations[idx] = { ...invitations[idx], invitedAt: now.toISOString(), expiresAt: expiry.toISOString(), status: 'pending' }
    return { ...invitations[idx] }
  }

  async getRolePermissions(): Promise<RolePermissions[]> {
    return mockRolePermissions.map((r) => ({ ...r, permissions: [...r.permissions] }))
  }

  async getActivity(userId: string): Promise<StaffActivityEntry[]> {
    return mockStaffActivity.filter((a) => a.userId === userId).map((a) => ({ ...a }))
  }
}

export const staffRepository = new MockStaffRepository()
