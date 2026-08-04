'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  PackageX,
  MapPin,
  CreditCard,
  User,
  Clock,
  Printer,
  Truck,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'
import {
  AdminPageHeader,
  AdminStatusBadge,
  AdminEmptyState,
  AdminStatusTransition,
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
  AdminFormField,
} from '@/components/admin'
import { orderService } from '@/services/orderService'
import type { Order, OrderStatus } from '@/features/orders/types'

const CARRIERS = ['Delhivery', 'Blue Dart', 'Ekart Logistics', 'DTDC', 'XpressBees']

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [shipDialogOpen, setShipDialogOpen] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState(CARRIERS[0])
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')

  const load = useCallback(async () => {
    if (!params?.id) return
    const o = await orderService.getById(params.id)
    setOrder(o)
    setLoading(false)
  }, [params?.id])

  useEffect(() => {
    void load()
  }, [load])

  const transition = async (status: OrderStatus) => {
    if (!order) return
    if (status === 'shipped' && !order.trackingNumber) {
      setShipDialogOpen(true)
      return
    }
    const updated = await orderService.updateOrderStatus(order.id, status, `Status changed to ${status} by admin`)
    if (updated) {
      setOrder(updated)
      toast.success(`Order marked as ${status}`)
    }
  }

  const confirmShip = async () => {
    if (!order || !trackingNumber.trim()) return
    const withTracking = await orderService.addTracking(order.id, trackingNumber.trim(), carrier)
    if (!withTracking) return
    const updated = await orderService.updateOrderStatus(order.id, 'shipped', `Shipped via ${carrier} (${trackingNumber.trim()})`)
    if (updated) {
      setOrder(updated)
      setShipDialogOpen(false)
      setTrackingNumber('')
      toast.success('Order marked as shipped with tracking')
    }
  }

  const confirmRefund = async () => {
    if (!order) return
    const amount = Number(refundAmount)
    if (!amount || amount <= 0 || amount > order.total) {
      toast.error('Enter a valid refund amount')
      return
    }
    if (!refundReason.trim()) {
      toast.error('Refund reason is required')
      return
    }
    const updated = await orderService.initiateRefund(order.id, amount, refundReason.trim())
    if (updated) {
      setOrder(updated)
      setRefundDialogOpen(false)
      setRefundAmount('')
      setRefundReason('')
      toast.success(`Refund of ${formatPrice(amount)} initiated`)
    }
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl border border-gray-200 bg-white" />
  }

  if (!order) {
    return (
      <AdminEmptyState
        icon={PackageX}
        title="Order not found"
        action={
          <Link href="/admin/orders" className="text-sm font-medium text-blue-600 hover:underline">
            Back to orders
          </Link>
        }
      />
    )
  }

  const validTransitions = orderService.getValidTransitions(order.status)
  const refundedTotal = (order.refunds ?? []).reduce((s, r) => s + r.amount, 0)

  return (
    <div className="space-y-5">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <AdminPageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed ${new Date(order.createdAt).toLocaleString('en-IN')}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => toast.info('Packing slip sent to printer (mock)')}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Printer className="h-4 w-4" /> Packing Slip
            </button>
            <button
              type="button"
              onClick={() => toast.info('Shipping label sent to printer (mock)')}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Printer className="h-4 w-4" /> Shipping Label
            </button>
            {(order.status === 'packed' || order.status === 'processing') && (
              <button
                type="button"
                onClick={() => setShipDialogOpen(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Truck className="h-4 w-4" /> Mark as Shipped
              </button>
            )}
            {order.status === 'returned' && (
              <button
                type="button"
                onClick={() => {
                  setRefundAmount(String(order.total - refundedTotal))
                  setRefundDialogOpen(true)
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-700"
              >
                <RotateCcw className="h-4 w-4" /> Initiate Refund
              </button>
            )}
          </div>
        }
      />

      {/* Status transitions */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">Order Status</p>
        <AdminStatusTransition
          currentStatus={order.status}
          validTransitions={validTransitions}
          onTransition={(s) => void transition(s)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {/* Items */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <h2 className="border-b border-gray-200 px-5 py-4 text-sm font-semibold text-gray-900">
              Items ({order.items.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-2.5 font-medium">Product</th>
                    <th className="px-5 py-2.5 font-medium">SKU</th>
                    <th className="px-5 py-2.5 text-right font-medium">Qty</th>
                    <th className="px-5 py-2.5 text-right font-medium">Price</th>
                    <th className="px-5 py-2.5 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.variantLabel}</p>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-600">{item.sku}</td>
                      <td className="px-5 py-3 text-right text-gray-600">{item.quantity}</td>
                      <td className="px-5 py-3 text-right text-gray-600">
                        {formatPrice(item.sellingPrice)}
                        {item.mrp > item.sellingPrice && (
                          <span className="ml-1 text-xs text-gray-400 line-through">{formatPrice(item.mrp)}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-200 px-5 py-4">
              <dl className="ml-auto max-w-xs space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd className="text-gray-900">{formatPrice(order.subtotal)}</dd></div>
                {order.discount > 0 && (
                  <div className="flex justify-between"><dt className="text-gray-500">Discount</dt><dd className="text-green-600">−{formatPrice(order.discount)}</dd></div>
                )}
                <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd className="text-gray-900">{order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'Free'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Tax (GST 18%)</dt><dd className="text-gray-900">{formatPrice(order.tax)}</dd></div>
                <div className="flex justify-between border-t border-gray-200 pt-1.5 font-semibold"><dt className="text-gray-900">Total</dt><dd className="text-gray-900">{formatPrice(order.total)}</dd></div>
                {refundedTotal > 0 && (
                  <div className="flex justify-between"><dt className="text-red-500">Refunded</dt><dd className="text-red-600">−{formatPrice(refundedTotal)}</dd></div>
                )}
              </dl>
            </div>
          </div>

          {/* Refunds */}
          {(order.refunds?.length ?? 0) > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <RotateCcw className="h-4 w-4 text-gray-400" /> Refunds
              </h2>
              <ul className="space-y-3">
                {order.refunds!.map((r) => (
                  <li key={r.id} className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(r.amount)} <span className="text-xs font-normal text-gray-500">({r.type})</span>
                      </p>
                      <p className="text-xs text-gray-500">{r.reason}</p>
                      <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString('en-IN')}{r.actor && ` · ${r.actor}`}</p>
                    </div>
                    <AdminStatusBadge status={r.status} tone={r.status === 'processed' ? 'green' : 'yellow'} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Clock className="h-4 w-4 text-gray-400" /> Timeline
            </h2>
            <ol className="space-y-4">
              {[...order.timeline].reverse().map((event) => (
                <li key={event.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    {event.description && <p className="text-xs text-gray-500">{event.description}</p>}
                    <p className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleString('en-IN')}
                      {event.actor && ` · by ${event.actor}`}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <User className="h-4 w-4 text-gray-400" /> Customer
            </h2>
            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
            <p className="text-sm text-gray-600">{order.customerEmail}</p>
            <p className="text-sm text-gray-600">{order.customerPhone}</p>
            <Link
              href={`/admin/customers/${order.customerId}`}
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              View customer
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Truck className="h-4 w-4 text-gray-400" /> Fulfillment
            </h2>
            <div className="mb-3">
              <AdminStatusBadge status={order.fulfillmentStatus} />
            </div>
            {order.trackingNumber ? (
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Carrier</dt><dd className="font-medium text-gray-900">{order.carrier}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Tracking #</dt><dd className="font-mono text-xs text-gray-900">{order.trackingNumber}</dd></div>
              </dl>
            ) : (
              <p className="text-sm text-gray-400">Not shipped yet</p>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <MapPin className="h-4 w-4 text-gray-400" /> Shipping Address
            </h2>
            <address className="text-sm not-italic text-gray-600">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
              {order.shippingAddress.country}<br />
              {order.shippingAddress.phone}
            </address>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <CreditCard className="h-4 w-4 text-gray-400" /> Payment
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{order.paymentMethod}</span>
              <AdminStatusBadge status={order.paymentStatus} />
            </div>
            {order.paymentStatus === 'cod' && (
              <p className="mt-2 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-700">
                Cash on Delivery — collect {formatPrice(order.total)} at delivery.
              </p>
            )}
            <p className="mt-2 text-sm text-gray-600">
              Amount: <span className="font-semibold text-gray-900">{formatPrice(order.total)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Ship dialog */}
      {shipDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setShipDialogOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">Mark as Shipped</h3>
            <AdminFormField label="Carrier" required>
              <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className={adminSelectClass}>
                {CARRIERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </AdminFormField>
            <AdminFormField label="Tracking Number" required>
              <input
                className={adminInputClass}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="AWB1234567890"
              />
            </AdminFormField>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShipDialogOpen(false)} className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" disabled={!trackingNumber.trim()} onClick={() => void confirmShip()} className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                Confirm Shipment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund dialog */}
      {refundDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setRefundDialogOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">Initiate Refund</h3>
            <p className="text-sm text-gray-500">
              Order total {formatPrice(order.total)}
              {refundedTotal > 0 && ` · already refunded ${formatPrice(refundedTotal)}`}
            </p>
            <AdminFormField label="Refund Amount (₹)" required>
              <input
                type="number"
                className={adminInputClass}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                min={1}
                max={order.total}
              />
            </AdminFormField>
            <AdminFormField label="Reason" required>
              <textarea
                className={adminTextareaClass}
                rows={3}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Product returned — comfort issue"
              />
            </AdminFormField>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setRefundDialogOpen(false)} className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={() => void confirmRefund()} className="h-9 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700">
                Initiate Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
