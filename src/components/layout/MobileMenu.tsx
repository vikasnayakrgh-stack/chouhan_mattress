'use client'

import { cn } from '@/lib/utils'
import { XIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

const mobileNavItems = [
  {
    label: 'Mattresses',
    href: '/mattresses',
    children: [
      { label: 'Memory Foam', href: '/mattress/memory-foam-mattress' },
      { label: 'Latex', href: '/mattress/latex-mattress' },
      { label: 'Grid', href: '/mattress/grid-mattress' },
      { label: 'Dual Comfort', href: '/mattress/dual-comfort-mattress' },
      { label: 'Orthopedic', href: '/mattress/orthopaedic-mattress' },
      { label: 'Plus', href: '/mattress/plus-mattress' },
      { label: 'Rollup', href: '/mattress/rollup-mattress' },
      { label: 'Foldable', href: '/mattress/foldable-mattress' },
      { label: 'By Size', href: '/mattress/sizes' },
      { label: 'By Price', href: '/mattress/price' },
    ]
  },
  {
    label: 'Beds',
    href: '/beds',
    children: [
      { label: 'Storage Beds', href: '/beds/storage-beds' },
      { label: 'Hydraulic Beds', href: '/beds/hydraulic-beds' },
      { label: 'Box Beds', href: '/beds/box-beds' },
      { label: 'Platform Beds', href: '/beds/platform-beds' },
      { label: 'Poster Beds', href: '/beds/poster-beds' },
      { label: 'Kids Beds', href: '/beds/kids-beds' },
    ]
  },
  {
    label: 'Sofas',
    href: '/sofas',
    children: [
      { label: '3 Seater', href: '/sofa-set/3-seater-sofa' },
      { label: 'L-Shape', href: '/sofa-set/l-shape-sofa' },
      { label: 'Sofa Cum Bed', href: '/sofa-set/sofa-cum-bed' },
      { label: 'Recliners', href: '/sofa-set/recliners' },
      { label: 'Leatherette', href: '/sofa-set/leatherette-sofa' },
      { label: 'Fabric', href: '/sofa-set/fabric-sofa' },
    ]
  },
  {
    label: 'Furniture',
    href: '/furniture',
    children: [
      { label: 'Coffee Tables', href: '/coffee-tables' },
      { label: 'TV Units', href: '/tv-units' },
      { label: 'Side Tables', href: '/side-tables' },
      { label: 'Bookshelves', href: '/bookshelves' },
      { label: 'Cabinets', href: '/cabinets' },
      { label: 'Wardrobes', href: '/wardrobes' },
      { label: 'Dressing Tables', href: '/dressing-tables' },
      { label: 'Study Tables', href: '/study-tables' },
      { label: 'Dining Sets', href: '/dining-sets' },
      { label: 'Office Chairs', href: '/office-chairs' },
    ]
  },
  {
    label: 'Pillows & Bedding',
    href: '/bedding',
    children: [
      { label: 'Memory Foam Pillows', href: '/pillows-and-cushions/memory-foam-pillow' },
      { label: 'Latex Pillows', href: '/pillows-and-cushions/latex-pillow' },
      { label: 'Microfiber Pillows', href: '/pillows-and-cushions/microfiber-pillow' },
      { label: 'Comforters', href: '/bedding/reversible-comforter' },
      { label: 'Bedsheets', href: '/bedding/bedsheets' },
      { label: 'Mattress Protectors', href: '/bedding/mattress-protectors' },
    ]
  },
  {
    label: 'Home Decor',
    href: '/decor',
    children: [
      { label: 'Rugs & Carpets', href: '/rugs' },
      { label: 'Curtains', href: '/curtains' },
      { label: 'Lighting', href: '/lighting' },
      { label: 'Wall Art', href: '/wall-decor' },
      { label: 'Planters', href: '/planters' },
    ]
  },
  {
    label: 'Offers',
    href: '/offers',
    children: []
  },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Listen for custom event to open menu
  const handleOpenMenu = () => setIsOpen(true)
  const handleCloseMenu = () => setIsOpen(false)

  if (typeof window !== 'undefined') {
    window.addEventListener('open-mobile-menu', handleOpenMenu)
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={handleCloseMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-wakefit-beige">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-wakefit-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">W</span>
              </div>
              <span className="font-heading font-bold text-xl text-wakefit-black">Wakefit</span>
            </div>
            <button
              onClick={handleCloseMenu}
              className="p-2 rounded-lg hover:bg-wakefit-cream transition-colors"
              aria-label="Close menu"
            >
              <XIcon className="w-6 h-6 text-wakefit-black" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-wakefit-beige">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-wakefit-gray w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search products..."
                className="w-full h-12 pl-12 pr-4 bg-wakefit-cream border-wakefit-cream focus:border-wakefit-orange focus:bg-white text-body-md placeholder:text-wakefit-gray-light rounded-lg"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
            <ul className="space-y-1" role="list">
              {mobileNavItems.map((item, index) => (
                <li key={index} className="border-b border-wakefit-beige/50 last:border-0">
                  {item.children.length > 0 ? (
                    <>
                      <button
                        onClick={() => {
                          setExpandedItems(prev => {
                            const next = new Set(prev)
                            if (next.has(item.label)) {
                              next.delete(item.label)
                            } else {
                              next.add(item.label)
                            }
                            return next
                          })
                        }}
                        className="w-full flex items-center justify-between px-4 py-4 text-body-md font-medium text-wakefit-gray-dark hover:text-wakefit-orange transition-colors"
                        aria-expanded={expandedItems.has(item.label)}
                      >
                        <span>{item.label}</span>
                        <ChevronDownIcon
                          className={cn(
                            'w-5 h-5 text-wakefit-gray transition-transform',
                            expandedItems.has(item.label) && 'rotate-180'
                          )}
                        />
                      </button>
                      {expandedItems.has(item.label) && (
                        <ul className="bg-wakefit-cream/50 rounded-xl mt-2 mb-4 px-2 py-3 space-y-1" role="list">
                          {item.children.map((child, childIndex) => (
                            <li key={childIndex}>
                              <a
                                href={child.href}
                                className="block px-4 py-2.5 text-body-sm text-wakefit-gray hover:text-wakefit-orange hover:bg-white rounded-lg transition-colors"
                                onClick={handleCloseMenu}
                              >
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="block px-4 py-4 text-body-md font-medium text-wakefit-gray-dark hover:text-wakefit-orange transition-colors"
                      onClick={handleCloseMenu}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Quick Links */}
            <div className="mt-8 pt-8 border-t border-wakefit-beige">
              <h3 className="text-body-sm font-semibold text-wakefit-gray-dark uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2" role="list">
                {[
                  { label: 'Find a Store', href: '/furniture-store' },
                  { label: 'Track Order', href: '/track-order' },
                  { label: 'Bulk Orders', href: '/bulk-orders' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'FAQs', href: '/faqs' },
                  { label: 'Contact Us', href: '/contact' },
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="block px-4 py-2.5 text-body-sm text-wakefit-gray hover:text-wakefit-orange transition-colors"
                      onClick={handleCloseMenu}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-wakefit-beige space-y-4">
            <div className="flex items-center justify-center gap-6">
              {[
                { icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', label: 'Facebook' },
                { icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm0-10.162c-2.209 0-4 1.79-4 4 0 2.209 1.79 4 4 4s4-1.79 4-4c0-2.21-1.79-4-4-4z', label: 'Instagram' },
                { icon: 'M23.498 6.186a3.178 3.178 0 00-2.122-.585A12.984 12.984 0 0112 21.75a12.976 12.976 0 01-5.381-1.588 3.17 3.17 0 00-2.117.582c-.298.158-.55.34-.76.556A13.14 13.14 0 011.179 12a13.074 13.074 0 013.676-9.844c.21-.216.462-.398.76-.556a3.172 3.172 0 002.117-.582A12.986 12.986 0 0112 2.25a12.978 12.978 0 015.381 1.588 3.17 3.17 0 002.117.582c.298-.158.55-.34.76-.556A13.083 13.083 0 0122.82 12a13.072 13.072 0 01-3.676 9.844c-.21.216-.462.398-.76.556zM12 6.865a5.134 5.134 0 110 10.27 5.134 5.134 0 010-10.27zm0 1.802a3.327 3.327 0 110 6.654 3.327 3.327 0 010-6.654z', label: 'YouTube' },
                { icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z', label: 'Twitter' },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-wakefit-cream rounded-xl flex items-center justify-center text-wakefit-gray hover:bg-wakefit-orange hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
            <p className="text-center text-body-sm text-wakefit-gray">
              © {new Date().getFullYear()} Wakefit Innovations Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}