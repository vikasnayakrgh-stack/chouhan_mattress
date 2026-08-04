import type { AdminUser, RolePermissions, Invitation, StaffActivityEntry, Permission } from '@/features/staff/types'

const ALL: Permission[] = [
  'products.read', 'products.write', 'orders.read', 'orders.write', 'customers.read', 'customers.write',
  'inventory.read', 'inventory.write', 'discounts.read', 'discounts.write', 'content.read', 'content.write',
  'analytics.read', 'settings.read', 'settings.write', 'staff.read', 'staff.write',
  'integrations.read', 'integrations.write', 'audit.read',
]

export const mockRolePermissions: RolePermissions[] = [
  { role: 'super_admin', label: 'Super Admin', description: 'Full access to everything including staff and settings.', permissions: ALL },
  { role: 'catalog_manager', label: 'Catalog Manager', description: 'Manage products, categories, collections and content.', permissions: ['products.read', 'products.write', 'content.read', 'content.write', 'inventory.read', 'analytics.read'] },
  { role: 'order_manager', label: 'Order Manager', description: 'Manage orders, returns and customer queries.', permissions: ['orders.read', 'orders.write', 'customers.read', 'inventory.read', 'analytics.read'] },
  { role: 'inventory_manager', label: 'Inventory Manager', description: 'Stock levels, adjustments and warehouse operations.', permissions: ['inventory.read', 'inventory.write', 'products.read', 'orders.read'] },
  { role: 'marketing_manager', label: 'Marketing Manager', description: 'Discounts, banners, SEO and analytics.', permissions: ['discounts.read', 'discounts.write', 'content.read', 'content.write', 'analytics.read', 'customers.read'] },
  { role: 'support_agent', label: 'Support Agent', description: 'View orders and customers; respond to reviews.', permissions: ['orders.read', 'customers.read', 'customers.write', 'content.read'] },
  { role: 'finance', label: 'Finance', description: 'Payments, refunds, tax settings and reports.', permissions: ['orders.read', 'analytics.read', 'settings.read', 'audit.read'] },
  { role: 'developer', label: 'Developer', description: 'Integrations, webhooks, API keys and audit log.', permissions: ['integrations.read', 'integrations.write', 'settings.read', 'audit.read', 'analytics.read'] },
]

