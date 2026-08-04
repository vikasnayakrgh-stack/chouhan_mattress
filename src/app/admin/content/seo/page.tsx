'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader, AdminFormField, adminInputClass, adminTextareaClass } from '@/components/admin'
import { cmsService } from '@/services/cmsService'
import type { SEOContent, PageSEO } from '@/features/cms/types'

export default function AdminSEOPage() {
  const [seo, setSeo] = useState<SEOContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [editingPage, setEditingPage] = useState<PageSEO | null>(null)

  useEffect(() => {
    void cmsService.getSEO().then(setSeo)
  }, [])

  if (!seo) {
    return <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">Loading SEO settings…</div>
  }

  const set = <K extends keyof SEOContent>(key: K, value: SEOContent[K]) => setSeo({ ...seo, [key]: value })

  const save = async () => {
    setSaving(true)
    const { pages: _p, ...globals } = seo
    const updated = await cmsService.updateSEO(globals, 'Admin')
    setSeo(updated)
    setSaving(false)
    toast.success('SEO settings saved')
  }

  const savePage = async () => {
    if (!editingPage) return
    await cmsService.updatePageSEO(editingPage.id, editingPage)
    setSeo(await cmsService.getSEO())
    setEditingPage(null)
    toast.success('Page SEO updated')
  }

  return (
    <div>
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Content
      </Link>
      <AdminPageHeader
        title="SEO Settings"
        description="Global meta defaults and per-page overrides."
        actions={
          <button type="button" disabled={saving} onClick={() => void save()} className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            <Save className="h-4 w-4" /> Save Settings
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Global Defaults</h2>
          <AdminFormField label="Title Template" description="%s is replaced by the page title.">
            <input className={adminInputClass} value={seo.titleTemplate} onChange={(e) => set('titleTemplate', e.target.value)} />
          </AdminFormField>
          <AdminFormField label="Default Title">
            <input className={adminInputClass} value={seo.defaultTitle} onChange={(e) => set('defaultTitle', e.target.value)} />
          </AdminFormField>
          <AdminFormField label="Meta Description" description={`${seo.metaDescription.length}/160 characters`}>
            <textarea className={adminTextareaClass} rows={3} value={seo.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} />
          </AdminFormField>
          <AdminFormField label="Open Graph Image URL">
            <input className={adminInputClass} value={seo.ogImage} onChange={(e) => set('ogImage', e.target.value)} />
          </AdminFormField>
          <AdminFormField label="Canonical Base URL">
            <input className={adminInputClass} value={seo.canonicalBase} onChange={(e) => set('canonicalBase', e.target.value)} />
          </AdminFormField>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={seo.robotsIndex} onChange={(e) => set('robotsIndex', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
              Allow search indexing
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={seo.sitemapEnabled} onChange={(e) => set('sitemapEnabled', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
              Generate sitemap.xml
            </label>
          </div>

          {/* SERP preview */}
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Search Preview</p>
            <p className="text-xs text-green-700">{seo.canonicalBase}</p>
            <p className="text-base font-medium text-blue-700">{seo.defaultTitle}</p>
            <p className="text-sm text-gray-600">{seo.metaDescription}</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Per-Page Overrides</h2>
            <p className="text-xs text-gray-500">{seo.pages.length} pages with custom SEO</p>
          </div>
          <ul className="divide-y divide-gray-100">
            {seo.pages.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{p.path}</p>
                  <p className="truncate text-sm text-gray-600">{p.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{p.description}</p>
                  {p.noIndex && <span className="mt-1 inline-block rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-600">noindex</span>}
                </div>
                <button type="button" onClick={() => setEditingPage({ ...p })} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <Pencil className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditingPage(null)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Edit SEO — {editingPage.path}</h2>
              <button type="button" onClick={() => setEditingPage(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <AdminFormField label="Title">
                <input className={adminInputClass} value={editingPage.title} onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })} />
              </AdminFormField>
              <AdminFormField label="Description">
                <textarea className={adminTextareaClass} rows={3} value={editingPage.description} onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })} />
              </AdminFormField>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={editingPage.noIndex} onChange={(e) => setEditingPage({ ...editingPage, noIndex: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                Exclude from search engines (noindex)
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingPage(null)} className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={() => void savePage()} className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
