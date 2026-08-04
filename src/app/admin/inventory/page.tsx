'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Boxes, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  AdminPageHeader,
  AdminDataTable,
  AdminStatusBadge,
  AdminEmptyState,
  adminSelectClass,
  adminInputClass,
} from '@/components/admin'
import type { ColumnDef } from '@/components/admin'
import { inventoryService } from '@/services/inventoryService'
import type { InventoryItem, InventoryStatus } from '@/features/inventory/types'

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | 'all'>('all')
  const [adjustTarget, setAdjustTarget] = useState<InventoryItem | null>(null)
  const [delta, setDelta] = useState('')
  const [reason, setReason] = useState('Manual recount')

  const load = useCallback(async () => {
    setLoading(true)
    const data = await inventoryService.search({ status: statusFilter })
    setItems(data)
    setLoading(false)
  }, [statusFilter])

  useEffect(() => {
    void load()
  }, [load])

  const applyAdjustment = async () => {
    if (!adjustTarget || !delta) return
    const result = await inventoryService.adjustStock({
      inventoryItemId: adjustTarget.id,
      sku: adjustTarget.sku,
      delta: Number(delta),
      reason,
      adjustedBy: 'Rahul Chouhan',
    })
    if (result) {
      toast.success(`Stock for ${adjustTarget.sku} updated to ${result.stock}`)
      void load()
    }
    setAdjustTarget(null)
    setDelta('')
    setReason('Manual recount')
  }

  const columns: ColumnDef<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      sortValue: (i) => i.sku,
      render: (i) => <span className="font-mono text-xs font-medium text-gray-900">{i.sku}</span>,
    },
    {
      key: 'product',
      header: 'Product / Variant',
      sortable: true,
      sortValue: (i) => i.productName,
      render: (i) => (
        <div>
          <p className="font-medium text-gray-900">{i.productName}</p>
          <p className="text-xs text-gray-500">{i.variantLabel}</p>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'On Hand',
      sortable: true,
      sortValue: (i) => i.stock,
      render: (i) => <span className="font-semibold text-gray-900">{i.stock}</span>,
    },
    {
      key: 'reserved',
      header: 'Reserved',
      render: (i) => <span className="text-gray-600">{i.reserved}</span>,
    },
    {
      key: 'incoming',
      header: 'Incoming',
      render: (i) => <span className="text-gray-600">{i.incoming || '—'}</span>,
    },
    {
      key: 'threshold',
      header: 'Low Stock At',
      render: (i) => <span className="text-gray-600">{i.lowStockThreshold}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (i) => <AdminStatusBadge status={i.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (i) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setAdjustTarget(i)
          }}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" />
          <Minus className="h-3 w-3" /> Adjust
        </button>
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader title="Inventory" description="Stock levels at SKU / variant level." />
      <AdminDataTable<InventoryItem>
        data={items}
        columns={columns}
        getRowId={(i) => i.id}
        loading={loading}
        searchPlaceholder="Search SKU or product…"
        searchFn={(i, q) => i.sku.toLowerCase().includes(q) || i.productName.toLowerCase().includes(q)}
        pageSize={15}
        toolbar={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InventoryStatus | 'all')}
            className={`${adminSelectClass} h-9 w-auto`}
            aria-label="Filter by stock status"
          >
            <option value="all">All statuses</option>
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        }
        emptyState={<AdminEmptyState icon={Boxes} title="No inventory items" className="border-0" />}
      />

      {/* Adjustment dialog */}
      {adjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setAdjustTarget(null)} aria-hidden="true" />
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">Adjust stock</h3>
            <p className="mt-1 text-sm text-gray-500">
              {adjustTarget.sku} · current: <span className="font-semibold">{adjustTarget.stock}</span>
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="adj-delta" className="mb-1 block text-sm font-medium text-gray-700">
                  Change (+/−)
                </label>
                <input
                  id="adj-delta"
                  type="number"
                  value={delta}
                  onChange={(e) => setDelta(e.target.value)}
                  className={adminInputClass}
                  placeholder="e.g. 10 or -5"
                />
              </div>
              <div>
                <label htmlFor="adj-reason" className="mb-1 block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <select id="adj-reason" value={reason} onChange={(e) => setReason(e.target.value)} className={adminSelectClass}>
                  {['Manual recount', 'New stock received', 'Damaged goods', 'Return restocked', 'Correction'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAdjustTarget(null)}
                className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void applyAdjustment()}
                disabled={!delta}
                className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
