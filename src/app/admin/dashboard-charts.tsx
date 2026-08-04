'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { formatPrice } from '@/lib/utils'

const PIE_COLORS = ['#3b82f6', '#6366f1', '#a855f7', '#f97316', '#0ea5e9', '#22c55e', '#ef4444', '#eab308']

interface DashboardChartsProps {
  stats: {
    salesOverTime: Array<{ date: string; sales: number }>
    orderStatusDistribution: Array<{ status: string; count: number }>
  }
}

export default function DashboardCharts({ stats }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="rounded-xl border border-gray-200 bg-white p-5 xl:col-span-2">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Sales Overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.salesOverTime} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={(d: string) => d.slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={(v: number) => `₹${Math.round(v / 1000)}k`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={(value: number | string) => formatPrice(Number(value))} labelStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fill="url(#salesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Order Status Distribution</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.orderStatusDistribution}
                dataKey="count"
                nameKey="status"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {stats.orderStatusDistribution.map((entry, i) => (
                  <Cell key={entry.status} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}