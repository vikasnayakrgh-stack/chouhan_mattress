'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import {
  AdminPageHeader,
  AdminDataTable,
  AdminStatusBadge,
  AdminEmptyState,
  adminSelectClass,
} from '@/components/admin'
import type { ColumnDef } from '@/components/admin'
import { orderService } from '@/services/orderService'
import type { Order, OrderStatus, PaymentStatus } from '@/features/orders/types'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all')

  const load = useCallback(async () => {
    setLoading(true)
    const data = await orderService.search({ status: statusFilter, paymentStatus: paymentFilter })
    setOrders(data)
    setLoading(false)
  }, [statusFilter, paymentFilter])

  useEffect(() => {
    void load()
  }, [load])

  const columns: ColumnDef<Order>[] = [
    {
      key: 'orderNumber',
      header: 'Order',
      sortable: true,
      sortValue: (o) => o.orderNumber,
      render: (o) => <span className="font-medium text-blue-600">{o.orderNumber}</span>,
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      sortValue: (o) => o.customerName,
      render: (o) => (
        <div>
          <p className="font-medium text-gray-900">{o.customerName}</p>
          <p className="text-xs text-gray-500">{o.customerPhone}</p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      sortValue: (o) => o.createdAt,
      render: (o) => (
        <span className="text-gray-600">
          {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (o) => <span className="text-gray-600">{o.items.reduce((s, i) => s + i.quantity, 0)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (o) => <AdminStatusBadge status={o.status} />,
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (o) => <AdminStatusBadge status={o.paymentStatus} />,
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      sortValue: (o) => o.total,
      className: 'text-right',
      render: (o) => <span className="font-medium text-gray-900">{formatPrice(o.total)}</span>,
    },
  ]

  return (
    <div>
      <AdminPageHeader title="Orders" description="Manage and fulfil customer orders." />
      <AdminDataTable<Order>
        data={orders}
        columns={columns}
        getRowId={(o) => o.id}
        loading={loading}
        searchPlaceholder="Search order #, customer…"
        searchFn={(o, q) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
        }
        onRowClick={(o) => router.push(`/admin/orders/${o.id}`)}
        pageSize={12}
        toolbar={
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className={`${adminSelectClass} h-9 w-auto`}
              aria-label="Filter by order status"
            >
              <option value="all">All statuses</option>
              {(['new', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'] as const).map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | 'all')}
              className={`${adminSelectClass} h-9 w-auto`}
              aria-label="Filter by payment status"
            >
              <option value="all">All payments</option>
              {(['paid', 'pending', 'cod', 'failed', 'refunded'] as const).map((p) => (
                <option key={p} value={p}>{p === 'cod' ? 'COD' : p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
        }
        emptyState={<AdminEmptyState icon={ShoppingCart} title="No orders found" className="border-0" />}
      />
    </div>
  )
}
