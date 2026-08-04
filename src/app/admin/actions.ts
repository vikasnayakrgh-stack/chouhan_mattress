'use server'

import { requireAdminRole } from '@/lib/auth/adminAuth'
import { orderService } from '@/services/orderService'
import { productService } from '@/services/productService'
import { customerService } from '@/services/customerService'
import { discountService } from '@/services/discountService'
import { inventoryService } from '@/services/inventoryService'
import { returnService } from '@/services/returnService'
import { logSecurityEvent } from '@/lib/security-logger'

/**
 * Defense-in-depth Server Actions with mandatory RBAC verification
 */

export async function adminUpdateOrderStatusAction(
  token: string,
  orderId: string,
  newStatus: any,
  note?: string
) {
  const { user, role } = await requireAdminRole(token, ['owner', 'admin', 'manager', 'staff'])

  logSecurityEvent({
    eventType: 'ADMIN_LOGIN_SUCCESS',
    userId: user.id,
    userEmail: user.email,
    userRole: role,
    resource: `/admin/orders/${orderId}`,
    action: `UPDATE_ORDER_STATUS:${newStatus}`,
    status: 'SUCCESS',
  })

  return orderService.updateOrderStatus(orderId, newStatus, note)
}

export async function adminInitiateRefundAction(
  token: string,
  orderId: string,
  amount: number,
  reason: string
) {
  const { user, role } = await requireAdminRole(token, ['owner', 'admin', 'manager'])

  logSecurityEvent({
    eventType: 'ADMIN_LOGIN_SUCCESS',
    userId: user.id,
    userEmail: user.email,
    userRole: role,
    resource: `/admin/orders/${orderId}`,
    action: `INITIATE_REFUND:${amount}`,
    status: 'SUCCESS',
  })

  return orderService.initiateRefund(orderId, amount, reason)
}

export async function adminAdjustStockAction(
  token: string,
  adjustment: any
) {
  const { user, role } = await requireAdminRole(token, ['owner', 'admin', 'manager', 'staff'])

  logSecurityEvent({
    eventType: 'ADMIN_LOGIN_SUCCESS',
    userId: user.id,
    userEmail: user.email,
    userRole: role,
    resource: '/admin/inventory',
    action: 'ADJUST_STOCK',
    status: 'SUCCESS',
  })

  return inventoryService.adjustStock(adjustment)
}

export async function adminCreateDiscountAction(
  token: string,
  discount: any
) {
  const { user, role } = await requireAdminRole(token, ['owner', 'admin', 'manager'])

  logSecurityEvent({
    eventType: 'ADMIN_LOGIN_SUCCESS',
    userId: user.id,
    userEmail: user.email,
    userRole: role,
    resource: '/admin/discounts',
    action: 'CREATE_DISCOUNT',
    status: 'SUCCESS',
  })

  return discountService.create(discount)
}

export async function adminUpdateReturnStatusAction(
  token: string,
  returnId: string,
  status: any,
  note?: string
) {
  const { user, role } = await requireAdminRole(token, ['owner', 'admin', 'manager', 'staff'])

  logSecurityEvent({
    eventType: 'ADMIN_LOGIN_SUCCESS',
    userId: user.id,
    userEmail: user.email,
    userRole: role,
    resource: `/admin/returns/${returnId}`,
    action: `UPDATE_RETURN_STATUS:${status}`,
    status: 'SUCCESS',
  })

  return returnService.updateStatus(returnId, status, note)
}
