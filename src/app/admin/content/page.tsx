'use client'

import React, { useEffect, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Pencil, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader, AdminTabs, AdminStatusBadge } from '@/components/admin'
import { cmsService } from '@/services/cmsService'
import type { HomepageContent } from '@/features/cms/types'

const TABS = [
  { key: 'hero', label: 'Hero' },
  { key: 'banners', label: 'Banners' },
  { key: 'faqs', label: 'FAQs' },
  { key: 'sections', label: 'Homepage Sections' },
  { key: 'seo', label: 'SEO' },
]

function ContentPageContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') ?? 'hero'
  const [tab, setTab] = useState(TABS.some((t) => t.key === initialTab) ? initialTab : 'hero')
  const [content, setContent] = useState<HomepageContent | null>(null)

  const load = useCallback(async () => {
    setContent(await cmsService.getHomepageContent())
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const toggleSection = async (id: string, enabled: boolean) => {
    await cmsService.toggleSection(id, enabled)
    toast.success(enabled ? 'Section enabled' : 'Section disabled')
    void load()
  }

  if (!content) {
    return (
      <div>
        <AdminPageHeader title="Content" description="Manage homepage content, banners, FAQs and SEO." />
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">Loading content…</div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader title="Content" description="Manage homepage content, banners, FAQs and SEO." />
      <AdminTabs tabs={TABS} active={tab} onChange={setTab} className="mb-6" />

      {tab === 'hero' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <AdminStatusBadge status={content.hero.status} />
                <span className="text-xs text-gray-400">
                  Updated {new Date(content.hero.updatedAt).toLocaleDateString('en-IN')} by {content.hero.updatedBy}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{content.hero.headline}</h2>
              <p className="mt-1 text-sm text-gray-600">{content.hero.subheadline}</p>
              <p className="mt-2 max-w-2xl text-sm text-gray-500">{content.hero.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {content.hero.badges.map((b) => (
                  <span key={b} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{b}</span>
                ))}
              </div>
            </div>
            <Link
              href="/admin/content/hero"
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Pencil className="h-4 w-4" /> Edit Hero
            </Link>
          </div>
        </div>
      )}

      {tab === 'banners' && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <p className="text-sm text-gray-500">{content.banners.length} banners</p>
            <Link href="/admin/content/banners" className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700">
              Manage Banners
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {content.banners.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-4 px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-500">
                    {b.position.replace(/_/g, ' ')} {b.startDate ? `· ${b.startDate} → ${b.endDate ?? '∞'}` : ''}
                  </p>
                </div>
                <AdminStatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'faqs' && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <p className="text-sm text-gray-500">{content.faqs.length} FAQs</p>
            <Link href="/admin/content/faqs" className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700">
              Manage FAQs
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {content.faqs.slice(0, 6).map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-4 px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{f.question}</p>
                  <p className="text-xs capitalize text-gray-500">{f.category}</p>
                </div>
                <AdminStatusBadge status={f.status} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'sections' && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <ul className="divide-y divide-gray-100">
            {content.sections.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {s.order}. {s.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.type.replace(/_/g, ' ')} · {s.itemCount ?? 0} items · updated by {s.updatedBy}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <AdminStatusBadge status={s.status} />
                  <button
                    type="button"
                    onClick={() => void toggleSection(s.id, !s.enabled)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    {s.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {s.enabled ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'seo' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">{content.seo.defaultTitle}</p>
              <p className="max-w-2xl text-sm text-gray-500">{content.seo.metaDescription}</p>
              <p className="flex items-center gap-1 text-xs text-blue-600">
                <ExternalLink className="h-3 w-3" /> {content.seo.canonicalBase}
              </p>
              <p className="text-xs text-gray-400">
                Indexing: {content.seo.robotsIndex ? 'Allowed' : 'Blocked'} · Sitemap: {content.seo.sitemapEnabled ? 'Enabled' : 'Disabled'} ·{' '}
                {content.seo.pages.length} page overrides
              </p>
            </div>
            <Link href="/admin/content/seo" className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700">
              <Pencil className="h-4 w-4" /> Edit SEO
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div>Loading content…</div>}>
      <ContentPageContent />
    </Suspense>
  )
}