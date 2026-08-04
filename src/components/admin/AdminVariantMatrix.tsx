'use client'

import React, { useState } from 'react'
import { Trash2, IndianRupee } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { ProductVariant } from '@/features/products/types'
import { AdminStatusBadge } from './AdminStatusBadge'

interface AdminVariantMatrixProps {
  variants: ProductVariant[]
  onChange: (variants: ProductVariant[]) => void
}

export function AdminVariantMatrix({ variants, onChange }: AdminVariantMatrixProps) {
  const [bulkMrp, setBulkMrp] = useState('')
  const [bulkPrice, setBulkPrice] = useState('')
  const [bulkStock, setBulkStock] = useState('')

  const update = (id: string, patch: Partial<ProductVariant>) => {
    onChange(
      variants.map((v) => {
        if (v.id !== id) return v
        const next = { ...v, ...patch }
        next.discountPercent = next.mrp > 0 ? Math.round(((next.mrp - next.sellingPrice) / next.mrp) * 100) : 0
        return next
      })
    )
  }

  const remove = (id: string) => onChange(variants.filter((v) => v.id !== id))

  const applyBulk = () => {
    onChange(
      variants.map((v) => {
        const next = { ...v }
        if (bulkMrp) next.mrp = Number(bulkMrp)
        if (bulkPrice) next.sellingPrice = Number(bulkPrice)
        if (bulkStock) next.stock = Number(bulkStock)
        next.discountPercent = next.mrp > 0 ? Math.round(((next.mrp - next.sellingPrice) / next.mrp) * 100) : 0
        return next
      })
    )
    setBulkMrp('')
    setBulkPrice('')
    setBulkStock('')
  }

  const stockStatus = (v: ProductVariant) => {
    if (v.stock === 0) return 'out_of_stock'
    if (v.stock <= v.lowStockThreshold) return 'low_stock'
    return 'in_stock'
  }

  if (variants.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
        No variants yet. Select options above and click “Generate Variants”.
      </p>
    )
  }

  const inputCls =
    'h-8 w-24 rounded-md border border-gray-200 px-2 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30'

  return (
    <div className="space-y-3">
      {/* Bulk edit */}
      <div className="flex flex-wrap items-end gap-2 rounded-lg bg-gray-50 p-3">
        <IndianRupee className="mb-2 h-4 w-4 text-gray-400" />
        <div>
          <label className="mb-1 block text-xs text-gray-500">Set all MRP</label>
          <input type="number" value={bulkMrp} onChange={(e) => setBulkMrp(e.target.value)} className={inputCls} placeholder="MRP" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Set all Selling</label>
          <input type="number" value={bulkPrice} onChange={(e) => setBulkPrice(e.target.value)} className={inputCls} placeholder="Price" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Set all Stock</label>
          <input type="number" value={bulkStock} onChange={(e) => setBulkStock(e.target.value)} className={inputCls} placeholder="Stock" />
        </div>
        <button
          type="button"
          onClick={applyBulk}
          className="h-8 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Apply to all
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-3 py-2.5 font-medium">Variant</th>
              <th className="px-3 py-2.5 font-medium">SKU</th>
              <th className="px-3 py-2.5 text-right font-medium">MRP (₹)</th>
              <th className="px-3 py-2.5 text-right font-medium">Selling (₹)</th>
              <th className="px-3 py-2.5 text-right font-medium">Discount</th>
              <th className="px-3 py-2.5 text-right font-medium">Stock</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {variants.map((v) => (
              <tr key={v.id}>
                <td className="px-3 py-2.5 font-medium text-gray-900">
                  {Object.values(v.optionValues).join(' / ')}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-gray-600">{v.sku}</td>
                <td className="px-3 py-2.5 text-right">
                  <input
                    type="number"
                    value={v.mrp}
                    onChange={(e) => update(v.id, { mrp: Number(e.target.value) })}
                    className={inputCls}
                    aria-label={`MRP for ${v.sku}`}
                  />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <input
                    type="number"
                    value={v.sellingPrice}
                    onChange={(e) => update(v.id, { sellingPrice: Number(e.target.value) })}
                    className={inputCls}
                    aria-label={`Selling price for ${v.sku}`}
                  />
                </td>
                <td className={cn('px-3 py-2.5 text-right font-medium', v.discountPercent > 0 ? 'text-green-600' : 'text-gray-400')}>
                  {v.discountPercent}%
                </td>
                <td className="px-3 py-2.5 text-right">
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => update(v.id, { stock: Math.max(0, Number(e.target.value)) })}
                    className={cn(inputCls, 'w-20')}
                    aria-label={`Stock for ${v.sku}`}
                  />
                </td>
                <td className="px-3 py-2.5">
                  <AdminStatusBadge status={stockStatus(v)} />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => remove(v.id)}
                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove variant ${v.sku}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        {variants.length} variant{variants.length !== 1 && 's'} · Total stock:{' '}
        {variants.reduce((s, v) => s + v.stock, 0)} units · Price range:{' '}
        {formatPrice(Math.min(...variants.map((v) => v.sellingPrice)))} –{' '}
        {formatPrice(Math.max(...variants.map((v) => v.sellingPrice)))}
      </p>
    </div>
  )
}
