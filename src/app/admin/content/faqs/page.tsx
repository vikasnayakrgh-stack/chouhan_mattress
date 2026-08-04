'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, X, ArrowUp, ArrowDown, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  AdminPageHeader,
  AdminStatusBadge,
  AdminConfirmDialog,
  AdminFormField,
  adminInputClass,
  adminSelectClass,
  AdminRichTextEditor,
} from '@/components/admin'
import { cmsService } from '@/services/cmsService'
import type { FAQContent, FAQCategory, ContentStatus } from '@/features/cms/types'

const CATEGORIES: { value: FAQCategory; label: string }[] = [
  { value: 'orders', label: 'Orders' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'returns', label: 'Returns' },
  { value: 'warranty', label: 'Warranty' },
  { value: 'products', label: 'Products' },
  { value: 'payments', label: 'Payments' },
  { value: 'trial', label: '100-Night Trial' },
]

interface FAQForm {
  question: string
  answer: string
  category: FAQCategory
  status: ContentStatus
}

const EMPTY: FAQForm = { question: '', answer: '', category: 'products', status: 'draft' }

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQContent[]>([])
  const [category, setCategory] = useState<FAQCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<FAQContent | 'new' | null>(null)
  const [form, setForm] = useState<FAQForm>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<FAQContent | null>(null)

  const load = useCallback(async () => {
    setFaqs(await cmsService.getFAQs(category, search))
  }, [category, search])

  useEffect(() => {
    void load()
  }, [load])

  const openEdit = (f: FAQContent | 'new') => {
    setEditing(f)
    setForm(f === 'new' ? EMPTY : { question: f.question, answer: f.answer, category: f.category, status: f.status })
  }

  const submit = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error('Question and answer are required')
      return
    }
    if (editing === 'new') {
      await cmsService.createFAQ({ ...form, order: faqs.length + 1, updatedBy: 'Admin' })
      toast.success('FAQ created')
    } else if (editing) {
      await cmsService.updateFAQ(editing.id, form)
      toast.success('FAQ updated')
    }
    setEditing(null)
    void load()
  }

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= faqs.length) return
    const ids = faqs.map((f) => f.id)
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    await cmsService.reorderFAQs(ids)
    void load()
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await cmsService.deleteFAQ(deleteTarget.id)
    toast.success('FAQ deleted')
    setDeleteTarget(null)
    void load()
  }

  return (
    <div>
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Content
      </Link>
      <AdminPageHeader
        title="FAQs"
        description="Manage frequently asked questions shown on the storefront."
        actions={
          <button type="button" onClick={() => openEdit('new')} className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> New FAQ
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="h-9 w-64 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Search FAQs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 focus:outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value as FAQCategory | 'all')}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        {faqs.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">No FAQs found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {faqs.map((f, i) => (
              <li key={f.id} className="flex items-start gap-4 px-6 py-4">
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <button type="button" disabled={i === 0} onClick={() => void move(i, -1)} className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" disabled={i === faqs.length - 1} onClick={() => void move(i, 1)} className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{f.question}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{f.answer}</p>
                  <p className="mt-1 text-xs capitalize text-gray-400">{f.category} · updated by {f.updatedBy}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <AdminStatusBadge status={f.status} />
                  <button type="button" onClick={() => openEdit(f)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(f)} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editing === 'new' ? 'New FAQ' : 'Edit FAQ'}</h2>
              <button type="button" onClick={() => setEditing(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <AdminFormField label="Question" required>
                <input className={adminInputClass} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
              </AdminFormField>
              <AdminFormField label="Answer" required>
                <AdminRichTextEditor value={form.answer} onChange={(v) => setForm({ ...form, answer: v })} rows={5} />
              </AdminFormField>
              <div className="grid grid-cols-2 gap-3">
                <AdminFormField label="Category">
                  <select className={adminSelectClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as FAQCategory })}>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </AdminFormField>
                <AdminFormField label="Status">
                  <select className={adminSelectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </AdminFormField>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={() => void submit()} className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
                  {editing === 'new' ? 'Create FAQ' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminConfirmDialog
        open={deleteTarget !== null}
        title="Delete FAQ?"
        description={`"${deleteTarget?.question}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
