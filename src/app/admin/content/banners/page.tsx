'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  AdminPageHeader,
  AdminDataTable,
  AdminStatusBadge,
  AdminConfirmDialog,
  AdminFormField,
  adminInputClass,
  adminSelectClass,
  type ColumnDef,
} from '@/components/admin'
import { cmsService } from '@/services/cmsService'
import type { BannerContent, BannerPosition, ContentStatus } from '@/features/cms/types'

const POSITIONS: { value: BannerPosition; label: string }[] = [
  { value: 'homepage_top', label: 'Homepage Top' },
  { value: 'homepage_middle', label: 'Homepage Middle' },
  { value: 'category_page', label: 'Category Page' },
  { value: 'cart_page', label: 'Cart Page' },
  { value: 'announcement_bar', label: 'Announcement Bar' },
]

interface BannerForm {
  title: string
  subtitle: string
  image: string
  ctaLabel: string
  ctaHref: string
  position: BannerPosition
  startDate: string
  endDate: string
  status: ContentStatus
}

const EMPTY: BannerForm = {
  title: '', subtitle: '', image: '', ctaLabel: '', ctaHref: '', position: 'homepage_top', startDate: '', endDate: '', status: 'draft',
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerContent[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<BannerContent | 'new' | null>(null)
  const [form, setForm] = useState<BannerForm>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<BannerContent | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setBanners(await cmsService.getBanners())
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const openEdit = (b: BannerContent | 'new') => {
    setEditing(b)
    setForm(
      b === 'new'
        ? EMPTY
        : {
            title: b.title, subtitle: b.subtitle ?? '', image: b.image, ctaLabel: b.ctaLabel, ctaHref: b.ctaHref,
            position: b.position, startDate: b.startDate ?? '', endDate: b.endDate ?? '', status: b.status,
          }
    )
  }

  const submit = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    const payload = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      image: form.image,
      ctaLabel: form.ctaLabel,
      ctaHref: form.ctaHref,
      position: form.position,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      status: form.status,
      updatedBy: 'Admin',
    }
    if (editing === 'new') {
      await cmsService.createBanner({ ...payload, order: banners.length + 1 })
      toast.success('Banner created')
    } else if (editing) {
      await cmsService.updateBanner(editing.id, payload)
      toast.success('Banner updated')
    }
    setEditing(null)
    void load()
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await cmsService.deleteBanner(deleteTarget.id)
    toast.success('Banner deleted')
    setDeleteTarget(null)
    void load()
  }

  const columns: ColumnDef<BannerContent>[] = [
    {
      key: 'title', header: 'Banner', sortable: true, sortValue: (b) => b.title,
      render: (b) => (
        <div>
          <p className="font-medium text-gray-900">{b.title}</p>
          {b.subtitle && <p className="text-xs text-gray-500">{b.subtitle}</p>}
        </div>
      ),
    },
    {
      key: 'position', header: 'Position',
      render: (b) => <span className="text-sm capitalize text-gray-600">{b.position.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'schedule', header: 'Schedule',
      render: (b) => (
        <span className="text-sm text-gray-600">{b.startDate ? `${b.startDate} → ${b.endDate ?? '∞'}` : 'Always on'}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (b) => <AdminStatusBadge status={b.status} /> },
    {
      key: 'actions', header: '',
      render: (b) => (
        <div className="flex justify-end gap-1">
          <button type="button" onClick={(e) => (e.stopPropagation(), openEdit(b))} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={(e) => (e.stopPropagation(), setDeleteTarget(b))} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Content
      </Link>
      <AdminPageHeader
        title="Banners"
        description="Promotional banners with scheduling and placement."
        actions={
          <button type="button" onClick={() => openEdit('new')} className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> New Banner
          </button>
        }
      />

      <AdminDataTable
        data={banners}
        columns={columns}
        getRowId={(b) => b.id}
        loading={loading}
        searchFn={(b, q) => b.title.toLowerCase().includes(q)}
        searchPlaceholder="Search banners…"
        onRowClick={(b) => openEdit(b)}
      />

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editing === 'new' ? 'New Banner' : 'Edit Banner'}</h2>
              <button type="button" onClick={() => setEditing(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <AdminFormField label="Title" required>
                <input className={adminInputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </AdminFormField>
              <AdminFormField label="Subtitle">
                <input className={adminInputClass} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              </AdminFormField>
              <AdminFormField label="Image URL">
                <input className={adminInputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </AdminFormField>
              <div className="grid grid-cols-2 gap-3">
                <AdminFormField label="CTA Label">
                  <input className={adminInputClass} value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} />
                </AdminFormField>
                <AdminFormField label="CTA Link">
                  <input className={adminInputClass} value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} />
                </AdminFormField>
              </div>
              <AdminFormField label="Position">
                <select className={adminSelectClass} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value as BannerPosition })}>
                  {POSITIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </AdminFormField>
              <div className="grid grid-cols-2 gap-3">
                <AdminFormField label="Start Date">
                  <input type="date" className={adminInputClass} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </AdminFormField>
                <AdminFormField label="End Date">
                  <input type="date" className={adminInputClass} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </AdminFormField>
              </div>
              <AdminFormField label="Status">
                <select className={adminSelectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </AdminFormField>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={() => void submit()} className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
                  {editing === 'new' ? 'Create Banner' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminConfirmDialog
        open={deleteTarget !== null}
        title="Delete banner?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
