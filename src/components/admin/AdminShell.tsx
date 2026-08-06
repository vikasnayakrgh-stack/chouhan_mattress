'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Toaster } from 'sonner'
import { AdminProvider } from '@/context/AdminContext'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login' || pathname?.startsWith('/admin/login/')

  if (isLoginPage) {
    return (
      <AdminProvider>
        <div className="admin-root min-h-screen bg-slate-950 text-slate-100 font-sans">
          {children}
        </div>
        <Toaster richColors position="top-right" />
      </AdminProvider>
    )
  }

  return (
    <AdminProvider>
      <div className="admin-root flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 bg-slate-900/50 p-4 lg:p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </AdminProvider>
  )
}
