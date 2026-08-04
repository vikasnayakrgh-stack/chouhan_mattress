'use client'

import React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DateRangePreset, ComparisonPeriod } from '@/features/analytics/types'

const PRESETS: { key: DateRangePreset; label: string }[] = [
  { key: 'last_7_days', label: 'Last 7 days' },
  { key: 'last_30_days', label: 'Last 30 days' },
  { key: 'last_90_days', label: 'Last 90 days' },
  { key: 'this_year', label: 'This year' },
]

const COMPARISONS: { key: ComparisonPeriod; label: string }[] = [
  { key: 'previous_period', label: 'vs previous period' },
  { key: 'wow', label: 'vs last week (WoW)' },
  { key: 'yoy', label: 'vs last year (YoY)' },
]

interface AdminDateRangePickerProps {
  preset: DateRangePreset
  comparison: ComparisonPeriod
  onPresetChange: (preset: DateRangePreset) => void
  onComparisonChange: (comparison: ComparisonPeriod) => void
  className?: string
}

export function AdminDateRangePicker({ preset, comparison, onPresetChange, onComparisonChange, className }: AdminDateRangePickerProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
        <span className="flex h-9 items-center border-r border-gray-200 bg-gray-50 px-2.5 text-gray-400">
          <Calendar className="h-4 w-4" />
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onPresetChange(p.key)}
            className={cn(
              'h-9 px-3 text-sm font-medium transition-colors',
              preset === p.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <select
        value={comparison}
        onChange={(e) => onComparisonChange(e.target.value as ComparisonPeriod)}
        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {COMPARISONS.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  )
}
