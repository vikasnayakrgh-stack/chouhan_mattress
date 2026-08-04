'use client'

import React, { useState } from 'react'
import { adminInputClass, AdminFormField } from './AdminFormField'
import type { CustomerAddress } from '@/features/customers/types'

export type AddressFormValues = Omit<CustomerAddress, 'id'>

interface AdminAddressFormProps {
  initial?: CustomerAddress
  onSave: (values: AddressFormValues) => void
  onCancel: () => void
}

export function AdminAddressForm({ initial, onSave, onCancel }: AdminAddressFormProps) {
  const [values, setValues] = useState<AddressFormValues>({
    label: initial?.label ?? 'Home',
    name: initial?.name ?? '',
    phone: initial?.phone ?? '',
    line1: initial?.line1 ?? '',
    line2: initial?.line2 ?? '',
    city: initial?.city ?? '',
    state: initial?.state ?? '',
    pincode: initial?.pincode ?? '',
    country: initial?.country ?? 'India',
    isDefaultShipping: initial?.isDefaultShipping ?? false,
    isDefaultBilling: initial?.isDefaultBilling ?? false,
  })

  const set = <K extends keyof AddressFormValues>(key: K, value: AddressFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const valid = values.name && values.phone && values.line1 && values.city && values.state && values.pincode

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onSave(values)
      }}
      className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AdminFormField label="Label">
          <input className={adminInputClass} value={values.label} onChange={(e) => set('label', e.target.value)} placeholder="Home / Office" />
        </AdminFormField>
        <AdminFormField label="Full Name" required>
          <input className={adminInputClass} value={values.name} onChange={(e) => set('name', e.target.value)} />
        </AdminFormField>
        <AdminFormField label="Phone" required>
          <input className={adminInputClass} value={values.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 …" />
        </AdminFormField>
        <AdminFormField label="Pincode" required>
          <input className={adminInputClass} value={values.pincode} onChange={(e) => set('pincode', e.target.value)} />
        </AdminFormField>
      </div>
      <AdminFormField label="Address Line 1" required>
        <input className={adminInputClass} value={values.line1} onChange={(e) => set('line1', e.target.value)} />
      </AdminFormField>
      <AdminFormField label="Address Line 2">
        <input className={adminInputClass} value={values.line2 ?? ''} onChange={(e) => set('line2', e.target.value)} />
      </AdminFormField>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AdminFormField label="City" required>
          <input className={adminInputClass} value={values.city} onChange={(e) => set('city', e.target.value)} />
        </AdminFormField>
        <AdminFormField label="State" required>
          <input className={adminInputClass} value={values.state} onChange={(e) => set('state', e.target.value)} />
        </AdminFormField>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={values.isDefaultShipping} onChange={(e) => set('isDefaultShipping', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          Default shipping
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={values.isDefaultBilling} onChange={(e) => set('isDefaultBilling', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          Default billing
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={!valid} className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          Save Address
        </button>
      </div>
    </form>
  )
}
