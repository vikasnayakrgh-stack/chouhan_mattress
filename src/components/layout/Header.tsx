'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ShoppingCart, Search, User, Menu, X, ChevronDown, Truck, Shield, RotateCcw, Headphones } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const navItems = [
  { label: 'Mattresses', href: '/mattresses', hasMegaMenu: true },
  { label: 'Beds', href: '/beds', hasMegaMenu: true },
  { label: 'Sofas', href: '/sofas', hasMegaMenu: true },
  { label: 'Furniture', href: '/furniture', hasMegaMenu: true },
  { label: 'Pillows & Bedding', href: '/bedding', hasMegaMenu: true },
  { label: 'Decor', href: '/decor', hasMegaMenu: false },
  { label: 'Offers', href: '/offers', hasMegaMenu: false },
]

const megaMenuData = {
  mattresses: {
    categories: [
      { title: 'By Type', items: ['Memory Foam', 'Latex', 'Grid', 'Dual Comfort', 'Orthopedic', 'Plus', 'Rollup', 'Foldable'] },
      { title: 'By Size', items: ['King', 'Queen', 'Double', 'Single', 'Diwan', 'Kids', 'Custom'] },
      { title: 'By Thickness', items: ['5 Inch', '6 Inch', '8 Inch', '10 Inch'] },
      { title: 'By Price', items: ['Under ₹10,000', 'Under ₹20,000', 'Under ₹30,000', 'Premium'] },
    ],
    featured: {
      title: 'Best Sellers',
      products: [
        { name: 'ShapeSense Orthopedic Essential', price: '₹6,229', image: '/images/mattress-1.jpg' },
        { name: 'ShapeSense Orthopedic Classic', price: '₹6,669', image: '/images/mattress-2.jpg' },
        { name: 'Elevate Pocket Spring', price: '₹9,601', image: '/images/mattress-3.jpg' },
      ]
    }
  },
  beds: {
    categories: [
      { title: 'Bed Types', items: ['Storage Beds', 'Hydraulic Beds', 'Box Beds', 'Platform Beds', 'Poster Beds', 'Kids Beds'] },
      { title: 'By Material', items: ['Sheesham Wood', 'Engineered Wood', 'Metal', 'Upholstered'] },
      { title: 'By Size', items: ['King', 'Queen', 'Double', 'Single'] },
    ],
    featured: {
      title: 'Popular Beds',
      products: [
        { name: 'Taurus Storage Bed', price: '₹18,999', image: '/images/bed-1.jpg' },
        { name: 'Neo Hydraulic Bed', price: '₹22,999', image: '/images/bed-2.jpg' },
      ]
    }
  },
  sofas: {
    categories: [
      { title: 'Sofa Types', items: ['3 Seater', 'L-Shape', 'Sofa Cum Bed', 'Recliners', 'Leatherette', 'Fabric'] },
      { title: 'By Material', items: ['Fabric', 'Leatherette', 'Velvet', 'Linen'] },
    ],
    featured: {
      title: 'Top Picks',
      products: [
        { name: 'Dreamer 3 Seater', price: '₹24,999', image: '/images/sofa-1.jpg' },
        { name: 'L-Shape Sofa', price: '₹45,999', image: '/images/sofa-2.jpg' },
      ]
    }
  },
  furniture: {
    categories: [
      { title: 'Living Room', items: ['Coffee Tables', 'TV Units', 'Side Tables', 'Bookshelves', 'Cabinets'] },
      { title: 'Bedroom', items: ['Wardrobes', 'Dressing Tables', 'Side Tables', 'Study Tables'] },
      { title: 'Dining', items: ['Dining Sets', 'Dining Tables', 'Chairs', 'Bar Units'] },
      { title: 'Office', items: ['Office Chairs', 'Desks', 'Filing Cabinets'] },
    ],
    featured: {
      title: 'Best Selling',
      products: [
        { name: 'Frasier TV Unit', price: '₹12,999', image: '/images/furniture-1.jpg' },
        { name: 'Gravity Office Chair', price: '₹8,999', image: '/images/furniture-2.jpg' },
      ]
    }
  },
  bedding: {
    categories: [
      { title: 'Pillows', items: ['Memory Foam', 'Latex', 'Microfiber', 'Cervical', 'Body Pillows'] },
      { title: 'Comforters', items: ['Reversible', 'All Season', 'Winter', 'Summer'] },
      { title: 'Bedsheets', items: ['Cotton', 'Bamboo', 'Tencel', 'Fitted', 'Flat'] },
      { title: 'Mattress Protectors', items: ['Waterproof', 'Cotton', 'Bamboo', 'Cooling'] },
    ],
    featured: {
      title: 'Essentials',
      products: [
        { name: 'Memory Foam Pillow', price: '₹1,299', image: '/images/pillow-1.jpg' },
        { name: 'Reversible Comforter', price: '₹2,999', image: '/images/comforter-1.jpg' },
      ]
    }
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="bg-wakefit-orange text-white py-2 hidden md:block">
        <div className="container-wakefit flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Headphones className="w-4 h-4" />
              Customer Care: 1800-123-4567
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Free Shipping Across India
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-4 h-4" />
              100 Night Trial
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/signup" className="hover:underline">Sign Up</Link>
            <Link href="/track-order" className="hover:underline">Track Order</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-[60] bg-white border-b border-border transition-all duration-300',
          isScrolled && 'shadow-card bg-white/95 backdrop-blur-sm'
        )}
      >
        <div className="container-wakefit">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Wakefit Home">
              <div className="w-9 h-9 bg-wakefit-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">W</span>
              </div>
              <span className="font-heading font-bold text-xl text-wakefit-black hidden sm:block">Wakefit</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl hidden md:block relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-wakefit-gray w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search for mattresses, sofas, beds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  className="w-full h-11 pl-11 pr-4 bg-wakefit-cream border-wakefit-cream focus:border-wakefit-orange focus:bg-white text-body-md placeholder:text-wakefit-gray-light rounded-lg"
                />
              </div>
              {isSearchOpen && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="p-3 text-sm text-wakefit-gray">
                    Showing results for "{searchQuery}"
                  </div>
                  <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} className="block px-4 py-3 hover:bg-wakefit-cream">
                    View all results
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Search */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-wakefit-cream transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-wakefit-gray-dark" />
            </button>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
              <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-white z-50 p-4 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => setIsSearchOpen(false)} className="p-2" aria-label="Close search">
                    <X className="w-6 h-6" />
                  </button>
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-wakefit-gray w-5 h-5" />
                    <Input
                      type="search"
                      placeholder="Search for mattresses, sofas, beds..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full h-12 pl-11 pr-4 bg-wakefit-cream border-wakefit-cream focus:border-wakefit-orange focus:bg-white text-body-lg placeholder:text-wakefit-gray-light rounded-lg"
                    />
                  </div>
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="px-4 py-4 text-center bg-wakefit-orange text-white rounded-lg font-medium"
                >
                  {searchQuery ? 'Search' : 'Browse Categories'}
                </Link>
              </div>
            )}

            {/* Action Icons */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-wakefit-cream transition-colors" aria-label="Wishlist">
                <svg className="w-5 h-5 text-wakefit-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* User */}
              <Link href="/account" className="relative p-2 rounded-lg hover:bg-wakefit-cream transition-colors" aria-label="My Account">
                <User className="w-5 h-5 text-wakefit-gray-dark" />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-lg hover:bg-wakefit-cream transition-colors" aria-label="Cart">
                <ShoppingCart className="w-5 h-5 text-wakefit-gray-dark" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-wakefit-orange text-white text-xs font-bold rounded-full flex items-center justify-center">0</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-wakefit-cream transition-colors"
                aria-label="Open menu"
                onClick={() => document.dispatchEvent(new CustomEvent('open-mobile-menu'))}
              >
                <Menu className="w-6 h-6 text-wakefit-black" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:block border-t border-border" aria-label="Main navigation">
            <div className="relative">
              <ul className="flex items-center justify-between h-12" role="menubar">
                {navItems.map((item, index) => (
                  <li key={item.label} className="relative group" role="none">
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-3 py-2 text-body-md font-medium text-wakefit-gray-dark hover:text-wakefit-orange transition-colors relative"
                      role="menuitem"
                      aria-haspopup={item.hasMegaMenu ? 'true' : 'false'}
                      aria-expanded={activeMegaMenu === item.label.toLowerCase()}
                    >
                      {item.label}
                      {item.hasMegaMenu && (
                        <ChevronDown className="w-4 h-4 text-wakefit-gray transition-transform group-hover:rotate-180" />
                      )}
                    </Link>
                    {item.hasMegaMenu && megaMenuData[item.label.toLowerCase() as keyof typeof megaMenuData] && (
                      <div
                        className="mega-menu absolute left-0 right-0 top-full bg-white shadow-xl border-t border-border py-6 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                        role="menu"
                        onMouseEnter={() => setActiveMegaMenu(item.label.toLowerCase())}
                        onMouseLeave={() => setActiveMegaMenu(null)}
                      >
                        <div className="container-wakefit">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {megaMenuData[item.label.toLowerCase() as keyof typeof megaMenuData].categories.map((cat, catIndex) => (
                              <div key={catIndex} className="space-y-3">
                                <h4 className="font-semibold text-wakefit-black text-body-sm uppercase tracking-wider">{cat.title}</h4>
                                <ul className="space-y-2" role="none">
                                  {cat.items.map((subItem, subIndex) => (
                                    <li key={subIndex} role="none">
                                      <Link
                                        href={`/${slugify(item.label)}/${slugify(subItem)}`}
                                        className="text-body-sm text-wakefit-gray hover:text-wakefit-orange transition-colors block py-1"
                                        role="menuitem"
                                      >
                                        {subItem}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          {/* Featured Products */}
                          <div className="mt-8 pt-8 border-t border-border">
                            <h4 className="font-semibold text-wakefit-black text-body-md mb-4">{megaMenuData[item.label.toLowerCase() as keyof typeof megaMenuData].featured.title}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {megaMenuData[item.label.toLowerCase() as keyof typeof megaMenuData].featured.products.map((product, prodIndex) => (
                                <Link
                                  key={prodIndex}
                                  href={`/${slugify(item.label)}/${slugify(product.name)}`}
                                  className="flex gap-3 p-3 bg-wakefit-cream rounded-lg hover:bg-wakefit-cream/80 transition-colors"
                                >
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-body-sm font-medium text-wakefit-black truncate">{product.name}</p>
                                    <p className="text-body-sm font-bold text-wakefit-orange">{product.price}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </header>

      {/* Trust Bar */}
      <div className="hidden md:block bg-wakefit-cream border-b border-border py-4">
        <div className="container-wakefit">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 text-body-sm text-wakefit-gray-dark">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-wakefit-orange" />
                <span>7+ Years Warranty</span>
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-wakefit-orange" />
                <span>Free Shipping</span>
              </span>
              <span className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-wakefit-orange" />
                <span>100 Night Trial</span>
              </span>
              <span className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-wakefit-orange" />
                <span>Easy Returns</span>
              </span>
            </div>
            <Link href="/stores" className="text-body-sm font-medium text-wakefit-orange hover:underline flex items-center gap-1">
              <span>Find a Store Near You</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}