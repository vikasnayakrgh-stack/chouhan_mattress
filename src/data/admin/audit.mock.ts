import type { AuditLog, AuditAction, AuditEntity } from '@/features/audit/types'

interface Seed {
  action: AuditAction
  entity: AuditEntity
  entityId: string
  entityLabel: string
  actorId: string
  actorName: string
  actorRole: string
  description: string
  changes?: { field: string; from: string; to: string }[]
}

const actors = {
  rajesh: { actorId: 'staff-001', actorName: 'Rajesh Chouhan', actorRole: 'Super Admin' },
  priya: { actorId: 'staff-002', actorName: 'Priya Sharma', actorRole: 'Marketing Manager' },
  rohit: { actorId: 'staff-003', actorName: 'Rohit Verma', actorRole: 'Catalog Manager' },
  anil: { actorId: 'staff-004', actorName: 'Anil Kumar Sahu', actorRole: 'Order Manager' },
  sneha: { actorId: 'staff-005', actorName: 'Sneha Patel', actorRole: 'Inventory Manager' },
  kiran: { actorId: 'staff-006', actorName: 'Kiran Yadav', actorRole: 'Support Agent' },
  manish: { actorId: 'staff-007', actorName: 'Manish Agrawal', actorRole: 'Finance' },
  divya: { actorId: 'staff-008', actorName: 'Divya Nair', actorRole: 'Developer' },
}

const seeds: Seed[] = [
  { action: 'price_change', entity: 'product', entityId: 'prod-001', entityLabel: 'OrthoSpine Pro Memory Foam Mattress', ...actors.rohit, description: 'Updated selling price for Queen 6"', changes: [{ field: 'price', from: '\u20B913,499', to: '\u20B912,499' }] },
  { action: 'status_change', entity: 'order', entityId: 'ord-1042', entityLabel: 'CM-ORD-1042', ...actors.anil, description: 'Order status changed', changes: [{ field: 'status', from: 'packed', to: 'shipped' }] },
  { action: 'create', entity: 'product', entityId: 'prod-009', entityLabel: 'CloudNine Latex Mattress', ...actors.rohit, description: 'Created new product draft' },
  { action: 'invite', entity: 'staff', entityId: 'staff-009', entityLabel: 'vaibhav.tiwari@chouhanmattress.com', ...actors.rajesh, description: 'Invited new staff member as Support Agent' },
  { action: 'settings_change', entity: 'settings', entityId: 'shipping', entityLabel: 'Shipping Settings', ...actors.rajesh, description: 'Updated free shipping threshold', changes: [{ field: 'freeShippingThreshold', from: '\u20B93,999', to: '\u20B94,999' }] },
  { action: 'update', entity: 'content', entityId: 'hero-001', entityLabel: 'Homepage Hero', ...actors.priya, description: 'Updated hero headline for Monsoon Sale' },
  { action: 'create', entity: 'discount', entityId: 'disc-mon40', entityLabel: 'MONSOON40', ...actors.priya, description: 'Created 40% monsoon sale coupon' },
  { action: 'status_change', entity: 'review', entityId: 'rev-021', entityLabel: 'Review by Nilesh Kumar', ...actors.kiran, description: 'Rejected spam review', changes: [{ field: 'status', from: 'pending', to: 'rejected' }] },
  { action: 'update', entity: 'inventory', entityId: 'inv-prod-001-q6', entityLabel: 'OrthoSpine Pro Queen 6"', ...actors.sneha, description: 'Stock adjustment +25 units (new production batch)' },
  { action: 'update', entity: 'integration', entityId: 'int-razorpay', entityLabel: 'Razorpay', ...actors.divya, description: 'Rotated live API key' },
  { action: 'status_change', entity: 'order', entityId: 'ord-1039', entityLabel: 'CM-ORD-1039', ...actors.anil, description: 'Order delivered', changes: [{ field: 'status', from: 'shipped', to: 'delivered' }] },
  { action: 'export', entity: 'order', entityId: 'orders-export', entityLabel: 'Orders CSV', ...actors.manish, description: 'Exported June orders for GST filing' },
  { action: 'price_change', entity: 'product', entityId: 'prod-005', entityLabel: 'PocketSpring Luxury Mattress', ...actors.rohit, description: 'Increased King size price', changes: [{ field: 'price', from: '\u20B921,999', to: '\u20B922,999' }] },
  { action: 'update', entity: 'content', entityId: 'ban-004', entityLabel: 'Independence Day Banner', ...actors.priya, description: 'Scheduled banner for Aug 10-17' },
  { action: 'create', entity: 'category', entityId: 'cat-bedframes', entityLabel: 'Bed Frames', ...actors.rohit, description: 'Created new category' },
  { action: 'delete', entity: 'discount', entityId: 'disc-sum25', entityLabel: 'SUMMER25', ...actors.priya, description: 'Deleted expired summer coupon' },
  { action: 'login', entity: 'staff', entityId: 'staff-001', entityLabel: 'Rajesh Chouhan', ...actors.rajesh, description: 'Logged in from new device (Chrome, Windows)' },
  { action: 'settings_change', entity: 'settings', entityId: 'payments', entityLabel: 'Payment Settings', ...actors.manish, description: 'Updated COD max order value', changes: [{ field: 'codMaxOrderValue', from: '\u20B940,000', to: '\u20B950,000' }] },
  { action: 'status_change', entity: 'review', entityId: 'rev-015', entityLabel: 'Review by Rajiv Khanna', ...actors.kiran, description: 'Approved and featured review', changes: [{ field: 'status', from: 'pending', to: 'approved' }] },
  { action: 'archive', entity: 'product', entityId: 'prod-old-01', entityLabel: 'Classic Foam Mattress (2019)', ...actors.rohit, description: 'Archived discontinued product' },
  { action: 'update', entity: 'customer', entityId: 'cust-002', entityLabel: 'Neha Choudhary', ...actors.kiran, description: 'Updated default shipping address' },
  { action: 'create', entity: 'collection', entityId: 'coll-monsoon', entityLabel: 'Monsoon Sale', ...actors.priya, description: 'Created seasonal collection' },
  { action: 'status_change', entity: 'order', entityId: 'ord-1035', entityLabel: 'CM-ORD-1035', ...actors.anil, description: 'Order cancelled by customer request', changes: [{ field: 'status', from: 'confirmed', to: 'cancelled' }] },
  { action: 'update', entity: 'integration', entityId: 'int-twilio', entityLabel: 'Twilio SMS', ...actors.divya, description: 'Webhook delivery failing \u2014 investigating DLT template mismatch' },
  { action: 'settings_change', entity: 'settings', entityId: 'tax', entityLabel: 'Tax Settings', ...actors.manish, description: 'Added GST 5% rate for cotton items' },
]

function ts(i: number): string {
  const d = new Date('2026-07-27T10:30:00+05:30')
  d.setHours(d.getHours() - i * 7 - (i % 5))
  return d.toISOString()
}

export const mockAuditLogs: AuditLog[] = Array.from({ length: 55 }, (_, i) => {
  const seed = seeds[i % seeds.length]
  return {
    id: `audit-${String(i + 1).padStart(3, '0')}`,
    ...seed,
    ipAddress: `103.216.${82 + (i % 40)}.${10 + (i % 200)}`,
    timestamp: ts(i),
  }
})
