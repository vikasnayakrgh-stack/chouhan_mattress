'use client'

import React from 'react'
import { Toaster } from 'sonner'
import { AdminProvider } from '@/context/AdminContext'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="admin-root flex min-h-screen bg-white text-gray-900">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 bg-gray-50/50 p-4 lg:p-6">{children}</main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </AdminProvider>
  )
}
