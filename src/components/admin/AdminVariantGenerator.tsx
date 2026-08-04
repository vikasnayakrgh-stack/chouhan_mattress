'use client'

import React from 'react'
import { Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductOption } from '@/features/products/types'

const OPTION_PRESETS: { name: string; values: string[] }[] = [
  { name: 'Size', values: ['Single', 'Double', 'Queen', 'King', 'Single XL', 'King XL'] },
  { name: 'Thickness', values: ['4 inch', '5 inch', '6 inch', '8 inch', '10 inch'] },
  { name: 'Firmness', values: ['Soft', 'Medium', 'Medium-Firm', 'Firm'] },
]

interface AdminVariantGeneratorProps {
  options: ProductOption[]
  onChange: (options: ProductOption[]) => void
  onGenerate: () => void
  combinationCount: number
}

export function AdminVariantGenerator({ options, onChange, onGenerate, combinationCount }: AdminVariantGeneratorProps) {
  const toggleValue = (optionName: string, value: string) => {
    const existing = options.find((o) => o.name === optionName)
    if (!existing) {
      onChange([...options, { id: `opt-${optionName.toLowerCase()}`, name: optionName, values: [value] }])
      return
    }
    const values = existing.values.includes(value)
      ? existing.values.filter((v) => v !== value)
      : [...existing.values, value]
    onChange(
      options
        .map((o) => (o.name === optionName ? { ...o, values } : o))
        .filter((o) => o.values.length > 0)
    )
  }

  const isSelected = (optionName: string, value: string) =>
    options.find((o) => o.name === optionName)?.values.includes(value) ?? false

  return (
    <div className="space-y-4">
      {OPTION_PRESETS.map((preset) => (
        <div key={preset.name}>
          <p className="mb-2 text-sm font-medium text-gray-700">{preset.name}</p>
          <div className="flex flex-wrap gap-2">
            {preset.values.map((value) => {
              const selected = isSelected(preset.name, value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleValue(preset.name, value)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                    selected
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  )}
                  aria-pressed={selected}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
        <p className="text-sm text-gray-600">
          {combinationCount > 0 ? (
            <>
              <span className="font-semibold text-gray-900">{combinationCount}</span> variant
              {combinationCount !== 1 && 's'} will be generated
            </>
          ) : (
            'Select option values to generate variants'
          )}
        </p>
        <button
          type="button"
          onClick={onGenerate}
          disabled={combinationCount === 0}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
        >
          <Wand2 className="h-4 w-4" /> Generate Variants
        </button>
      </div>
    </div>
  )
}
