'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PercentCircle, Power } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'
import { AdminPageHeader, AdminStatusBadge, AdminEmptyState } from '@/components/admin'
import { discountService, type DiscountDraft } from '@/services/discountService'
import type { Discount } from '@/features/discounts/types'
import { DISCOUNT_TYPE_LABELS } from '@/features/discounts/types'
import { DiscountForm } from '../DiscountForm'

export default function AdminDiscountDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [discount, setDiscount] = useState<Discount | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!params?.id) return
    const d = await discountService.getById(params.id)
    setDiscount(d)
    setLoading(false)
  }, [params?.id])

  useEffect(() => {
    void load()
  }, [load])

  const handleSubmit = async (draft: DiscountDraft) => {
    if (!discount) return
    const updated = await discountService.update(discount.id, {
      name: draft.name,
      code: draft.code,
      description: draft.description,
      type: draft.type,
      value: draft.value,
      condition: {
        minOrderValue: draft.minOrderValue,
        categoryIds: draft.categoryIds,
        productIds: draft.productIds,
        customerGroup: draft.customerGroup ?? 'all',
      },
      startDate: draft.startDate,
      endDate: draft.endDate,
      usageLimit: draft.usageLimit,
      perCustomerLimit: draft.perCustomerLimit,
      stackable: draft.stackable,
      oncePerCustomer: draft.oncePerCustomer,
      updatedAt: new Date().toISOString(),
    })
    if (updated) {
      setDiscount(updated)
      toast.success('Discount updated')
    }
  }

  const toggle = async () => {
    if (!discount) return
    const updated = await discountService.toggleStatus(discount.id)
    if (updated) {
      setDiscount(updated)
      toast.success(updated.status === 'disabled' ? 'Discount disabled' : 'Discount enabled')
    }
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl border border-gray-200 bg-white" />
  }

  if (!discount) {
    return (
      <AdminEmptyState
        icon={PercentCircle}
        title="Discount not found"
        action={
          <Link href="/admin/discounts" className="text-sm font-medium text-blue-600 hover:underline">
            Back to discounts
          </Link>
        }
      />
    )
  }

  const usagePct =
    discount.usageLimit !== null ? Math.min(100, Math.round((discount.usageCount / discount.usageLimit) * 100)) : null
  const avgDiscountPerUse = discount.usageCount > 0 ? Math.round(discount.revenueImpacted / discount.usageCount) : 0

  return (
    <div className="space-y-5">
      <Link href="/admin/discounts" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to discounts
      </Link>

      <AdminPageHeader
        title={discount.name}
        description={`Code: ${discount.code} · ${DISCOUNT_TYPE_LABELS[discount.type]}`}
        actions={
          <div className="flex items-center gap-2">
            <AdminStatusBadge
              status={discount.status}
              tone={discount.status === 'active' ? 'green' : discount.status === 'scheduled' ? 'blue' : discount.status === 'expired' ? 'gray' : 'red'}
            />
            <button
              type="button"
              onClick={() => void toggle()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Power className="h-4 w-4" />
              {discount.status === 'disabled' ? 'Enable' : 'Disable'}
            </button>
          </div>
        }
      />

      {/* Usage analytics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Times Used</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {discount.usageCount}
            {discount.usageLimit !== null && <span className="text-sm font-normal text-gray-400"> / {discount.usageLimit}</span>}
          </p>
          {usagePct !== null && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${usagePct}%` }} />
            </div>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Revenue Impacted</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{formatPrice(discount.revenueImpacted)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Avg Discount / Use</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{formatPrice(avgDiscountPerUse)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Valid Until</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {discount.endDate ? new Date(discount.endDate).toLocaleDateString('en-IN') : 'No end date'}
          </p>
        </div>
      </div>

      <DiscountForm
        key={discount.updatedAt}
        initial={discount}
        submitLabel="Save Changes"
        onSubmit={(d) => void handleSubmit(d)}
      />
    </div>
  )
}
