'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Percent, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'
import {
  AdminPageHeader,
  AdminDataTable,
  AdminStatusBadge,
  AdminConfirmDialog,
  adminSelectClass,
  type ColumnDef,
} from '@/components/admin'
import { discountService } from '@/services/discountService'
import type { Discount, DiscountStatus, DiscountType } from '@/features/discounts/types'
import { DISCOUNT_TYPE_LABELS } from '@/features/discounts/types'

const STATUS_OPTIONS: Array<DiscountStatus | 'all'> = ['all', 'active', 'scheduled', 'expired', 'disabled']
const TYPE_OPTIONS: Array<DiscountType | 'all'> = ['all', 'percentage', 'fixed', 'buy_x_get_y', 'free_shipping']

function valueLabel(d: Discount): string {
  switch (d.type) {
    case 'percentage':
      return `${d.value}% off`
    case 'fixed':
      return `${formatPrice(d.value)} off`
    case 'buy_x_get_y':
      return `Buy ${d.rule?.buyQuantity ?? 1} Get ${d.rule?.getQuantity ?? 1}`
    case 'free_shipping':
      return d.rule?.freeShippingThreshold ? `Free ship over ${formatPrice(d.rule.freeShippingThreshold)}` : 'Free shipping'
  }
}

export default function AdminDiscountsPage() {
  const router = useRouter()
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<DiscountStatus | 'all'>('all')
  const [type, setType] = useState<DiscountType | 'all'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await discountService.search({ status, type })
    setDiscounts(data)
    setLoading(false)
  }, [status, type])

  useEffect(() => {
    void load()
  }, [load])

  const columns: ColumnDef<Discount>[] = [
    {
      key: 'name',
      header: 'Discount',
      sortable: true,
      sortValue: (d) => d.name,
      render: (d) => (
        <div>
          <p className="font-medium text-gray-900">{d.name}</p>
          <p className="font-mono text-xs text-gray-500">{d.code}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (d) => <span className="text-gray-600">{DISCOUNT_TYPE_LABELS[d.type]}</span>,
    },
    { key: 'value', header: 'Value', render: (d) => <span className="text-gray-900">{valueLabel(d)}</span> },
    { key: 'status', header: 'Status', render: (d) => <AdminStatusBadge status={d.status} tone={d.status === 'active' ? 'green' : d.status === 'scheduled' ? 'blue' : d.status === 'expired' ? 'gray' : 'red'} /> },
    {
      key: 'schedule',
      header: 'Schedule',
      render: (d) => (
        <span className="text-xs text-gray-600">
          {new Date(d.startDate).toLocaleDateString('en-IN')} — {d.endDate ? new Date(d.endDate).toLocaleDateString('en-IN') : 'No end'}
        </span>
      ),
    },
    {
      key: 'usage',
      header: 'Usage',
      sortable: true,
      sortValue: (d) => d.usageCount,
      className: 'text-right',
      render: (d) => (
        <span className="text-gray-900">
          {d.usageCount}
          {d.usageLimit !== null && <span className="text-gray-400"> / {d.usageLimit}</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12 text-right',
      render: (d) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setDeleteId(d.id)
          }}
          className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
          aria-label={`Delete ${d.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Discounts"
        description="Manage promo codes, offers, and automatic discounts"
        actions={
          <Link
            href="/admin/discounts/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> New Discount
          </Link>
        }
      />
      <AdminDataTable
        data={discounts}
        columns={columns}
        getRowId={(d) => d.id}
        loading={loading}
        searchable
        searchPlaceholder="Search name or code…"
        searchFn={(d, q) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)}
        onRowClick={(d) => router.push(`/admin/discounts/${d.id}`)}
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DiscountStatus | 'all')}
              className={`${adminSelectClass} h-9 w-auto`}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DiscountType | 'all')}
              className={`${adminSelectClass} h-9 w-auto`}
              aria-label="Filter by type"
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t === 'all' ? 'All types' : DISCOUNT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
        }
        emptyState={
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Percent className="h-8 w-8" />
            <p className="text-sm font-medium">No discounts found</p>
            <Link href="/admin/discounts/new" className="text-sm font-medium text-blue-600 hover:underline">
              Create your first discount
            </Link>
          </div>
        }
      />

      <AdminConfirmDialog
        open={deleteId !== null}
        title="Delete discount?"
        description="Customers will no longer be able to use this code. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={async () => {
          if (deleteId) {
            await discountService.remove(deleteId)
            toast.success('Discount deleted')
            setDeleteId(null)
            await load()
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
