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
  trendLabel = 'vs last 30 days',
  iconClassName,
  className,
}: AdminKPICardProps) {
  const positive = trend !== undefined && trend >= 0
  return (
    <div className={cn('rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition-all hover:border-amber-500/40 relative overflow-hidden group', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">{value}</p>
        </div>
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-md group-hover:scale-110 transition-transform',
            iconClassName
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>

      {trend !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-1 font-extrabold px-2.5 py-0.5 rounded-full border text-[11px]',
              positive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            )}
          >
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? '+' : ''}
            {trend}%
          </span>
          <span className="text-slate-500 font-medium">{trendLabel}</span>
        </div>
      )}
    </div>
  )
}
