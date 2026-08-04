'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  Boxes,
  ShoppingCart,
  RotateCcw,
  BadgePercent,
  Users,
  Star,
  Home,
  Image as ImageIcon,
  HelpCircle,
  Ticket,
  Search,
  BarChart3,
  ShieldCheck,
  Plug,
  Settings,
  BedDouble,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdmin } from '@/context/AdminContext'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavSection {
  title: string | null
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: null,
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Collections', href: '/admin/collections', icon: Layers },
      { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    ],
  },
  {
    title: 'Sales',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Returns', href: '/admin/orders?status=returned', icon: RotateCcw },
      { label: 'Discounts', href: '/admin/discounts', icon: BadgePercent },
    ],
  },
  {
    title: 'Customers',
    items: [
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Homepage', href: '/admin/content', icon: Home },
      { label: 'Banners', href: '/admin/content?tab=banners', icon: ImageIcon },
      { label: 'FAQs', href: '/admin/content?tab=faqs', icon: HelpCircle },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Coupons', href: '/admin/discounts?tab=coupons', icon: Ticket },
      { label: 'SEO', href: '/admin/analytics?tab=seo', icon: Search },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Staff & Roles', href: '/admin/settings?tab=staff', icon: ShieldCheck },
      { label: 'Integrations', href: '/admin/settings?tab=integrations', icon: Plug },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useAdmin()

  const isActive = (href: string) => {
    const base = href.split('?')[0]
    if (base === '/admin') return pathname === '/admin'
    return pathname.startsWith(base)
  }

  const nav = (
    <nav className="flex h-full flex-col overflow-y-auto">
      <div className={cn('flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4')}>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <BedDouble className="h-5 w-5" />
        </span>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">Chouhan Mattress</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="ml-auto rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 space-y-4 px-3 py-4">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            {section.title && !sidebarCollapsed && (
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        sidebarCollapsed && 'justify-center px-2'
                      )}
                    >
                      <Icon className={cn('h-4.5 w-4.5 h-[18px] w-[18px] shrink-0', active ? 'text-blue-600' : 'text-gray-400')} />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      {!sidebarCollapsed && (
        <div className="border-t border-gray-200 p-4">
          <p className="text-xs text-gray-400">Admin Panel v1.0 · Milestone 1</p>
        </div>
      )}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden shrink-0 border-r border-gray-200 bg-gray-50 transition-all duration-200 lg:block',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="sticky top-0 h-screen">{nav}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-gray-50 shadow-xl">{nav}</aside>
        </div>
      )}
    </>
  )
}
