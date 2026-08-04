'use client'

import React, { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { AdminPageHeader, AdminDataTable, AdminStatusBadge, AdminEmptyState } from '@/components/admin'
import type { ColumnDef } from '@/components/admin'
import { customerService } from '@/services/customerService'
import type { Customer } from '@/features/customers/types'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void customerService.getAll().then((data) => {
      setCustomers(data)
      setLoading(false)
    })
  }, [])

  const columns: ColumnDef<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      sortValue: (c) => c.name,
      render: (c) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
            {c.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
          </span>
          <div>
            <p className="font-medium text-gray-900">{c.name}</p>
            <p className="text-xs text-gray-500">{c.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (c) => <span className="text-gray-600">{c.phone}</span>,
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
      sortValue: (c) => c.city,
      render: (c) => (
        <span className="text-gray-600">
          {c.city}, {c.state}
        </span>
      ),
    },
    {
      key: 'orders',
      header: 'Orders',
      sortable: true,
      sortValue: (c) => c.ordersCount,
      render: (c) => <span className="text-gray-900">{c.ordersCount}</span>,
    },
    {
      key: 'spend',
      header: 'Total Spend',
      sortable: true,
      sortValue: (c) => c.totalSpend,
      className: 'text-right',
      render: (c) => <span className="font-medium text-gray-900">{formatPrice(c.totalSpend)}</span>,
    },
    {
      key: 'lastOrder',
      header: 'Last Order',
      sortable: true,
      sortValue: (c) => c.lastOrderDate ?? '',
      render: (c) => (
        <span className="text-gray-600">
          {c.lastOrderDate
            ? new Date(c.lastOrderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <AdminStatusBadge status={c.status} />,
    },
  ]

  return (
    <div>
      <AdminPageHeader title="Customers" description="Your customer base and their purchase history." />
      <AdminDataTable<Customer>
        data={customers}
        columns={columns}
        getRowId={(c) => c.id}
        loading={loading}
        searchPlaceholder="Search name, email, phone…"
        searchFn={(c, q) =>
          c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
        }
        pageSize={12}
        emptyState={<AdminEmptyState icon={Users} title="No customers yet" className="border-0" />}
      />
    </div>
  )
}