export const mockStaff: AdminUser[] = [
  { id: 'staff-001', name: 'Rajesh Chouhan', email: 'rajesh@chouhanmattress.com', phone: '+91 98261 00001', role: 'super_admin', status: 'active', avatarInitials: 'RC', lastLoginAt: '2026-07-27T08:45:00+05:30', createdAt: '2025-01-10T10:00:00+05:30', twoFactorEnabled: true },
  { id: 'staff-002', name: 'Priya Sharma', email: 'priya.sharma@chouhanmattress.com', phone: '+91 98261 00002', role: 'marketing_manager', status: 'active', avatarInitials: 'PS', lastLoginAt: '2026-07-26T19:20:00+05:30', createdAt: '2025-02-14T10:00:00+05:30', twoFactorEnabled: true },
  { id: 'staff-003', name: 'Rohit Verma', email: 'rohit.verma@chouhanmattress.com', phone: '+91 98261 00003', role: 'catalog_manager', status: 'active', avatarInitials: 'RV', lastLoginAt: '2026-07-27T09:10:00+05:30', createdAt: '2025-03-01T10:00:00+05:30', twoFactorEnabled: false },
  { id: 'staff-004', name: 'Anil Kumar Sahu', email: 'anil.sahu@chouhanmattress.com', phone: '+91 98261 00004', role: 'order_manager', status: 'active', avatarInitials: 'AS', lastLoginAt: '2026-07-27T07:55:00+05:30', createdAt: '2025-03-15T10:00:00+05:30', twoFactorEnabled: true },
  { id: 'staff-005', name: 'Sneha Patel', email: 'sneha.patel@chouhanmattress.com', phone: '+91 98261 00005', role: 'inventory_manager', status: 'active', avatarInitials: 'SP', lastLoginAt: '2026-07-25T18:00:00+05:30', createdAt: '2025-05-20T10:00:00+05:30', twoFactorEnabled: false },
  { id: 'staff-006', name: 'Kiran Yadav', email: 'kiran.yadav@chouhanmattress.com', phone: '+91 98261 00006', role: 'support_agent', status: 'active', avatarInitials: 'KY', lastLoginAt: '2026-07-26T21:35:00+05:30', createdAt: '2025-08-05T10:00:00+05:30', twoFactorEnabled: false },
  { id: 'staff-007', name: 'Manish Agrawal', email: 'manish.agrawal@chouhanmattress.com', phone: '+91 98261 00007', role: 'finance', status: 'active', avatarInitials: 'MA', lastLoginAt: '2026-07-24T16:40:00+05:30', createdAt: '2025-09-12T10:00:00+05:30', twoFactorEnabled: true },
  { id: 'staff-008', name: 'Divya Nair', email: 'divya.nair@chouhanmattress.com', phone: '+91 98261 00008', role: 'developer', status: 'active', avatarInitials: 'DN', lastLoginAt: '2026-07-27T10:05:00+05:30', createdAt: '2025-11-01T10:00:00+05:30', twoFactorEnabled: true },
  { id: 'staff-009', name: 'Vaibhav Tiwari', email: 'vaibhav.tiwari@chouhanmattress.com', phone: '+91 98261 00009', role: 'support_agent', status: 'invited', avatarInitials: 'VT', createdAt: '2026-07-22T10:00:00+05:30', twoFactorEnabled: false },
  { id: 'staff-010', name: 'Ritu Singh', email: 'ritu.singh@chouhanmattress.com', phone: '+91 98261 00010', role: 'order_manager', status: 'suspended', avatarInitials: 'RS', lastLoginAt: '2026-06-30T12:00:00+05:30', createdAt: '2025-06-18T10:00:00+05:30', twoFactorEnabled: false },
]

export const mockInvitations: Invitation[] = [
  { id: 'inv-001', email: 'vaibhav.tiwari@chouhanmattress.com', role: 'support_agent', invitedBy: 'Rajesh Chouhan', invitedAt: '2026-07-22T10:00:00+05:30', expiresAt: '2026-07-29T10:00:00+05:30', status: 'pending' },
]

export const mockStaffActivity: StaffActivityEntry[] = [
  { id: 'act-001', userId: 'staff-002', action: 'Updated hero banner for Monsoon Sale', timestamp: '2026-07-26T18:30:00+05:30' },
  { id: 'act-002', userId: 'staff-003', action: 'Created product PocketSpring Luxury King variant', timestamp: '2026-07-26T15:10:00+05:30' },
  { id: 'act-003', userId: 'staff-004', action: 'Marked order CM-ORD-1042 as shipped', timestamp: '2026-07-27T08:20:00+05:30' },
  { id: 'act-004', userId: 'staff-005', action: 'Adjusted stock for OrthoSpine Pro Queen (+25)', timestamp: '2026-07-25T17:45:00+05:30' },
  { id: 'act-005', userId: 'staff-001', action: 'Invited vaibhav.tiwari@chouhanmattress.com as Support Agent', timestamp: '2026-07-22T10:00:00+05:30' },
  { id: 'act-006', userId: 'staff-008', action: 'Rotated Razorpay API key', timestamp: '2026-07-20T11:00:00+05:30' },
  { id: 'act-007', userId: 'staff-002', action: 'Published Independence Day sale banner (scheduled)', timestamp: '2026-07-22T16:45:00+05:30' },
  { id: 'act-008', userId: 'staff-006', action: 'Responded to review rev-006', timestamp: '2026-07-02T12:00:00+05:30' },
]
