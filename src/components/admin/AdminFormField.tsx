'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AdminFormFieldProps {
  label: string
  htmlFor?: string
  description?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

export function AdminFormField({
  label,
  htmlFor,
  description,
  error,
  required,
  className,
  children,
}: AdminFormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {children}
      {error && (
        <p className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export const adminInputClass =
  'h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-400'

export const adminTextareaClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

export const adminSelectClass =
  'h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
