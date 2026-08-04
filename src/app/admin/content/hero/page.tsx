'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader, AdminFormField, adminInputClass, adminSelectClass, AdminRichTextEditor } from '@/components/admin'
import { cmsService } from '@/services/cmsService'
import type { HeroContent, HeroCTA, ContentStatus } from '@/features/cms/types'

export default function AdminHeroEditorPage() {
  const [hero, setHero] = useState<HeroContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [badgeInput, setBadgeInput] = useState('')

  useEffect(() => {
    void cmsService.getHero().then(setHero)
  }, [])

  if (!hero) {
    return <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">Loading hero…</div>
  }

  const set = <K extends keyof HeroContent>(key: K, value: HeroContent[K]) => setHero({ ...hero, [key]: value })

  const setCTA = (index: number, updates: Partial<HeroCTA>) => {
    const ctas = hero.ctas.map((c, i) => (i === index ? { ...c, ...updates } : c))
    set('ctas', ctas)
  }

  const addBadge = () => {
    const v = badgeInput.trim()
    if (!v) return
    set('badges', [...hero.badges, v])
    setBadgeInput('')
  }

  const save = async (status?: ContentStatus) => {
    if (!hero.headline.trim()) {
      toast.error('Headline is required')
      return
    }
    setSaving(true)
    const updated = await cmsService.updateHero({ ...hero, status: status ?? hero.status }, 'Admin')
    setHero(updated)
    setSaving(false)
    toast.success(status === 'published' ? 'Hero published' : 'Hero saved')
  }

  return (
    <div>
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Content
      </Link>
      <AdminPageHeader
        title="Hero Editor"
        description="Edit the homepage hero section."
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> Save Draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void save('published')}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              Publish
            </button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
          <AdminFormField label="Headline" required>
            <input className={adminInputClass} value={hero.headline} onChange={(e) => set('headline', e.target.value)} />
          </AdminFormField>
          <AdminFormField label="Subheadline">
            <input className={adminInputClass} value={hero.subheadline} onChange={(e) => set('subheadline', e.target.value)} />
          </AdminFormField>
          <AdminFormField label="Description">
            <AdminRichTextEditor value={hero.description} onChange={(v) => set('description', v)} rows={4} />
          </AdminFormField>
          <AdminFormField label="Background Image URL">
            <input className={adminInputClass} value={hero.backgroundImage} onChange={(e) => set('backgroundImage', e.target.value)} />
          </AdminFormField>
          <AdminFormField label="Mobile Background Image URL">
            <input className={adminInputClass} value={hero.mobileBackgroundImage ?? ''} onChange={(e) => set('mobileBackgroundImage', e.target.value)} />
          </AdminFormField>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Call-to-Action Buttons</p>
            {hero.ctas.map((cta, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input className={adminInputClass} placeholder="Label" value={cta.label} onChange={(e) => setCTA(i, { label: e.target.value })} />
                <input className={adminInputClass} placeholder="/link" value={cta.href} onChange={(e) => setCTA(i, { href: e.target.value })} />
                <select className={adminSelectClass} value={cta.variant} onChange={(e) => setCTA(i, { variant: e.target.value as HeroCTA['variant'] })}>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Trust Badges</p>
            <div className="flex flex-wrap gap-2">
              {hero.badges.map((b, i) => (
                <span key={`${b}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {b}
                  <button type="button" onClick={() => set('badges', hero.badges.filter((_, j) => j !== i))} className="text-blue-400 hover:text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={adminInputClass}
                placeholder="Add badge e.g. 100-Night Trial"
                value={badgeInput}
                onChange={(e) => setBadgeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
              />
              <button type="button" onClick={addBadge} className="inline-flex h-10 shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={hero.countdownEnabled}
                onChange={(e) => set('countdownEnabled', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Enable countdown timer
            </label>
            {hero.countdownEnabled && (
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminFormField label="Countdown Label">
                  <input className={adminInputClass} value={hero.countdownLabel ?? ''} onChange={(e) => set('countdownLabel', e.target.value)} />
                </AdminFormField>
                <AdminFormField label="Ends At">
                  <input
                    type="datetime-local"
                    className={adminInputClass}
                    value={hero.countdownEndsAt?.slice(0, 16) ?? ''}
                    onChange={(e) => set('countdownEndsAt', e.target.value)}
                  />
                </AdminFormField>
              </div>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Live Preview</p>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-8 py-14 text-white">
              {hero.countdownEnabled && hero.countdownLabel && (
                <span className="mb-4 inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold">
                  {hero.countdownLabel} 18d : 07h : 42m
                </span>
              )}
              <h1 className="text-3xl font-bold leading-tight">{hero.headline || 'Your headline'}</h1>
              <p className="mt-2 text-blue-100">{hero.subheadline}</p>
              <p className="mt-3 max-w-md text-sm text-blue-200">{hero.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {hero.ctas.map((cta, i) => (
                  <span
                    key={i}
                    className={
                      cta.variant === 'primary'
                        ? 'rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-900'
                        : 'rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white'
                    }
                  >
                    {cta.label}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {hero.badges.map((b, i) => (
                  <span key={`${b}-${i}`} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
