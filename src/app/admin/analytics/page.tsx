'use client'

import React from 'react'
import { BarChart3 } from 'lucide-react'
import { AdminPageHeader, AdminEmptyState } from '@/components/admin'

export default function AdminAnalyticsPage() {
  return (
    <div>
      <AdminPageHeader title="Analytics" description="Traffic, conversion and SEO analytics." />
      <AdminEmptyState
        icon={BarChart3}
        title="Coming in Milestone 3"
        description="Detailed sales analytics, traffic reports and SEO tooling will be available here."
      />
    </div>
  )
}
