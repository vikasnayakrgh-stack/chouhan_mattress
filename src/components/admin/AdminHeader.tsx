'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, Bell, ChevronDown, User, LogOut, Settings, ChevronRight, PanelLeftClose, PanelLeft, Sparkles, Command } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdmin } from '@/context/AdminContext'

const SEGMENT_LABELS: Record<string, string> = {
  admin: 'Dashboard',
  products: 'Products',
  new: 'New Product',
  categories: 'Categories',
  collections: 'Collections',
  inventory: 'Inventory Stock',
  orders: 'Sales Orders',
  customers: 'Customer Directory',
  reviews: 'Product Reviews',
  discounts: 'Discounts & Coupons',
  content: 'CMS Content',
  analytics: 'Analytics & SEO',
  settings: 'System Settings',
}

export function AdminHeader() {
  const pathname = usePathname()
  const { toggleSidebar, sidebarCollapsed, setMobileSidebarOpen } = useAdmin()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleSignOut = () => {
    document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax; Secure';
    window.location.href = '/admin/login';
  }

  const segments = pathname.split('/').filter(Boolean)
  const crumbs = segments.map((seg, i) => ({
    label: SEGMENT_LABELS[seg] ?? decodeURIComponent(seg),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-950 px-4 lg:px-6 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Sidebar Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-amber-400 lg:inline-flex transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-xs md:flex">
          <Link href="/admin" className="font-extrabold text-slate-400 hover:text-amber-400 transition-colors">
            Admin
          </Link>
          {crumbs.map((c) => (
            <React.Fragment key={c.href}>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600" />
              {c.isLast ? (
                <span className="truncate font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="truncate text-slate-400 font-bold hover:text-slate-200">
                  {c.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3" ref={profileRef}>
        {/* Quick Search Bar */}
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Quick search products, orders..."
            className="h-9 w-64 rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-14 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((o) => !o)}
            className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-amber-400 transition-colors"
            aria-label="System Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl z-50 text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">System Alerts</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">2 New</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <span className="text-amber-400 text-sm">⚠️</span>
                  <div>
                    <p className="font-bold text-white">Low Stock Warning</p>
                    <p className="text-[11px] text-slate-400">Royal Ortho Hybrid King (3 items left)</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <span className="text-emerald-400 text-sm">📦</span>
                  <div>
                    <p className="font-bold text-white">New Order #CM-9042</p>
                    <p className="text-[11px] text-slate-400">₹42,999 • Express Dispatch</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-extrabold text-slate-950 shadow-md">
              CM
            </div>
            <div className="hidden text-left md:block min-w-0">
              <p className="text-xs font-extrabold text-white truncate leading-tight">Admin User</p>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Super Admin</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-50 text-slate-200"
            >
              <div className="border-b border-slate-800 px-3 py-2.5 mb-1">
                <p className="text-xs font-extrabold text-white">Chouhan Staff</p>
                <p className="text-[11px] text-slate-400 truncate">admin@chouhanmattress.com</p>
              </div>
              <Link
                role="menuitem"
                href="/admin/settings"
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Settings className="h-4 w-4 text-amber-400" /> System Settings
              </Link>
              <button
                role="menuitem"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
