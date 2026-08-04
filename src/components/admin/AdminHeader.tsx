'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, Bell, ChevronDown, User, LogOut, Settings, ChevronRight, PanelLeftClose, PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdmin } from '@/context/AdminContext'

const SEGMENT_LABELS: Record<string, string> = {
  admin: 'Dashboard',
  products: 'Products',
  new: 'New',
  categories: 'Categories',
  collections: 'Collections',
  inventory: 'Inventory',
  orders: 'Orders',
  customers: 'Customers',
  reviews: 'Reviews',
  discounts: 'Discounts',
  content: 'Content',
  analytics: 'Analytics',
  settings: 'Settings',
}

export function AdminHeader() {
  const pathname = usePathname()
  const { toggleSidebar, sidebarCollapsed, setMobileSidebarOpen } = useAdmin()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const segments = pathname.split('/').filter(Boolean)
  const crumbs = segments.map((seg, i) => ({
    label: SEGMENT_LABELS[seg] ?? decodeURIComponent(seg),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:px-6">
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={toggleSidebar}
        className="hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:inline-flex"
        aria-label="Toggle sidebar"
      >
        {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1 text-sm md:flex">
        {crumbs.map((c) => (
          <React.Fragment key={c.href}>
            {c.href !== '/admin' && <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />}
            {c.isLast ? (
              <span className="truncate font-medium text-gray-900">{c.label}</span>
            ) : (
              <Link href={c.href} className="truncate text-gray-500 hover:text-gray-900">
                {c.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {/* Global search (placeholder) */}
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search products, orders, customers…"
            className="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              RC
            </span>
            <span className="hidden text-sm font-medium text-gray-700 md:block">Rahul Chouhan</span>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 md:block" />
          </button>
          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            >
              <div className="border-b border-gray-100 px-4 py-2.5">
                <p className="text-sm font-medium text-gray-900">Rahul Chouhan</p>
                <p className="text-xs text-gray-500">owner@chouhanmattress.com</p>
              </div>
              <button role="menuitem" className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <User className="h-4 w-4 text-gray-400" /> Profile
              </button>
              <Link role="menuitem" href="/admin/settings" className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Settings className="h-4 w-4 text-gray-400" /> Settings
              </Link>
              <button role="menuitem" className={cn('flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50')}>
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
