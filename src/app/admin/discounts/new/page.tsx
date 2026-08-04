'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader } from '@/components/admin'
import { discountService, type DiscountDraft } from '@/services/discountService'
import { DiscountForm } from '../DiscountForm'

export default function AdminNewDiscountPage() {
  const router = useRouter()

  const handleSubmit = async (draft: DiscountDraft) => {
    const created = await discountService.create(draft)
    toast.success(`Discount ${created.code} created`)
    router.push(`/admin/discounts/${created.id}`)
  }

  return (
    <div className="space-y-5">
      <Link href="/admin/discounts" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to discounts
      </Link>
      <AdminPageHeader title="New Discount" description="Create a promo code or automatic offer" />
      <DiscountForm submitLabel="Create Discount" onSubmit={(d) => void handleSubmit(d)} />
    </div>
  )
}
