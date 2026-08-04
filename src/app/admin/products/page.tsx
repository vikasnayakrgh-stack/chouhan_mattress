'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Package, Pencil, Copy, Archive } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'
import {
  AdminPageHeader,
  AdminDataTable,
  AdminStatusBadge,
  AdminConfirmDialog,
  AdminEmptyState,
  adminSelectClass,
} from '@/components/admin'
import type { ColumnDef } from '@/components/admin'
import { productService, variantStockStatus } from '@/services/productService'
import { catalogService } from '@/services/catalogService'
import type { ProductWithVariants, ProductStatus } from '@/features/products/types'
import type { Category } from '@/features/catalog/types'

type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all')
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [archiveTarget, setArchiveTarget] = useState<ProductWithVariants | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [result, cats] = await Promise.all([
      productService.search({ categoryId: categoryFilter, status: statusFilter, stock: stockFilter }),
      catalogService.getCategories(),
    ])
    setProducts(result.products)
    setCategories(cats)
    setLoading(false)
  }, [categoryFilter, statusFilter, stockFilter])

  useEffect(() => {
    void load()
  }, [load])

  const handleArchive = async () => {
    if (!archiveTarget) return
    await productService.archive(archiveTarget.id)
    toast.success(`"${archiveTarget.name}" archived`)
    setArchiveTarget(null)
    void load()
  }

  const handleDuplicate = async (p: ProductWithVariants) => {
    const copy = await productService.duplicate(p.id)
    if (copy) {
      toast.success(`Duplicated as "${copy.name}"`)
      void load()
    }
  }

  const columns: ColumnDef<ProductWithVariants>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      sortValue: (p) => p.name,
      render: (p) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.images[0]?.url ?? 'https://picsum.photos/seed/placeholder/80/80'}
            alt={p.images[0]?.alt ?? p.name}
            className="h-10 w-10 shrink-0 rounded-lg border border-gray-200 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">{p.name}</p>
            <p className="text-xs text-gray-500">{p.productCode}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      sortValue: (p) => p.categoryName,
      render: (p) => <span className="text-gray-600">{p.categoryName}</span>,
    },
    {
      key: 'variants',
      header: 'Variants',
      render: (p) => <span className="text-gray-600">{p.variants.length}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      sortValue: (p) => Math.min(...p.variants.map((v) => v.sellingPrice)),
      render: (p) => {
        const prices = p.variants.map((v) => v.sellingPrice)
        const min = Math.min(...prices)
        const max = Math.max(...prices)
        return (
          <span className="font-medium text-gray-900">
            {min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`}
          </span>
        )
      },
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      sortValue: (p) => p.variants.reduce((s, v) => s + v.stock, 0),
      render: (p) => {
        const total = p.variants.reduce((s, v) => s + v.stock, 0)
        const out = p.variants.filter((v) => variantStockStatus(v) === 'out_of_stock').length
        return (
          <div>
            <p className="text-gray-900">{total} units</p>
            {out > 0 && <p className="text-xs text-red-600">{out} variant(s) out of stock</p>}
          </div>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <AdminStatusBadge status={p.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28 text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/products/${p.id}`}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label={`Edit ${p.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => void handleDuplicate(p)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label={`Duplicate ${p.name}`}
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setArchiveTarget(p)}
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label={`Archive ${p.name}`}
          >
            <Archive className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage your product catalog, variants and pricing."
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        }
      />

      <AdminDataTable<ProductWithVariants>
        data={products}
        columns={columns}
        getRowId={(p) => p.id}
        loading={loading}
        selectable
        searchPlaceholder="Search products, SKUs…"
        searchFn={(p, q) =>
          p.name.toLowerCase().includes(q) ||
          p.productCode.toLowerCase().includes(q) ||
          p.variants.some((v) => v.sku.toLowerCase().includes(q))
        }
        onRowClick={(p) => router.push(`/admin/products/${p.id}`)}
        bulkActions={[
          {
            label: 'Archive',
            icon: Archive,
            variant: 'danger',
            onClick: (ids) => {
              void Promise.all(ids.map((id) => productService.archive(id))).then(() => {
                toast.success(`${ids.length} product(s) archived`)
                void load()
              })
            },
          },
        ]}
        toolbar={
          <div className="flex flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`${adminSelectClass} h-9 w-auto`}
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProductStatus | 'all')}
              className={`${adminSelectClass} h-9 w-auto`}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as StockFilter)}
              className={`${adminSelectClass} h-9 w-auto`}
              aria-label="Filter by stock"
            >
              <option value="all">All stock levels</option>
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>
        }
        emptyState={
          <AdminEmptyState
            icon={Package}
            title="No products found"
            description="Try adjusting the filters, or add your first product."
            className="border-0"
            action={
              <Link
                href="/admin/products/new"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Add Product
              </Link>
            }
          />
        }
      />

      <AdminConfirmDialog
        open={archiveTarget !== null}
        title="Archive product?"
        description={`"${archiveTarget?.name}" will be hidden from the storefront. You can restore it later.`}
        confirmLabel="Archive"
        onConfirm={() => void handleArchive()}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  )
}
