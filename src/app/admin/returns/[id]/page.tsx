'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PackageX, Clock, ImageIcon, User } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'
import {
  AdminPageHeader,
  AdminStatusBadge,
  AdminEmptyState,
  AdminStatusTransition,
  AdminConfirmDialog,
} from '@/components/admin'
import { returnService } from '@/services/returnService'
import type { Return, ReturnStatus } from '@/features/returns/types'
import { RETURN_REASON_LABELS, RETURN_RESOLUTION_LABELS } from '@/features/returns/types'

export default function AdminReturnDetailPage() {
  const params = useParams<{ id: string }>()
  const [ret, setRet] = useState<Return | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingStatus, setPendingStatus] = useState<ReturnStatus | null>(null)

  const load = useCallback(async () => {
    if (!params?.id) return
    const r = await returnService.getById(params.id)
    setRet(r)
    setLoading(false)
  }, [params?.id])

  useEffect(() => {
    void load()
  }, [load])

  const confirmTransition = async () => {
    if (!ret || !pendingStatus) return
    const updated = await returnService.updateStatus(ret.id, pendingStatus, `Status changed to ${pendingStatus} by admin`)
    if (updated) {
      setRet(updated)
      toast.success(
        pendingStatus === 'refunded'
          ? `Refund of ${formatPrice(updated.refundAmount)} initiated`
          : `Return marked as ${pendingStatus}`
      )
    }
    setPendingStatus(null)
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl border border-gray-200 bg-white" />
  }

  if (!ret) {
    return (
      <AdminEmptyState
        icon={PackageX}
        title="Return not found"
        action={
          <Link href="/admin/returns" className="text-sm font-medium text-blue-600 hover:underline">
            Back to returns
          </Link>
        }
      />
    )
  }

  const validTransitions = returnService.getValidTransitions(ret.status)

  return (
    <div className="space-y-5">
      <Link href="/admin/returns" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to returns
      </Link>

      <AdminPageHeader
        title={`Return ${ret.returnNumber}`}
        description={`Requested ${new Date(ret.createdAt).toLocaleString('en-IN')}`}
        actions={<AdminStatusBadge status={ret.status} />}
      />

      {/* Workflow */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
          Workflow: Requested → Approved → Received → Inspected → Refunded / Rejected
        </p>
        <AdminStatusTransition
          currentStatus={ret.status}
          validTransitions={validTransitions}
          onTransition={(s) => setPendingStatus(s)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {/* Items */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <h2 className="border-b border-gray-200 px-5 py-4 text-sm font-semibold text-gray-900">
              Return Items ({ret.items.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-2.5 font-medium">Product</th>
                    <th className="px-5 py-2.5 font-medium">SKU</th>
                    <th className="px-5 py-2.5 text-right font-medium">Qty</th>
                    <th className="px-5 py-2.5 text-right font-medium">Refund</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ret.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.variantLabel}</p>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-600">{item.sku}</td>
                      <td className="px-5 py-3 text-right text-gray-600">{item.quantity}</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">{formatPrice(item.refundAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between border-t border-gray-200 px-5 py-3 text-sm font-semibold text-gray-900">
              <span>Total refund amount</span>
              <span>{formatPrice(ret.refundAmount)}</span>
            </div>
          </div>

          {/* Images placeholder */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <ImageIcon className="h-4 w-4 text-gray-400" /> Customer Photos
            </h2>
            {ret.images.length === 0 ? (
              <p className="text-sm text-gray-400">No photos uploaded by customer</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {ret.images.map((img, i) => (
                  <div key={img} className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-[10px]">Photo {i + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Clock className="h-4 w-4 text-gray-400" /> Timeline
            </h2>
            <ol className="space-y-4">
              {[...ret.timeline].reverse().map((event) => (
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
            <p className="text-sm font-medium text-gray-900">{ret.customerName}</p>
            <p className="text-sm text-gray-600">{ret.customerPhone}</p>
            <Link
              href={`/admin/customers/${ret.customerId}`}
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              View customer
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Order</h2>
            <Link
              href={`/admin/orders/${ret.orderId}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {ret.orderNumber}
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Return Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Reason</dt><dd className="font-medium text-gray-900">{RETURN_REASON_LABELS[ret.reason]}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Resolution</dt><dd className="font-medium text-gray-900">{RETURN_RESOLUTION_LABELS[ret.resolution]}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Refund</dt><dd className="font-semibold text-gray-900">{formatPrice(ret.refundAmount)}</dd></div>
            </dl>
            {ret.reasonNote && (
              <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">&ldquo;{ret.reasonNote}&rdquo;</p>
            )}
          </div>
        </div>
      </div>

      <AdminConfirmDialog
        open={pendingStatus !== null}
        title={
          pendingStatus === 'refunded'
            ? `Initiate refund of ${formatPrice(ret.refundAmount)}?`
            : `Mark return as ${pendingStatus ?? ''}?`
        }
        description={
          pendingStatus === 'rejected'
            ? 'The customer will be notified that the return was rejected.'
            : pendingStatus === 'refunded'
              ? 'The refund will be initiated to the original payment method.'
              : 'This will update the return workflow status.'
        }
        confirmLabel={pendingStatus === 'refunded' ? 'Initiate Refund' : 'Confirm'}
        destructive={pendingStatus === 'rejected'}
        onConfirm={() => void confirmTransition()}
        onCancel={() => setPendingStatus(null)}
      />
    </div>
  )
}
