'use client'

import React, { useRef } from 'react'
import { Bold, Italic, List, Link2, Heading2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
}

/**
 * Lightweight markdown-flavoured text editor with a formatting toolbar.
 * Inserts markdown tokens around the current selection.
 */
export function AdminRichTextEditor({ value, onChange, placeholder, rows = 6, className }: AdminRichTextEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const wrap = (before: string, after: string = before) => {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end) || 'text'
    const next = value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + selected.length)
    })
  }

  const prefixLine = (prefix: string) => {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
    onChange(next)
    requestAnimationFrame(() => el.focus())
  }

  const buttons: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }[] = [
    { icon: Bold, label: 'Bold', onClick: () => wrap('**') },
    { icon: Italic, label: 'Italic', onClick: () => wrap('_') },
    { icon: Heading2, label: 'Heading', onClick: () => prefixLine('## ') },
    { icon: List, label: 'List', onClick: () => prefixLine('- ') },
    { icon: Link2, label: 'Link', onClick: () => wrap('[', '](https://)') },
  ]

  return (
    <div className={cn('overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20', className)}>
      <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50 px-2 py-1.5">
        {buttons.map((b) => (
          <button
            key={b.label}
            type="button"
            title={b.label}
            onClick={b.onClick}
            className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          >
            <b.icon className="h-4 w-4" />
          </button>
        ))}
        <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-400">Markdown</span>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
    </div>
  )
}
