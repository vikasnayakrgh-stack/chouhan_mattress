'use client'

import { cn } from '@/lib/utils'
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

const announcements = [
  {
    id: 1,
    text: 'Use code <strong>HOME</strong> (till 30th Jul) to Get up to 65% off + Additional 11% off with bank offers.',
    link: '/alloffers',
    linkText: 'Shop Now',
    background: 'bg-wakefit-orange',
    textColor: 'text-white',
  },
  {
    id: 2,
    text: '100 Nights. Zero Risk. Try the Flipper Sofa Cum Bed at home for 100 days.',
    link: '/sofa-set/flipper-sofa-cum-bed-three-seater/WSFAFLPSN3FWGR',
    linkText: 'Explore Flipper',
    background: 'bg-blue-600',
    textColor: 'text-white',
  },
  {
    id: 3,
    text: 'Free Shipping Across India on All Orders. No Minimum Purchase Required.',
    link: '/shipping',
    linkText: 'Learn More',
    background: 'bg-green-600',
    textColor: 'text-white',
  },
]

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-rotate announcements
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(prev => (prev - 1 + announcements.length) % announcements.length)
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(prev => (prev + 1) % announcements.length)
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }

  const dismiss = () => {
    setIsVisible(false)
    // Store in localStorage to not show again for this session
    sessionStorage.setItem('announcementDismissed', 'true')
  }

  // Check if user dismissed previously
  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcementDismissed')
    if (dismissed) {
      setIsVisible(false)
    }
  }, [])

  if (!isVisible) return null

  const announcement = announcements[currentIndex]

  return (
    <div className={cn('overflow-hidden transition-all duration-300', isTransitioning && 'opacity-0')}>
      <div className={cn(announcement.background, 'py-2 px-4')}>
        <div className="container-wakefit">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-4">
              <p className={cn('text-body-sm font-medium', announcement.textColor)}>
                {announcement.text}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href={announcement.link}
                className={cn(
                  'px-4 py-1.5 text-body-sm font-semibold rounded-lg transition-colors',
                  announcement.background === 'bg-wakefit-orange'
                    ? 'bg-white text-wakefit-orange hover:bg-white/90'
                    : 'bg-white/20 text-white hover:bg-white/30'
                )}
              >
                {announcement.linkText}
              </a>
              <button
                onClick={dismiss}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  announcement.background === 'bg-wakefit-orange'
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                )}
                aria-label="Dismiss announcement"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}