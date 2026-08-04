'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface AdminTab {
  key: string
  label: string
  count?: number
}

interface AdminTabsProps {
  tabs: AdminTab[]
  active: string
  onChange: (key: string) => void
  className?: string
}

export function AdminTabs({ tabs, active, onChange, className }: AdminTabsProps) {
  return (
    <div className={cn('border-b border-gray-200', className)}>
      <nav className="-mb-px flex flex-wrap gap-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              'whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
              active === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            )}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'ml-2 rounded-full px-2 py-0.5 text-xs',
                  active === tab.key ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
