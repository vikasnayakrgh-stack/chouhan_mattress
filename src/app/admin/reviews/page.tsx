'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Check, XCircle, Award, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader, AdminDataTable, AdminStatusBadge, AdminKPICard, type ColumnDef, type BulkAction } from '@/components/admin'
import { reviewService } from '@/services/reviewService'
import type { Review, ReviewStatus, ReviewStats } from '@/features/reviews/types'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={i <= rating ? 'h-3.5 w-3.5 fill-yellow-400 text-yellow-400' : 'h-3.5 w-3.5 text-gray-200'} />
      ))}
    </span>
  )
}

export default function AdminReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<ReviewStatus | 'all'>('all')
  const [rating, setRating] = useState<number | 'all'>('all')
  const [productId, setProductId] = useState<string | 'all'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const [list, st] = await Promise.all([
      reviewService.getAll({
        status,
        rating,
        productId,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
      reviewService.getStats(),
    ])
    setReviews(list)
    setStats(st)
    setLoading(false)
  }, [status, rating, productId, dateFrom, dateTo])

  useEffect(() => {
    void load()
  }, [load])

  const products = Array.from(new Map(reviews.map((r) => [r.productId, r.productName])).entries())

  const bulkActions: BulkAction[] = [
    {
      label: 'Approve',
      icon: Check,
      onClick: (ids) => {
        void reviewService.bulkApprove(ids).then((n) => {
          toast.success(`${n} reviews approved`)
          void load()
        })
      },
    },
    {
      label: 'Reject',
      icon: XCircle,
      variant: 'danger',
      onClick: (ids) => {
        void reviewService.bulkReject(ids).then((n) => {
          toast.success(`${n} reviews rejected`)
          void load()
        })
      },
    },
    {
      label: 'Feature',
      icon: Award,
      onClick: (ids) => {
        void reviewService.bulkFeature(ids).then((n) => {
          toast.success(`${n} reviews featured`)
          void load()
        })
      },
    },
  ]

  const columns: ColumnDef<Review>[] = [
    {
      key: 'review', header: 'Review', sortable: true, sortValue: (r) => r.createdAt,
      render: (r) => (
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <Stars rating={r.rating} />
            {r.featured && <Award className="h-3.5 w-3.5 text-purple-500" />}
            {r.response && <MessageSquare className="h-3.5 w-3.5 text-blue-400" />}
          </div>
          <p className="mt-0.5 font-medium text-gray-900">{r.title}</p>
          <p className="line-clamp-1 text-xs text-gray-500">{r.content}</p>
        </div>
      ),
    },
    {
      key: 'product', header: 'Product',
      render: (r) => <span className="text-sm text-gray-600">{r.productName}</span>,
    },
    {
      key: 'customer', header: 'Customer',
      render: (r) => (
        <div>
          <p className="text-sm text-gray-900">{r.customerName}</p>
          <p className="text-xs text-gray-500">{r.customerCity}{r.verifiedPurchase ? ' · Verified' : ''}</p>
        </div>
      ),
    },
    {
      key: 'date', header: 'Date', sortable: true, sortValue: (r) => r.createdAt,
      render: (r) => <span className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>,
    },
    { key: 'status', header: 'Status', render: (r) => <AdminStatusBadge status={r.status} tone={r.status === 'approved' ? 'green' : r.status === 'pending' ? 'yellow' : r.status === 'flagged' ? 'orange' : 'red'} /> },
  ]

  return (
    <div>
      <AdminPageHeader title="Reviews" description="Moderate customer reviews across all channels." />

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <AdminKPICard title="Total Reviews" value={String(stats.total)} icon={MessageSquare} />
          <AdminKPICard title="Pending" value={String(stats.pending)} icon={XCircle} />
          <AdminKPICard title="Approved" value={String(stats.approved)} icon={Check} />
          <AdminKPICard title="Average Rating" value={`${stats.averageRating} ★`} icon={Star} />
        </div>
      )}

      <AdminDataTable
        data={reviews}
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}
        selectable
        bulkActions={bulkActions}
        searchFn={(r, q) =>
          r.title.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.productName.toLowerCase().includes(q)
        }
        searchPlaceholder="Search reviews…"
        onRowClick={(r) => router.push(`/admin/reviews/${r.id}`)}
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            <select className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-gray-600" value={status} onChange={(e) => setStatus(e.target.value as ReviewStatus | 'all')}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>
            <select className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-gray-600" value={String(rating)} onChange={(e) => setRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
              <option value="all">All ratings</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>
              ))}
            </select>
            <select className="h-9 max-w-48 rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-gray-600" value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="all">All products</option>
              {products.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
            <input type="date" className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-gray-600" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <span className="text-xs text-gray-400">to</span>
            <input type="date" className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-gray-600" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        }
      />
    </div>
  )
}
