'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserX, Plus, Pencil, Trash2, ShoppingBag, StickyNote, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'
import {
  AdminPageHeader,
  AdminStatusBadge,
  AdminEmptyState,
  AdminDataTable,
  AdminTabs,
  AdminAddressForm,
  AdminNoteEditor,
  AdminConfirmDialog,
  type ColumnDef,
  type AddressFormValues,
} from '@/components/admin'
import { customerService, type CustomerWithDetails } from '@/services/customerService'
import type { CustomerAddress } from '@/features/customers/types'
import type { Order } from '@/features/orders/types'
import type { Return } from '@/features/returns/types'
import { RETURN_REASON_LABELS } from '@/features/returns/types'

type TabKey = 'profile' | 'addresses' | 'orders' | 'returns' | 'notes' | 'timeline'

interface TimelineEntry {
  id: string
  kind: 'order' | 'return' | 'note'
  title: string
  description: string
  timestamp: string
  href?: string
}

export default function AdminCustomerDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [details, setDetails] = useState<CustomerWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabKey>('profile')
  const [addressFormOpen, setAddressFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null)
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!params?.id) return
    const d = await customerService.getCustomerWithDetails(params.id)
    setDetails(d)
    setLoading(false)
  }, [params?.id])

  useEffect(() => {
    void load()
  }, [load])

  const timeline = useMemo<TimelineEntry[]>(() => {
    if (!details) return []
    const entries: TimelineEntry[] = [
      ...details.orders.map((o) => ({
        id: `order-${o.id}`,
        kind: 'order' as const,
        title: `Order ${o.orderNumber} placed`,
        description: `${o.items.length} item(s) · ${formatPrice(o.total)} · ${o.status}`,
        timestamp: o.createdAt,
        href: `/admin/orders/${o.id}`,
      })),
      ...details.returns.map((r) => ({
        id: `return-${r.id}`,
        kind: 'return' as const,
        title: `Return ${r.returnNumber} requested`,
        description: `${RETURN_REASON_LABELS[r.reason]} · ${formatPrice(r.refundAmount)} · ${r.status}`,
        timestamp: r.createdAt,
        href: `/admin/returns/${r.id}`,
      })),
      ...details.customer.notes.map((n) => ({
        id: `note-${n.id}`,
        kind: 'note' as const,
        title: `Note by ${n.author}`,
        description: n.content,
        timestamp: n.createdAt,
      })),
    ]
    return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  }, [details])

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl border border-gray-200 bg-white" />
  }

  if (!details) {
    return (
      <AdminEmptyState
        icon={UserX}
        title="Customer not found"
        action={
          <Link href="/admin/customers" className="text-sm font-medium text-blue-600 hover:underline">
            Back to customers
          </Link>
        }
      />
    )
  }

  const { customer, orders, returns, lifetimeValue } = details

  const saveAddress = async (values: AddressFormValues) => {
    if (editingAddress) {
      await customerService.updateAddress(customer.id, editingAddress.id, values)
      toast.success('Address updated')
    } else {
      await customerService.addAddress(customer.id, values)
      toast.success('Address added')
    }
    setAddressFormOpen(false)
    setEditingAddress(null)
    await load()
  }

  const orderColumns: ColumnDef<Order>[] = [
    {
      key: 'orderNumber',
      header: 'Order',
      sortable: true,
      sortValue: (o) => o.orderNumber,
      render: (o) => <span className="font-medium text-gray-900">{o.orderNumber}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      sortValue: (o) => o.createdAt,
      render: (o) => <span className="text-gray-600">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>,
    },
    { key: 'status', header: 'Status', render: (o) => <AdminStatusBadge status={o.status} /> },
    { key: 'payment', header: 'Payment', render: (o) => <AdminStatusBadge status={o.paymentStatus} /> },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      sortValue: (o) => o.total,
      className: 'text-right',
      render: (o) => <span className="font-medium text-gray-900">{formatPrice(o.total)}</span>,
    },
  ]

  const returnColumns: ColumnDef<Return>[] = [
    {
      key: 'returnNumber',
      header: 'Return',
      render: (r) => <span className="font-medium text-gray-900">{r.returnNumber}</span>,
    },
    { key: 'order', header: 'Order', render: (r) => <span className="text-gray-600">{r.orderNumber}</span> },
    { key: 'reason', header: 'Reason', render: (r) => <span className="text-gray-600">{RETURN_REASON_LABELS[r.reason]}</span> },
    { key: 'status', header: 'Status', render: (r) => <AdminStatusBadge status={r.status} /> },
    {
      key: 'amount',
      header: 'Refund',
      className: 'text-right',
      render: (r) => <span className="font-medium text-gray-900">{formatPrice(r.refundAmount)}</span>,
    },
  ]

  return (
    <div className="space-y-5">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>

      <AdminPageHeader
        title={customer.name}
        description={`Customer since ${new Date(customer.createdAt).toLocaleDateString('en-IN')}`}
        actions={<AdminStatusBadge status={customer.status} />}
      />

      {/* Lifetime value KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: 'Total Spend', value: formatPrice(lifetimeValue.totalSpend) },
          { label: 'Orders', value: String(lifetimeValue.orderCount) },
          { label: 'Avg Order Value', value: formatPrice(lifetimeValue.averageOrderValue) },
          { label: 'First Order', value: lifetimeValue.firstOrderDate ? new Date(lifetimeValue.firstOrderDate).toLocaleDateString('en-IN') : '—' },
          { label: 'Last Order', value: lifetimeValue.lastOrderDate ? new Date(lifetimeValue.lastOrderDate).toLocaleDateString('en-IN') : '—' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{kpi.label}</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <AdminTabs
        tabs={[
          { key: 'profile', label: 'Profile' },
          { key: 'addresses', label: 'Addresses', count: customer.addresses.length },
          { key: 'orders', label: 'Orders', count: orders.length },
          { key: 'returns', label: 'Returns', count: returns.length },
          { key: 'notes', label: 'Notes', count: customer.notes.length },
          { key: 'timeline', label: 'Timeline' },
        ]}
        active={tab}
        onChange={(k) => setTab(k as TabKey)}
      />

      {tab === 'profile' && (
        <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-blue-600">
              {customer.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
            </span>
            <div>
              <p className="text-base font-semibold text-gray-900">{customer.name}</p>
              <p className="text-sm text-gray-500">{customer.city}, {customer.state}</p>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-gray-500">Email</dt><dd className="mt-0.5 font-medium text-gray-900">{customer.email}</dd></div>
            <div><dt className="text-gray-500">Phone</dt><dd className="mt-0.5 font-medium text-gray-900">{customer.phone}</dd></div>
            <div><dt className="text-gray-500">Status</dt><dd className="mt-0.5"><AdminStatusBadge status={customer.status} /></dd></div>
            <div><dt className="text-gray-500">Created</dt><dd className="mt-0.5 font-medium text-gray-900">{new Date(customer.createdAt).toLocaleDateString('en-IN')}</dd></div>
          </dl>
        </div>
      )}

      {tab === 'addresses' && (
        <div className="space-y-4">
          {!addressFormOpen && (
            <button
              type="button"
              onClick={() => {
                setEditingAddress(null)
                setAddressFormOpen(true)
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Add Address
            </button>
          )}
          {addressFormOpen && (
            <AdminAddressForm
              initial={editingAddress ?? undefined}
              onSave={(v) => void saveAddress(v)}
              onCancel={() => {
                setAddressFormOpen(false)
                setEditingAddress(null)
              }}
            />
          )}
          {customer.addresses.length === 0 && !addressFormOpen ? (
            <p className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">No addresses saved</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {customer.addresses.map((addr) => (
                <div key={addr.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{addr.label}</span>
                      {addr.isDefaultShipping && <AdminStatusBadge status="default_shipping" label="Default Shipping" tone="blue" />}
                      {addr.isDefaultBilling && <AdminStatusBadge status="default_billing" label="Default Billing" tone="purple" />}
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddress(addr)
                          setAddressFormOpen(true)
                        }}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Edit address"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteAddressId(addr.id)}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete address"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <address className="text-sm not-italic text-gray-600">
                    {addr.name} · {addr.phone}<br />
                    {addr.line1}{addr.line2 && <>, {addr.line2}</>}<br />
                    {addr.city}, {addr.state} {addr.pincode}, {addr.country}
                  </address>
                  <div className="mt-3 flex gap-3 text-xs">
                    {!addr.isDefaultShipping && (
                      <button
                        type="button"
                        onClick={async () => {
                          await customerService.setDefaultAddress(customer.id, addr.id, 'shipping')
                          toast.success('Default shipping updated')
                          await load()
                        }}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Set default shipping
                      </button>
                    )}
                    {!addr.isDefaultBilling && (
                      <button
                        type="button"
                        onClick={async () => {
                          await customerService.setDefaultAddress(customer.id, addr.id, 'billing')
                          toast.success('Default billing updated')
                          await load()
                        }}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Set default billing
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <AdminDataTable
          data={orders}
          columns={orderColumns}
          getRowId={(o) => o.id}
          searchable={false}
          onRowClick={(o) => router.push(`/admin/orders/${o.id}`)}
          emptyState={
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ShoppingBag className="h-6 w-6" />
              <p className="text-sm">No orders yet</p>
            </div>
          }
        />
      )}

      {tab === 'returns' && (
        <AdminDataTable
          data={returns}
          columns={returnColumns}
          getRowId={(r) => r.id}
          searchable={false}
          onRowClick={(r) => router.push(`/admin/returns/${r.id}`)}
          emptyState={
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <RotateCcw className="h-6 w-6" />
              <p className="text-sm">No returns</p>
            </div>
          }
        />
      )}

      {tab === 'notes' && (
        <div className="max-w-2xl">
          <AdminNoteEditor
            notes={customer.notes}
            onAdd={async (content) => {
              await customerService.addNote(customer.id, content)
              toast.success('Note added')
              await load()
            }}
            onUpdate={async (noteId, content) => {
              await customerService.updateNote(customer.id, noteId, content)
              toast.success('Note updated')
              await load()
            }}
            onDelete={async (noteId) => {
              await customerService.deleteNote(customer.id, noteId)
              toast.success('Note deleted')
              await load()
            }}
          />
        </div>
      )}

      {tab === 'timeline' && (
        <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-5">
          {timeline.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No activity yet</p>
          ) : (
            <ol className="space-y-4">
              {timeline.map((entry) => (
                <li key={entry.id} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    {entry.kind === 'order' && <ShoppingBag className="h-3.5 w-3.5" />}
                    {entry.kind === 'return' && <RotateCcw className="h-3.5 w-3.5" />}
                    {entry.kind === 'note' && <StickyNote className="h-3.5 w-3.5" />}
                  </span>
                  <div>
                    {entry.href ? (
                      <Link href={entry.href} className="text-sm font-medium text-blue-600 hover:underline">
                        {entry.title}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{entry.title}</p>
                    )}
                    <p className="text-xs text-gray-500">{entry.description}</p>
                    <p className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString('en-IN')}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      <AdminConfirmDialog
        open={deleteAddressId !== null}
        title="Delete address?"
        description="This will permanently remove the address from the customer's profile."
        confirmLabel="Delete"
        onConfirm={async () => {
          if (deleteAddressId) {
            await customerService.deleteAddress(customer.id, deleteAddressId)
            toast.success('Address deleted')
            setDeleteAddressId(null)
            await load()
          }
        }}
        onCancel={() => setDeleteAddressId(null)}
      />
    </div>
  )
}
