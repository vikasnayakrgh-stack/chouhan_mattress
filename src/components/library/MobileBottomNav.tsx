/**
 * Chouhan Mattress - Mobile Bottom Navigation Bar Component
 * Enterprise-grade 56px fixed bottom navigation for mobile viewports (Thumb Zone Ergonomics).
 * Provides single-tap access to Home, Catalog, Search, Wishlist, and Cart (with live badge).
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  AwardIcon,
  SearchIcon,
  HeartIcon,
  ShoppingCartIcon,
} from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, openDrawer } = useCart();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  const NAV_ITEMS = [
    { label: 'Home', href: '/', icon: HomeIcon, type: 'link' },
    { label: 'Catalog', href: '/products', icon: AwardIcon, type: 'link' },
    { label: 'Search', href: '#', icon: SearchIcon, type: 'action', onClick: triggerSearch },
    { label: 'Wishlist', href: '/wishlist', icon: HeartIcon, type: 'link' },
    { label: 'Cart', href: '#', icon: ShoppingCartIcon, type: 'action', onClick: openDrawer, badge: cartCount },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-800 text-slate-300 md:hidden pb-[env(safe-area-inset-bottom,0px)] shadow-2xl"
    >
      <div className="flex items-center justify-around h-14 px-1">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.type === 'link' && (pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href)));

          if (item.type === 'action') {
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full min-h-[44px] px-1 transition-colors relative text-slate-400 hover:text-amber-400 active:scale-95',
                  isActive && 'text-amber-400 font-bold'
                )}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-sm border border-slate-950">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full min-h-[44px] px-1 transition-colors text-slate-400 hover:text-amber-400 active:scale-95',
                isActive && 'text-amber-400 font-bold'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-amber-400')} />
              <span className={cn('text-[10px] mt-1 font-medium tracking-tight', isActive && 'text-amber-400 font-bold')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
