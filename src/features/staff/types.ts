export type AdminRole =
  | 'super_admin'
  | 'catalog_manager'
  | 'order_manager'
  | 'inventory_manager'
  | 'marketing_manager'
  | 'support_agent'
  | 'finance'
  | 'developer'

export type Permission =
  | 'products.read'
  | 'products.write'
  | 'orders.read'
  | 'orders.write'
  | 'customers.read'
  | 'customers.write'
  | 'inventory.read'
  | 'inventory.write'
  | 'discounts.read'
  | 'discounts.write'
  | 'content.read'
  | 'content.write'
  | 'analytics.read'
  | 'settings.read'
  | 'settings.write'
  | 'staff.read'
  | 'staff.write'
  | 'integrations.read'
  | 'integrations.write'
  | 'audit.read'

export type StaffStatus = 'active' | 'invited' | 'suspended'

export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  role: AdminRole
  status: StaffStatus
  avatarInitials: string
  lastLoginAt?: string
  createdAt: string
  twoFactorEnabled: boolean
}

export interface RolePermissions {
  role: AdminRole
  label: string
  description: string
  permissions: Permission[]
}

export interface Invitation {
  id: string
  email: string
  role: AdminRole
  invitedBy: string
  invitedAt: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'expired'
}

export interface StaffActivityEntry {
  id: string
  userId: string
  action: string
  timestamp: string
}
