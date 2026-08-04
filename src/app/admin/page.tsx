'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IndianRupee,
  ShoppingCart,
  Receipt,
  Users,
  Clock,
  AlertTriangle,
  PackageX,
  RotateCcw,
} from 'lucide-react'
import { formatPrice, formatNumber } from '@/lib/utils'
import { AdminPageHeader, AdminKPICard, AdminStatusBadge } from '@/components/admin'
import type { DashboardStats } from '@/features/admin/types'
import type { Order } from '@/features/orders/types'
import DashboardCharts from './dashboard-charts'

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white" />
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/admin/dashboard').then((r) => r.json()),
      fetch('/api/admin/orders?limit=6').then((r) => r.json()),
    ])
      .then(async ([dashRes, ordRes]) => {
        if (cancelled) return
        if (dashRes.success) setStats(dashRes.data)
        if (ordRes.success) setRecentOrders((ordRes.data ?? []).slice(0, 6))
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  if (loading || !stats) return <DashboardSkeleton />

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your store performance — last 30 days."
      />

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminKPICard title="Total Sales" value={formatPrice(stats.kpis.totalSales)} icon={IndianRupee} trend={stats.kpis.salesTrend} />
        <AdminKPICard title="Total Orders" value={formatNumber(stats.kpis.totalOrders)} icon={ShoppingCart} trend={stats.kpis.ordersTrend} />
        <AdminKPICard title="Avg. Order Value" value={formatPrice(stats.kpis.averageOrderValue)} icon={Receipt} trend={stats.kpis.aovTrend} />
        <AdminKPICard title="Total Customers" value={formatNumber(stats.kpis.totalCustomers)} icon={Users} trend={stats.kpis.customersTrend} />
      </div>

      {/* Secondary info */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Pending Orders', value: stats.kpis.pendingOrders, Icon: Clock, cls: 'bg-blue-50 text-blue-600' },
          { label: 'Low Stock', value: stats.kpis.lowStockCount, Icon: AlertTriangle, cls: 'bg-yellow-50 text-yellow-600' },
          { label: 'Out of Stock', value: stats.kpis.outOfStockCount, Icon: PackageX, cls: 'bg-red-50 text-red-600' },
          { label: 'Returns', value: stats.kpis.returnsCount, Icon: RotateCcw, cls: 'bg-purple-50 text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.cls}`}>
              <s.Icon className="h-[18px] w-[18px]" />
            </span>
            <div>
              <p className="text-lg font-semibold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <DashboardCharts stats={stats} />

      {/* Tables row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Recent orders */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Order</th>
                  <th className="px-5 py-2.5 font-medium">Customer</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium">Payment</th>
                  <th className="px-5 py-2.5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-blue-600 hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{o.customerName}</td>
                    <td className="px-5 py-3">
                      <AdminStatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3">
                      <AdminStatusBadge status={o.paymentStatus} />
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products + low stock */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Top Selling Products</h2>
            <ul className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <li key={p.productId} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.unitsSold} units</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{formatPrice(p.revenue)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Low Stock Alert</h2>
            <ul className="space-y-3">
              {stats.lowStockAlerts.map((a) => (
                <li key={a.sku} className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{a.productName}</p>
                    <p className="truncate text-xs text-gray-500">
                      {a.variantLabel} · {a.sku}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-red-600">{a.stock} left</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
