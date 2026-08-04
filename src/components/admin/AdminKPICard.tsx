'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminKPICardProps {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  trend?: number
  trendLabel?: string
  iconClassName?: string
  className?: string
}

export function AdminKPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs last period',
  iconClassName,
  className,
}: AdminKPICardProps) {
  const positive = trend !== undefined && trend >= 0
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
        </div>
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600',
            iconClassName
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {trend !== undefined && (
        <p className="mt-3 flex items-center gap-1 text-xs text-gray-500">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-medium',
              positive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {positive ? '+' : ''}
            {trend}%
          </span>
          {trendLabel}
        </p>
      )}
    </div>
  )
}
