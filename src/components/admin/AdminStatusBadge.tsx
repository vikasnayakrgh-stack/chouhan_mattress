'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type BadgeTone = 'green' | 'blue' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange' | 'indigo'

const TONE_CLASSES: Record<BadgeTone, string> = {
  green: 'bg-green-50 text-green-700 ring-green-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  gray: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  purple: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  orange: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
}

const STATUS_TONES: Record<string, BadgeTone> = {
  // product
  active: 'green',
  draft: 'gray',
  archived: 'red',
  inactive: 'gray',
  blocked: 'red',
  // order
  new: 'blue',
  confirmed: 'indigo',
  processing: 'purple',
  packed: 'orange',
  shipped: 'blue',
  delivered: 'green',
  cancelled: 'red',
  returned: 'yellow',
  // payment
  paid: 'green',
  pending: 'yellow',
  cod: 'orange',
  failed: 'red',
  refunded: 'gray',
  // inventory
  in_stock: 'green',
  low_stock: 'yellow',
  out_of_stock: 'red',
  // fulfillment
  unfulfilled: 'gray',
  partially_fulfilled: 'yellow',
  fulfilled: 'green',
}

const STATUS_LABELS: Record<string, string> = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
  unfulfilled: 'Unfulfilled',
  partially_fulfilled: 'Partial',
  fulfilled: 'Fulfilled',
  cod: 'COD',
}

interface AdminStatusBadgeProps {
  status: string
  label?: string
  tone?: BadgeTone
  className?: string
}

export function AdminStatusBadge({ status, label, tone, className }: AdminStatusBadgeProps) {
  const resolvedTone = tone ?? STATUS_TONES[status] ?? 'gray'
  const resolvedLabel =
    label ?? STATUS_LABELS[status] ?? status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        TONE_CLASSES[resolvedTone],
        className
      )}
    >
      {resolvedLabel}
    </span>
  )
}
