'use client'

import React from 'react'
import { AdminPageHeader } from '@/components/admin'
import { ProductForm } from '@/components/admin/ProductForm'

export default function AdminNewProductPage() {
  return (
    <div>
      <AdminPageHeader title="Add Product" description="Create a new product with variants, media and SEO." />
      <ProductForm />
    </div>
  )
}
