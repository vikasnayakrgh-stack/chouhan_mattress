'use client'

import { cn } from '@/lib/utils'
import { XIcon, SearchIcon, ClockIcon, TrendingUpIcon, TagIcon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const recentSearches = ['Mattress', 'Sofa', 'Bed', 'Office Chair', 'Wardrobe']
const trendingSearches = ['Orthopedic Mattress', 'L-Shape Sofa', 'Storage Bed', 'Memory Foam Pillow', 'TV Unit', 'Dining Set']
const categories = [
  { name: 'Mattresses', href: '/mattresses', count: '22+', icon: '🛏️' },
  { name: 'Beds', href: '/beds', count: '45+', icon: '🛌' },
  { name: 'Sofas', href: '/sofas', count: '546+', icon: '🛋️' },
  { name: 'Furniture', href: '/furniture', count: '234+', icon: '🪑' },
  { name: 'Pillows & Bedding', href: '/bedding', count: '18+', icon: '🛏️' },
  { name: 'Home Decor', href: '/decor', count: '134+', icon: '🎨' },
]

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOpen = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleClose = () => {
    setIsOpen(false)
    setQuery('')
    setShowResults(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleClose()
  }

  useEffect(() => {
    const handleOpenSearch = () => {
      setIsOpen(true)
      setTimeout(() => inputRef.current?.focus(), 100)
    }

    window.addEventListener('open-search', handleOpenSearch)
    return () => window.removeEventListener('open-search', handleOpenSearch)
  }, [])

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(query.toLowerCase())
  )

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Search Modal */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="bg-white shadow-xl">
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-wakefit-cream transition-colors md:hidden"
                aria-label="Close search"
              >
                <XIcon className="w-6 h-6 text-wakefit-black" />
              </button>

              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-wakefit-gray w-6 h-6" />
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="Search for mattresses, sofas, beds, furniture..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowResults(e.target.value.length > 0)
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full h-12 pl-12 pr-4 bg-wakefit-cream border-wakefit-cream focus:border-wakefit-orange focus:bg-white text-body-lg placeholder:text-wakefit-gray-light rounded-lg"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-wakefit-gray hover:text-wakefit-orange transition-colors"
                    aria-label="Clear search"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              <button
                onClick={handleClose}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-wakefit-orange text-white rounded-lg font-medium text-body-md hover:bg-wakefit-orange-dark transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="border-t border-wakefit-beige max-h-[60vh] overflow-y-auto">
            {showResults && query ? (
              <div className="p-4 md:p-6 space-y-6">
                {/* Categories */}
                {filteredCategories.length > 0 && (
                  <div>
                    <h3 className="text-body-sm font-semibold text-wakefit-gray-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                      <TagIcon className="w-4 h-4" />
                      Categories
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="flex items-center gap-3 p-3 bg-wakefit-cream rounded-xl hover:bg-wakefit-orange/10 transition-colors"
                          onClick={handleClose}
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-body-sm font-medium text-wakefit-black truncate">{cat.name}</p>
                            <p className="text-caption text-wakefit-gray">{cat.count} products</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                <div>
                  <h3 className="text-body-sm font-semibold text-wakefit-gray-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                    <SearchIcon className="w-4 h-4" />
                    Suggestions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      `${query} king size`,
                      `${query} queen size`,
                      `${query} under 10000`,
                      `${query} under 20000`,
                      `${query} orthopedic`,
                      `${query} memory foam`,
                    ].map((suggestion, index) => (
                      <Link
                        key={index}
                        href={`/search?q=${encodeURIComponent(suggestion)}`}
                        className="px-4 py-2 bg-wakefit-cream text-wakefit-gray-dark rounded-lg text-body-sm hover:bg-wakefit-orange hover:text-white transition-colors"
                        onClick={handleClose}
                      >
                        {suggestion}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 md:p-6 space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-body-sm font-semibold text-wakefit-gray-dark uppercase tracking-wider flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        Recent Searches
                      </h3>
                      <button className="text-body-sm text-wakefit-orange hover:underline">Clear All</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Link
                          key={index}
                          href={`/search?q=${encodeURIComponent(search)}`}
                          className="flex items-center gap-2 px-4 py-2 bg-wakefit-cream text-wakefit-gray-dark rounded-lg text-body-sm hover:bg-wakefit-orange hover:text-white transition-colors"
                          onClick={handleClose}
                        >
                          <ClockIcon className="w-4 h-4" />
                          {search}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div>
                  <h3 className="text-body-sm font-semibold text-wakefit-gray-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                    <TrendingUpIcon className="w-4 h-4" />
                    Trending Now
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <Link
                        key={index}
                        href={`/search?q=${encodeURIComponent(search)}`}
                        className="px-4 py-2 bg-wakefit-cream text-wakefit-gray-dark rounded-lg text-body-sm hover:bg-wakefit-orange hover:text-white transition-colors"
                        onClick={handleClose}
                      >
                        {search}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Browse Categories */}
                <div>
                  <h3 className="text-body-sm font-semibold text-wakefit-gray-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                    <TagIcon className="w-4 h-4" />
                    Browse Categories
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="flex flex-col items-center gap-2 p-4 bg-wakefit-cream rounded-xl hover:bg-wakefit-orange/10 transition-colors text-center"
                        onClick={handleClose}
                      >
                        <span className="text-3xl">{cat.icon}</span>
                        <p className="text-body-sm font-medium text-wakefit-black">{cat.name}</p>
                        <p className="text-caption text-wakefit-gray">{cat.count}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}