'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { slugify, generateId } from '@/lib/utils'
import {
  AdminFormField,
  AdminImageUploader,
  AdminVariantGenerator,
  AdminVariantMatrix,
  adminInputClass,
  adminTextareaClass,
  adminSelectClass,
} from '@/components/admin'
import { productService, generateVariantCombinations, generateSKU } from '@/services/productService'
import { catalogService } from '@/services/catalogService'
import type {
  ProductWithVariants,
  ProductVariant,
  ProductOption,
  ProductImage,
  ProductStatus,
  MattressAttributes,
} from '@/features/products/types'
import type { Category, Collection } from '@/features/catalog/types'

interface ProductFormProps {
  product?: ProductWithVariants
}

interface Section {
  title: string
  description?: string
  children: React.ReactNode
}

function FormSection({ title, description, children }: Section) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 lg:p-6">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

const DEFAULT_ATTRIBUTES: MattressAttributes = {
  type: 'Memory Foam',
  material: '',
  firmness: 'Medium',
  thicknessOptions: [],
  warrantyYears: 5,
  trialDays: 100,
  reversible: false,
  sleepingPosition: [],
  constructionLayers: [],
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = Boolean(product)

  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [productCode, setProductCode] = useState(product?.productCode ?? '')
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [brand, setBrand] = useState(product?.brand ?? 'Chouhan Mattress')
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '')
  const [collectionIds, setCollectionIds] = useState<string[]>(product?.collectionIds ?? [])
  const [tags, setTags] = useState(product?.tags.join(', ') ?? '')
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? 'draft')
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? [])
  const [isMattress, setIsMattress] = useState(Boolean(product?.mattressAttributes) || !isEdit)
  const [attributes, setAttributes] = useState<MattressAttributes>(
    product?.mattressAttributes ?? DEFAULT_ATTRIBUTES
  )
  const [options, setOptions] = useState<ProductOption[]>(product?.options ?? [])
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants ?? [])
  const [seoTitle, setSeoTitle] = useState(product?.seo.title ?? '')
  const [seoDescription, setSeoDescription] = useState(product?.seo.metaDescription ?? '')
  const [seoSlug, setSeoSlug] = useState(product?.seo.urlSlug ?? '')
  const [ogImage, setOgImage] = useState(product?.seo.ogImage ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    void catalogService.getCategories().then(setCategories)
    void catalogService.getCollections().then(setCollections)
  }, [])

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name))
  }, [name, slugTouched])

  const combinationCount = useMemo(
    () => generateVariantCombinations(options).length,
    [options]
  )

  const productId = product?.id ?? `prod-${generateId()}`

  const handleGenerateVariants = () => {
    const combos = generateVariantCombinations(options)
    const code = productCode || name.split(' ')[0]?.toUpperCase() || 'PROD'
    const next: ProductVariant[] = combos.map((combo) => {
      const sku = generateSKU(code, combo)
      const existing = variants.find(
        (v) => JSON.stringify(v.optionValues) === JSON.stringify(combo)
      )
      if (existing) return existing
      return {
        id: `var-${generateId()}`,
        productId,
        sku,
        optionValues: combo,
        mrp: 0,
        sellingPrice: 0,
        discountPercent: 0,
        stock: 0,
        lowStockThreshold: 10,
        status: 'active',
      }
    })
    setVariants(next)
    toast.success(`${next.length} variants generated`)
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Product name is required'
    if (!slug.trim()) errs.slug = 'Slug is required'
    if (!categoryId) errs.categoryId = 'Select a category'
    if (variants.length === 0) errs.variants = 'Generate at least one variant'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const save = async (saveStatus: ProductStatus) => {
    if (!validate()) {
      toast.error('Please fix the errors before saving')
      return
    }
    const category = categories.find((c) => c.id === categoryId)
    const payload: ProductWithVariants = {
      id: productId,
      name: name.trim(),
      slug: slug.trim(),
      productCode: productCode || name.split(' ')[0]?.toUpperCase() || 'PROD',
      shortDescription,
      description,
      brand,
      categoryId,
      categoryName: category?.name ?? '',
      collectionIds,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: saveStatus,
      images,
      options,
      mattressAttributes: isMattress ? attributes : undefined,
      seo: {
        title: seoTitle || `${name} | Chouhan Mattress`,
        metaDescription: seoDescription || shortDescription,
        urlSlug: seoSlug || slug,
        ogImage: ogImage || undefined,
      },
      createdAt: product?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variants,
    }
    if (isEdit) {
      await productService.update(productId, payload)
      toast.success('Product updated')
    } else {
      await productService.create(payload)
      toast.success(saveStatus === 'draft' ? 'Product saved as draft' : 'Product published')
    }
    router.push('/admin/products')
  }

  const toggleCollection = (id: string) => {
    setCollectionIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const togglePosition = (pos: string) => {
    setAttributes((a) => ({
      ...a,
      sleepingPosition: a.sleepingPosition.includes(pos)
        ? a.sleepingPosition.filter((p) => p !== pos)
        : [...a.sleepingPosition, pos],
    }))
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void save('draft')}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Save className="h-4 w-4" /> Save as Draft
          </button>
          <button
            type="button"
            onClick={() => void save('active')}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Send className="h-4 w-4" /> {isEdit ? 'Save & Publish' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Basic info */}
      <FormSection title="Basic Info" description="Core product details shown on the storefront.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Product Name" htmlFor="pf-name" required error={errors.name} className="sm:col-span-2">
            <input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} className={adminInputClass} placeholder="e.g. OrthoSpine Pro Memory Foam Mattress" />
          </AdminFormField>
          <AdminFormField label="Slug" htmlFor="pf-slug" required error={errors.slug} description="Auto-generated from name.">
            <input
              id="pf-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
              className={adminInputClass}
            />
          </AdminFormField>
          <AdminFormField label="Product Code" htmlFor="pf-code" description="Used in SKU generation (CM-{CODE}-…).">
            <input id="pf-code" value={productCode} onChange={(e) => setProductCode(e.target.value.toUpperCase())} className={adminInputClass} placeholder="ORTHO" />
          </AdminFormField>
          <AdminFormField label="Short Description" htmlFor="pf-short" className="sm:col-span-2">
            <input id="pf-short" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Full Description" htmlFor="pf-desc" className="sm:col-span-2">
            <textarea id="pf-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={adminTextareaClass} />
          </AdminFormField>
          <AdminFormField label="Brand" htmlFor="pf-brand">
            <input id="pf-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={adminInputClass} />
          </AdminFormField>
          <AdminFormField label="Category" htmlFor="pf-category" required error={errors.categoryId}>
            <select id="pf-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={adminSelectClass}>
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </AdminFormField>
          <AdminFormField label="Collections" className="sm:col-span-2">
            <div className="flex flex-wrap gap-2">
              {collections.map((c) => {
                const selected = collectionIds.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCollection(c.id)}
                    aria-pressed={selected}
                    className={
                      selected
                        ? 'rounded-lg border border-blue-600 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700'
                        : 'rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-gray-300'
                    }
                  >
                    {c.name}
                  </button>
                )
              })}
            </div>
          </AdminFormField>
          <AdminFormField label="Tags" htmlFor="pf-tags" description="Comma separated.">
            <input id="pf-tags" value={tags} onChange={(e) => setTags(e.target.value)} className={adminInputClass} placeholder="orthopedic, memory foam" />
          </AdminFormField>
          <AdminFormField label="Status" htmlFor="pf-status">
            <select id="pf-status" value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className={adminSelectClass}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </AdminFormField>
        </div>
      </FormSection>

      {/* Media */}
      <FormSection title="Media" description="Product images. First image (or starred) is the thumbnail.">
        <AdminImageUploader images={images} onChange={setImages} />
      </FormSection>

      {/* Mattress attributes */}
      <FormSection title="Mattress Attributes" description="Only applies to mattress products.">
        <label className="mb-4 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isMattress}
            onChange={(e) => setIsMattress(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          This product is a mattress
        </label>
        {isMattress && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminFormField label="Type" htmlFor="pf-type">
              <select id="pf-type" value={attributes.type} onChange={(e) => setAttributes((a) => ({ ...a, type: e.target.value }))} className={adminSelectClass}>
                {['Memory Foam', 'Dual Comfort', 'Coir', 'Bonnell Spring', 'Pocket Spring', 'Latex', 'Hybrid'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </AdminFormField>
            <AdminFormField label="Material" htmlFor="pf-material">
              <input id="pf-material" value={attributes.material} onChange={(e) => setAttributes((a) => ({ ...a, material: e.target.value }))} className={adminInputClass} placeholder="HR Foam + Memory Foam" />
            </AdminFormField>
            <AdminFormField label="Firmness" htmlFor="pf-firmness">
              <select id="pf-firmness" value={attributes.firmness} onChange={(e) => setAttributes((a) => ({ ...a, firmness: e.target.value as MattressAttributes['firmness'] }))} className={adminSelectClass}>
                {['Soft', 'Medium', 'Medium-Firm', 'Firm'].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </AdminFormField>
            <AdminFormField label="Warranty (years)" htmlFor="pf-warranty">
              <input id="pf-warranty" type="number" min={0} value={attributes.warrantyYears} onChange={(e) => setAttributes((a) => ({ ...a, warrantyYears: Number(e.target.value) }))} className={adminInputClass} />
            </AdminFormField>
            <AdminFormField label="Trial Period (days)" htmlFor="pf-trial">
              <input id="pf-trial" type="number" min={0} value={attributes.trialDays} onChange={(e) => setAttributes((a) => ({ ...a, trialDays: Number(e.target.value) }))} className={adminInputClass} />
            </AdminFormField>
            <AdminFormField label="Reversible">
              <label className="flex h-10 items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={attributes.reversible}
                  onChange={(e) => setAttributes((a) => ({ ...a, reversible: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Can be flipped (dual-sided)
              </label>
            </AdminFormField>
            <AdminFormField label="Sleeping Position" className="sm:col-span-2">
              <div className="flex flex-wrap gap-2">
                {['Back', 'Side', 'Stomach'].map((pos) => {
                  const selected = attributes.sleepingPosition.includes(pos)
                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => togglePosition(pos)}
                      aria-pressed={selected}
                      className={
                        selected
                          ? 'rounded-lg border border-blue-600 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700'
                          : 'rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-gray-300'
                      }
                    >
                      {pos}
                    </button>
                  )
                })}
              </div>
            </AdminFormField>
            <AdminFormField label="Construction Layers" htmlFor="pf-layers" description="One per line, top to bottom." className="sm:col-span-2">
              <textarea
                id="pf-layers"
                rows={3}
                value={attributes.constructionLayers.join('\n')}
                onChange={(e) => setAttributes((a) => ({ ...a, constructionLayers: e.target.value.split('\n').filter(Boolean) }))}
                className={adminTextareaClass}
                placeholder={'Knitted fabric cover\nMemory foam comfort layer\nHR foam core'}
              />
            </AdminFormField>
          </div>
        )}
      </FormSection>

      {/* Options & variants */}
      <FormSection
        title="Options & Variants"
        description="Select option values, then generate all combinations. SKUs follow CM-{CODE}-{DIMS}-{THICKNESS}."
      >
        <div className="space-y-5">
          <AdminVariantGenerator
            options={options}
            onChange={setOptions}
            onGenerate={handleGenerateVariants}
            combinationCount={combinationCount}
          />
          {errors.variants && <p className="text-xs font-medium text-red-600">{errors.variants}</p>}
          <AdminVariantMatrix variants={variants} onChange={setVariants} />
        </div>
      </FormSection>

      {/* SEO */}
      <FormSection title="SEO" description="Search engine appearance. Falls back to product name/description.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="SEO Title" htmlFor="pf-seo-title" className="sm:col-span-2">
            <input id="pf-seo-title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={adminInputClass} placeholder={`${name || 'Product'} | Chouhan Mattress`} />
          </AdminFormField>
          <AdminFormField label="Meta Description" htmlFor="pf-seo-desc" className="sm:col-span-2">
            <textarea id="pf-seo-desc" rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className={adminTextareaClass} />
          </AdminFormField>
          <AdminFormField label="URL Slug" htmlFor="pf-seo-slug">
            <input id="pf-seo-slug" value={seoSlug} onChange={(e) => setSeoSlug(e.target.value)} className={adminInputClass} placeholder={slug} />
          </AdminFormField>
          <AdminFormField label="OG Image URL" htmlFor="pf-og">
            <input id="pf-og" value={ogImage} onChange={(e) => setOgImage(e.target.value)} className={adminInputClass} placeholder="https://…" />
          </AdminFormField>
        </div>
      </FormSection>

      <div className="flex justify-end gap-2 pb-8">
        <button
          type="button"
          onClick={() => void save('draft')}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Save className="h-4 w-4" /> Save as Draft
        </button>
        <button
          type="button"
          onClick={() => void save('active')}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Send className="h-4 w-4" /> {isEdit ? 'Save & Publish' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
