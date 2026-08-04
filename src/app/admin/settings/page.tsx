'use client'

import React from 'react'
import { Settings } from 'lucide-react'
import { AdminPageHeader, AdminEmptyState } from '@/components/admin'

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader title="Settings" description="Store settings, staff, roles and integrations." />
      <AdminEmptyState
        icon={Settings}
        title="Coming in Milestone 3"
        description="Staff & roles, integrations and store configuration will be available here."
      />
    </div>
  )
}
