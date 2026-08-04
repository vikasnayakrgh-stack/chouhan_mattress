/**
 * Chouhan Mattress - Official Wakefit-Inspired Header Component
 * Pixel-perfect purple brand header with inline search bar, quick links, and category sub-nav
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  MenuIcon,
  XIcon,
  SearchIcon,
  UserIcon,
  ShoppingCartIcon,
  HeartIcon,
  MapPinIcon,
  SparklesIcon,
  HomeIcon,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  brandName?: string;
  brandLink?: string;
  navItems?: Array<{ label: string; href: string }>;
  showCart?: boolean;
  showSearch?: boolean;
  showAccount?: boolean;
  showWishlist?: boolean;
  'data-testid'?: string;
}

const CATEGORIES_SUBNAV = [
  { label: 'Zense', tag: 'Sleep Tech', href: '/zense', isSpecial: true },
  { label: 'Mattress', href: '/category/mattresses' },
  { label: 'Furniture', href: '/category/sofas' },
  { label: 'Bedroom', href: '/category/beds' },
  { label: 'Living', href: '/category/sofas' },
  { label: 'Study & Work', href: '/category/sofas' },
  { label: 'Dining & Kitchen', href: '/category/sofas' },
  { label: 'Decor & Gifting', href: '/category/accessories' },
  { label: 'Pillows & Bedding', href: '/category/pillows' },
];

export function Header({
  brandName = 'Chouhan Mattress',
  brandLink = '/',
  'data-testid': testId,
}: HeaderProps) {
  const { cartCount, openDrawer } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md font-sans">
      {/* ─── Top Black Announcement Bar ─── */}
      <div className="bg-[#121212] text-white py-2 px-4 text-center text-xs sm:text-sm font-medium tracking-wide">
        <span>Use code <strong className="text-[#F26522] uppercase">HOME</strong> (till 30th Jul) to Get up to <strong>65% OFF</strong> + Additional 11% OFF with bank offers.</span>
      </div>

      {/* ─── Main Deep Purple Header ─── */}
      <div className="bg-[#3B0764] text-white py-3 px-4 md:px-8 border-b border-purple-900/40">
        <div className="container mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

            <Link href={brandLink} className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-[#F26522] text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                <HomeIcon className="w-5 h-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-white tracking-tight leading-none group-hover:text-purple-200 transition-colors">
                  Chouhan
                </span>
                <span className="text-[10px] font-bold text-[#F26522] uppercase tracking-widest leading-none mt-0.5">
                  Mattress
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Input Bar */}
          <div className="flex-1 max-w-2xl mx-2 hidden sm:block relative">
            <button
              onClick={triggerSearch}
              className="w-full h-11 bg-white rounded-lg pl-10 pr-4 text-left text-xs sm:text-sm text-gray-500 flex items-center justify-between border border-transparent hover:border-purple-300 transition-all shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4 text-gray-400" />
                <span>Search for Mattress, Sofas, Beds, Pillows...</span>
              </div>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                ⌘K
              </span>
            </button>
          </div>

          {/* Right: Quick Links & Actions */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 text-xs font-semibold">
            <div className="hidden lg:flex items-center gap-4 text-purple-100">
              <Link href="/products" className="hover:text-white transition-colors">Home Interiors</Link>
              <Link href="/reviews" className="hover:text-white transition-colors">Retail Stores</Link>
              <Link href="/mattress-selector" className="hover:text-white transition-colors flex items-center gap-1">
                <SparklesIcon className="w-3.5 h-3.5 text-[#F26522]" /> Sleep Wizard
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/account"
                aria-label="Account"
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                title="Account"
              >
                <UserIcon className="w-5 h-5" />
              </Link>

              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white hidden sm:flex"
                title="Wishlist"
              >
                <HeartIcon className="w-5 h-5" />
              </Link>

              <button
                onClick={openDrawer}
                aria-label="Cart"
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                title="Cart"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F26522] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="mt-2 sm:hidden">
          <button
            onClick={triggerSearch}
            className="w-full h-10 bg-white rounded-lg px-3 text-left text-xs text-gray-500 flex items-center gap-2"
          >
            <SearchIcon className="w-4 h-4 text-gray-400" />
            <span>Search for Mattress, Sofas, Beds...</span>
          </button>
        </div>
      </div>

      {/* ─── Secondary Sub-Navigation Category Bar ─── */}
      <div className="bg-[#2E0552] text-white overflow-x-auto scrollbar-none py-2 px-4 md:px-8 border-t border-purple-900/30">
        <div className="container mx-auto flex items-center gap-6 text-xs font-semibold whitespace-nowrap">
          {CATEGORIES_SUBNAV.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className={cn(
                'transition-colors py-1 flex items-center gap-1.5',
                cat.isSpecial
                  ? 'text-amber-300 font-bold bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/40 hover:bg-amber-400/30'
                  : 'text-purple-100 hover:text-white'
              )}
            >
              {cat.tag && <span className="text-[9px] bg-amber-400 text-purple-950 font-black px-1.5 py-0.2 rounded uppercase">{cat.tag}</span>}
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#2E0552] text-white p-6 space-y-4 border-t border-purple-800"
          >
            <div className="grid grid-cols-2 gap-3 text-sm font-bold">
              {CATEGORIES_SUBNAV.map((c, i) => (
                <Link
                  key={i}
                  href={c.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-purple-100"
                >
                  {c.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-purple-800 flex justify-between text-xs font-semibold text-purple-200">
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link>
              <Link href="/compare" onClick={() => setIsMobileMenuOpen(false)}>Compare</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;