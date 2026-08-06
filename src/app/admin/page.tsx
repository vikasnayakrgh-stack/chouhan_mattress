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
  Plus,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  PackageCheck,
  Zap,
} from 'lucide-react'
import { formatPrice, formatNumber } from '@/lib/utils'
import { AdminPageHeader, AdminKPICard, AdminStatusBadge } from '@/components/admin'
import type { DashboardStats } from '@/features/admin/types'
import type { Order } from '@/features/orders/types'
import DashboardCharts from './dashboard-charts'

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-slate-800 animate-pulse rounded-lg" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = () => {
    setLoading(true)
    setError(null)
    Promise.all([
      fetch('/api/admin/dashboard').then((r) => r.json()),
      fetch('/api/admin/orders?limit=6').then((r) => r.json()),
    ])
      .then(([dashRes, ordRes]) => {
        if (dashRes.success) setStats(dashRes.data)
        if (ordRes.success) setRecentOrders((ordRes.data ?? []).slice(0, 6))
      })
      .catch((err) => {
        setError('Failed to sync live metrics from server. Check database connection.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) return <DashboardSkeleton />

  if (error || !stats) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-slate-900 p-8 text-center max-w-xl mx-auto my-12 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Metrics Connection Error</h3>
        <p className="text-xs text-slate-400 mb-6">{error || 'Unable to retrieve dashboard metrics.'}</p>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Sync</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header & Quick Action Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Zap className="w-3 h-3" /> Live Operating Metrics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Executive Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Real-time performance telemetry for Chouhan Mattress — Last 30 Days
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-amber-400" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* Primary Executive KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminKPICard title="Total Sales" value={formatPrice(stats.kpis.totalSales)} icon={IndianRupee} trend={stats.kpis.salesTrend} />
        <AdminKPICard title="Total Orders" value={formatNumber(stats.kpis.totalOrders)} icon={ShoppingCart} trend={stats.kpis.ordersTrend} />
        <AdminKPICard title="Avg. Order Value" value={formatPrice(stats.kpis.averageOrderValue)} icon={Receipt} trend={stats.kpis.aovTrend} />
        <AdminKPICard title="Total Customers" value={formatNumber(stats.kpis.totalCustomers)} icon={Users} trend={stats.kpis.customersTrend} />
      </div>

      {/* Operational Quick Status Bar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Pending Dispatch', value: stats.kpis.pendingOrders, Icon: Clock, cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
          { label: 'Low Stock SKU', value: stats.kpis.lowStockCount, Icon: AlertTriangle, cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
          { label: 'Out of Stock', value: stats.kpis.outOfStockCount, Icon: PackageX, cls: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
          { label: 'Pending Returns', value: stats.kpis.returnsCount, Icon: RotateCcw, cls: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3.5 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-md">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${s.cls}`}>
              <s.Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-extrabold text-white font-mono">{s.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <DashboardCharts stats={stats} />

      {/* Action Tables & Inventory Widgets */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Orders Stream */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-extrabold text-white">Recent Orders Stream</h2>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-extrabold">Order</th>
                  <th className="px-5 py-3.5 font-extrabold">Customer</th>
                  <th className="px-5 py-3.5 font-extrabold">Fulfillment Status</th>
                  <th className="px-5 py-3.5 font-extrabold">Payment</th>
                  <th className="px-5 py-3.5 text-right font-extrabold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/orders/${o.id}`} className="font-extrabold text-amber-400 hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-200 font-bold">{o.customerName}</td>
                    <td className="px-5 py-4">
                      <AdminStatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-4">
                      <AdminStatusBadge status={o.paymentStatus} />
                    </td>
                    <td className="px-5 py-4 text-right font-extrabold text-white font-mono">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products & Low Stock Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">Top Selling Products</h2>
            </div>
            <ul className="space-y-3.5">
              {stats.topProducts.map((p, i) => (
                <li key={p.productId} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-extrabold text-amber-400">
                    #{i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white">{p.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{p.unitsSold} units sold</p>
                  </div>
                  <span className="text-xs font-extrabold text-amber-400 font-mono">{formatPrice(p.revenue)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">Low Stock Inventory Alerts</h2>
            </div>
            <ul className="space-y-3.5">
              {stats.lowStockAlerts.map((a) => (
                <li key={a.sku} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white">{a.productName}</p>
                    <p className="truncate text-[11px] text-slate-400 font-mono">
                      {a.variantLabel} · {a.sku}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30 font-mono">
                    {a.stock} Left
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
