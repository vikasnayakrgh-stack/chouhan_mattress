'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PackageX } from 'lucide-react'
import Link from 'next/link'
import { AdminPageHeader, AdminEmptyState } from '@/components/admin'
import { ProductForm } from '@/components/admin/ProductForm'
import { productService } from '@/services/productService'
import type { ProductWithVariants } from '@/features/products/types'

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductWithVariants | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return
    void productService.getById(params.id).then((p) => {
      setProduct(p)
      setLoading(false)
    })
  }, [params?.id])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl border border-gray-200 bg-white" />
        ))}
      </div>
    )
  }

  if (!product) {
    return (
      <AdminEmptyState
        icon={PackageX}
        title="Product not found"
        description="This product may have been removed."
        action={
          <Link href="/admin/products" className="text-sm font-medium text-blue-600 hover:underline">
            Back to products
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <AdminPageHeader title={`Edit: ${product.name}`} description={`Product code ${product.productCode} · ${product.variants.length} variants`} />
      <ProductForm product={product} />
    </div>
  )
}
