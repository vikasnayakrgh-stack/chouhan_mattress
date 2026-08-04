'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdminStatusBadge } from './AdminStatusBadge'

interface AdminStatusTransitionProps<S extends string> {
  currentStatus: S
  validTransitions: S[]
  onTransition: (next: S) => void
  disabled?: boolean
  className?: string
}

export function AdminStatusTransition<S extends string>({
  currentStatus,
  validTransitions,
  onTransition,
  disabled = false,
  className,
}: AdminStatusTransitionProps<S>) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <AdminStatusBadge status={currentStatus} />
      {validTransitions.length > 0 && <ChevronRight className="h-4 w-4 text-gray-300" />}
      {validTransitions.map((next) => (
        <button
          key={next}
          type="button"
          disabled={disabled}
          onClick={() => onTransition(next)}
          className={cn(
            'inline-flex h-8 items-center rounded-lg border px-3 text-sm font-medium transition-colors disabled:opacity-50',
            next === 'cancelled' || next === 'rejected'
              ? 'border-red-200 bg-white text-red-600 hover:bg-red-50'
              : 'border-blue-200 bg-white text-blue-600 hover:bg-blue-50'
          )}
        >
          Mark {next.charAt(0).toUpperCase() + next.slice(1)}
        </button>
      ))}
    </div>
  )
}
