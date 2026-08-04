'use client'

import React, { useState } from 'react'
import {
  AdminFormField,
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from '@/components/admin'
import type { Discount, DiscountType, CustomerGroup } from '@/features/discounts/types'
import { DISCOUNT_TYPE_LABELS } from '@/features/discounts/types'
import type { DiscountDraft } from '@/services/discountService'

const CUSTOMER_GROUPS: Array<{ value: CustomerGroup; label: string }> = [
  { value: 'all', label: 'All customers' },
  { value: 'first_order', label: 'First order only' },
  { value: 'returning', label: 'Returning customers' },
  { value: 'vip', label: 'VIP customers' },
]

interface DiscountFormProps {
  initial?: Discount
  submitLabel: string
  onSubmit: (draft: DiscountDraft) => void
}

export function DiscountForm({ initial, submitLabel, onSubmit }: DiscountFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [code, setCode] = useState(initial?.code ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [type, setType] = useState<DiscountType>(initial?.type ?? 'percentage')
  const [value, setValue] = useState(String(initial?.value ?? ''))
  const [minOrderValue, setMinOrderValue] = useState(initial?.condition.minOrderValue ? String(initial.condition.minOrderValue) : '')
  const [categoryIds, setCategoryIds] = useState((initial?.condition.categoryIds ?? []).join(', '))
  const [productIds, setProductIds] = useState((initial?.condition.productIds ?? []).join(', '))
  const [customerGroup, setCustomerGroup] = useState<CustomerGroup>(initial?.condition.customerGroup ?? 'all')
  const [startDate, setStartDate] = useState(initial?.startDate ?? new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(initial?.endDate ?? '')
  const [usageLimit, setUsageLimit] = useState(initial?.usageLimit !== null && initial?.usageLimit !== undefined ? String(initial.usageLimit) : '')
  const [perCustomerLimit, setPerCustomerLimit] = useState(initial?.perCustomerLimit !== null && initial?.perCustomerLimit !== undefined ? String(initial.perCustomerLimit) : '')
  const [stackable, setStackable] = useState(initial?.stackable ?? false)
  const [oncePerCustomer, setOncePerCustomer] = useState(initial?.oncePerCustomer ?? false)

  const needsValue = type === 'percentage' || type === 'fixed'
  const valid = name.trim() && code.trim() && startDate && (!needsValue || Number(value) > 0)

  const parseList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      type,
      value: needsValue ? Number(value) : 0,
      minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
      categoryIds: parseList(categoryIds).length > 0 ? parseList(categoryIds) : undefined,
      productIds: parseList(productIds).length > 0 ? parseList(productIds) : undefined,
      customerGroup,
      startDate,
      endDate: endDate || null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      perCustomerLimit: perCustomerLimit ? Number(perCustomerLimit) : null,
      stackable,
      oncePerCustomer,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {/* Basics */}
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Basics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Name" required>
            <input className={adminInputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Monsoon Sale" />
          </AdminFormField>
          <AdminFormField label="Code" required description="Customers enter this at checkout">
            <input className={`${adminInputClass} font-mono uppercase`} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="MONSOON25" />
          </AdminFormField>
          <AdminFormField label="Type" required>
            <select className={adminSelectClass} value={type} onChange={(e) => setType(e.target.value as DiscountType)}>
              {(Object.keys(DISCOUNT_TYPE_LABELS) as DiscountType[]).map((t) => (
                <option key={t} value={t}>{DISCOUNT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </AdminFormField>
          {needsValue && (
            <AdminFormField label={type === 'percentage' ? 'Value (%)' : 'Value (₹)'} required>
              <input type="number" min={1} max={type === 'percentage' ? 100 : undefined} className={adminInputClass} value={value} onChange={(e) => setValue(e.target.value)} />
            </AdminFormField>
          )}
        </div>
        <div className="mt-4">
          <AdminFormField label="Description">
            <textarea className={adminTextareaClass} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </AdminFormField>
        </div>
      </section>

      {/* Conditions */}
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Conditions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Minimum Order Value (₹)">
            <input type="number" min={0} className={adminInputClass} value={minOrderValue} onChange={(e) => setMinOrderValue(e.target.value)} placeholder="No minimum" />
          </AdminFormField>
          <AdminFormField label="Customer Group">
            <select className={adminSelectClass} value={customerGroup} onChange={(e) => setCustomerGroup(e.target.value as CustomerGroup)}>
              {CUSTOMER_GROUPS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </AdminFormField>
          <AdminFormField label="Category IDs" description="Comma-separated; empty = all categories">
            <input className={adminInputClass} value={categoryIds} onChange={(e) => setCategoryIds(e.target.value)} placeholder="cat-mattress, cat-pillows" />
          </AdminFormField>
          <AdminFormField label="Product IDs" description="Comma-separated; empty = all products">
            <input className={adminInputClass} value={productIds} onChange={(e) => setProductIds(e.target.value)} placeholder="prod-001, prod-002" />
          </AdminFormField>
        </div>
      </section>

      {/* Schedule */}
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Schedule &amp; Limits</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Start Date" required>
            <input type="date" className={adminInputClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </AdminFormField>
          <AdminFormField label="End Date" description="Leave empty for no end date">
            <input type="date" className={adminInputClass} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </AdminFormField>
          <AdminFormField label="Total Usage Limit" description="Empty = unlimited">
            <input type="number" min={1} className={adminInputClass} value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} />
          </AdminFormField>
          <AdminFormField label="Per-Customer Limit" description="Empty = unlimited">
            <input type="number" min={1} className={adminInputClass} value={perCustomerLimit} onChange={(e) => setPerCustomerLimit(e.target.value)} />
          </AdminFormField>
        </div>
      </section>

      {/* Advanced */}
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Advanced</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={stackable} onChange={(e) => setStackable(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            Stackable with other discounts
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={oncePerCustomer} onChange={(e) => setOncePerCustomer(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            Once per customer
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!valid}
          className="h-10 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
