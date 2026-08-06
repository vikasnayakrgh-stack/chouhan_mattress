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
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
    title: 'Sales & Fulfillment',
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
    title: 'Content & CMS',
    items: [
      { label: 'Homepage CMS', href: '/admin/content', icon: Home },
      { label: 'Banners', href: '/admin/content?tab=banners', icon: ImageIcon },
      { label: 'FAQs', href: '/admin/content?tab=faqs', icon: HelpCircle },
    ],
  },
  {
    title: 'Analytics & Growth',
    items: [
      { label: 'Coupons', href: '/admin/discounts?tab=coupons', icon: Ticket },
      { label: 'SEO & Meta', href: '/admin/analytics?tab=seo', icon: Search },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'System & Security',
    items: [
      { label: 'Staff Roles', href: '/admin/settings?tab=staff', icon: ShieldCheck },
      { label: 'Integrations', href: '/admin/settings?tab=integrations', icon: Plug },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useAdmin()

  const isActive = (href: string) => {
    const base = href.split('?')[0]
    if (base === '/admin') return pathname === '/admin'
    return pathname.startsWith(base)
  }

  const nav = (
    <nav className="flex h-full flex-col bg-slate-950 text-slate-200 border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className={cn('flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-4')}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/40 text-amber-400 shadow-md">
            <span className="text-xl">👑</span>
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-white font-heading">Chouhan</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Enterprise Admin</p>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-amber-400 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 space-y-5 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            {section.title && !sidebarCollapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400/80">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
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
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200',
                        active
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-md'
                          : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-100',
                        sidebarCollapsed && 'justify-center px-2'
                      )}
                    >
                      {/* Active Left Indicator Beam */}
                      {active && (
                        <span className="absolute left-0 inset-y-2 w-1 bg-amber-400 rounded-r-full shadow-sm" />
                      )}

                      <Icon className={cn('h-4.5 w-4.5 h-[18px] w-[18px] shrink-0 transition-transform group-hover:scale-110', active ? 'text-amber-400' : 'text-slate-400')} />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Profile Status Badge */}
      {!sidebarCollapsed && (
        <div className="border-t border-slate-800/80 p-4 bg-slate-950">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-extrabold text-xs">
              CM
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-200 truncate">Super Administrator</p>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live System Active
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden shrink-0 transition-all duration-300 ease-in-out lg:block z-30',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="sticky top-0 h-screen">{nav}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-slate-950 shadow-2xl">{nav}</aside>
        </div>
      )}
    </>
  )
}
