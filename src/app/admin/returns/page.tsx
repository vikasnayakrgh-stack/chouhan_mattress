'use client'

import React, { useEffect, useState } from 'react'
import { RefreshCw, Filter, ChevronLeft, Truck, CheckCircle2, XCircle, Eye, Edit } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { AdminPageHeader, AdminDataTable, AdminStatusBadge, AdminEmptyState, AdminConfirmDialog } from '@/components/admin'
import type { ColumnDef } from '@/components/admin'
import { returnService } from '@/services/returnService'
import type { Return, ReturnStatus, ReturnReason } from '@/features/returns/types'
import { RETURN_REASON_LABELS, RETURN_RESOLUTION_LABELS } from '@/features/returns/types'
import Link from 'next/link'

const STATUSES: ReturnStatus[] = ['requested', 'approved', 'received', 'inspected', 'refunded', 'rejected']
const REASONS: ReturnReason[] = ['damaged', 'defective', 'wrong_item', 'not_as_described', 'size_issue', 'comfort_issue', 'changed_mind', 'other']

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all' as ReturnStatus | 'all',
    reason: 'all' as ReturnReason | 'all',
    dateFrom: '',
    dateTo: '',
  })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; returnId: string }>({ open: false, returnId: '' })

  const load = async () => {
    setLoading(true)
    const data = await returnService.getAll()
    setReturns(data)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [filters, load])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ open: true, returnId: id })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.returnId) return
    await returnService.delete(deleteDialog.returnId)
    setDeleteDialog({ open: false, returnId: '' })
    void load()
  }

  const columns: ColumnDef<Return>[] = [
    {
      key: 'returnNumber',
      header: 'Return #',
      sortable: true,
      sortValue: (r) => r.returnNumber,
      render: (r) => (
        <Link href={`/admin/returns/${r.id}`} className="font-mono text-sm font-medium text-blue-600 hover:underline">
          {r.returnNumber}
        </Link>
      ),
    },
    {
      key: 'orderNumber',
      header: 'Order',
      sortable: true,
      sortValue: (r) => r.orderNumber,
      render: (r) => (
        <Link href={`/admin/orders/${r.orderId}`} className="font-mono text-sm text-gray-600 hover:underline">
          {r.orderNumber}
        </Link>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      sortValue: (r) => r.customerName,
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900">{r.customerName}</p>
          <p className="text-xs text-gray-500">{r.customerPhone}</p>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      sortable: true,
      sortValue: (r) => r.reason,
      render: (r) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {RETURN_REASON_LABELS[r.reason]}
        </span>
      ),
    },
    {
      key: 'resolution',
      header: 'Resolution',
      sortable: true,
      sortValue: (r) => r.resolution,
      render: (r) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {RETURN_RESOLUTION_LABELS[r.resolution]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <AdminStatusBadge status={r.status} />,
    },
    {
      key: 'refundAmount',
      header: 'Refund',
      className: 'text-right',
      sortable: true,
      sortValue: (r) => r.refundAmount,
      render: (r) => <span className="font-medium text-gray-900">{formatPrice(r.refundAmount)}</span>,
    },
    {
      key: 'createdAt',
      header: 'Requested',
      sortable: true,
      sortValue: (r) => r.createdAt,
      render: (r) => (
        <span className="text-gray-600">
          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Returns"
        description="Manage and process customer returns."
        actions={
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search return #, order #, customer..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value as ReturnStatus | 'all')}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select
          value={filters.reason}
          onChange={(e) => handleFilterChange('reason', e.target.value as ReturnReason | 'all')}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Reasons</option>
          {REASONS.map((r) => (
            <option key={r} value={r}>{RETURN_REASON_LABELS[r]}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          placeholder="From"
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          placeholder="To"
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <AdminDataTable<Return>
        data={returns}
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}
        searchPlaceholder="Search return #, order #, customer..."
        searchFn={(r, q) =>
          r.returnNumber.toLowerCase().includes(q) ||
          r.orderNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.customerPhone.includes(q)
        }
        pageSize={12}
        emptyState={<AdminEmptyState icon={Truck} title="No returns found" className="border-0" />}
      />

      <AdminConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, returnId: '' })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ open: false, returnId: '' })}
        title="Delete Return"
        description="Are you sure you want to delete this return record? This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />
    </div>
  )
}