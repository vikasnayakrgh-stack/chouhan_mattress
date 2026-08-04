'use client'

import React, { useState } from 'react'
import { UploadCloud, Star, Trash2, ArrowLeft, ArrowRight, ImagePlus } from 'lucide-react'
import { cn, generateId } from '@/lib/utils'
import type { ProductImage } from '@/features/products/types'

interface AdminImageUploaderProps {
  images: ProductImage[]
  onChange: (images: ProductImage[]) => void
}

export function AdminImageUploader({ images, onChange }: AdminImageUploaderProps) {
  const [urlInput, setUrlInput] = useState('')

  const normalize = (list: ProductImage[]): ProductImage[] => {
    const hasThumb = list.some((i) => i.isThumbnail)
    return list.map((img, i) => ({
      ...img,
      position: i,
      isThumbnail: hasThumb ? img.isThumbnail : i === 0,
    }))
  }

  const addImage = () => {
    const url = urlInput.trim() || `https://picsum.photos/seed/${generateId()}/800/600`
    onChange(normalize([...images, { id: `img-${generateId()}`, url, alt: '', position: images.length, isThumbnail: images.length === 0 }]))
    setUrlInput('')
  }

  const remove = (id: string) => {
    onChange(normalize(images.filter((i) => i.id !== id)))
  }

  const setThumbnail = (id: string) => {
    onChange(images.map((i) => ({ ...i, isThumbnail: i.id === id })))
  }

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(normalize(next))
  }

  const setAlt = (id: string, alt: string) => {
    onChange(images.map((i) => (i.id === id ? { ...i, alt } : i)))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-600">Add product images (mock — paste a URL or add a placeholder)</p>
        <div className="mx-auto flex w-full max-w-md gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://… (optional)"
            className="h-9 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="button"
            onClick={addImage}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <ImagePlus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, index) => (
            <li key={img.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="relative aspect-[4/3] bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt || 'Product image'} className="h-full w-full object-cover" />
                {img.isThumbnail && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-medium text-white">
                    <Star className="h-3 w-3" /> Thumbnail
                  </span>
                )}
              </div>
              <div className="space-y-2 p-3">
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => setAlt(img.id, e.target.value)}
                  placeholder="Alt text"
                  className="h-8 w-full rounded-md border border-gray-200 px-2 text-xs focus:border-blue-500 focus:outline-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30" aria-label="Move left">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30" aria-label="Move right">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    {!img.isThumbnail && (
                      <button
                        type="button"
                        onClick={() => setThumbnail(img.id)}
                        className={cn('rounded p-1 text-gray-500 hover:bg-gray-100')}
                        title="Set as thumbnail"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button type="button" onClick={() => remove(img.id)} className="rounded p-1 text-red-500 hover:bg-red-50" aria-label="Remove image">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
