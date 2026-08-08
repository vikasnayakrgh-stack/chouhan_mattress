/**
 * Chouhan Mattress - Floating Desktop Utility Cluster Component
 * Desktop-only floating tools (WhatsApp Live Support + Back-to-Top scroll trigger)
 * Dynamic bottom offset on PDP when sticky add-to-cart bar is active to prevent overlap
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUpIcon, MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import footerData from '@/data/footer.json';

export function FloatingDesktopTools() {
  const pathname = usePathname();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const isPDP = pathname?.startsWith('/product/');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappPhone = footerData.company.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=Hi%20Chouhan%20Mattress,%20I%20need%20assistance%20choosing%20the%20right%20mattress.`;

  // Shift floating tools UP on PDP when StickyAddToCartBar is visible (scrolled > 400px)
  const isStickyBarActive = isPDP && showBackToTop;

  return (
    <div
      className={cn(
        'hidden md:flex flex-col items-end gap-3 fixed right-6 z-40 font-sans transition-all duration-300 pointer-events-auto',
        isStickyBarActive ? 'bottom-20' : 'bottom-6'
      )}
    >
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="w-11 h-11 bg-slate-900/90 text-amber-400 hover:bg-slate-900 hover:text-amber-300 rounded-full shadow-lg border border-slate-700/80 backdrop-blur-xs flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group"
          aria-label="Scroll back to top"
          title="Back to Top"
        >
          <ChevronUpIcon className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* WhatsApp Live Support Floating Pill */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="h-11 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-emerald-400/30 group"
        title="Chat with Sleep Expert on WhatsApp"
      >
        <MessageCircleIcon className="w-5 h-5 fill-white text-emerald-600 group-hover:rotate-12 transition-transform" />
        <span>Sleep Expert Support</span>
      </a>
    </div>
  );
}

export default FloatingDesktopTools;
