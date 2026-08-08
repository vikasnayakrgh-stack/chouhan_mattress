/**
 * Chouhan Mattress - Luxury Header Component
 * Deep Royal Slate Navy header with Imperial Gold accents, inline search modal trigger,
 * cart counter sync, and category mega menu sub-navigation.
 */

'use client';

import React, { useState } from 'react';
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
  SparklesIcon,
  ShieldCheckIcon,
  AwardIcon,
  CrownIcon,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  brandName?: string;
  brandLink?: string;
  navItems?: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>;
  showCart?: boolean;
  showSearch?: boolean;
  showAccount?: boolean;
  showWishlist?: boolean;
  'data-testid'?: string;
}

const CATEGORIES_SUBNAV = [
  { label: 'Royal Ortho Hybrid', tag: 'Spine Tech', href: '/category/mattresses', isSpecial: true },
  { label: 'Mattresses', href: '/category/mattresses' },
  { label: 'Custom Sized Beds', href: '/category/beds' },
  { label: 'Solid Wood Frames', href: '/category/beds' },
  { label: 'Luxury Sofas', href: '/category/sofas' },
  { label: 'Contour Pillows', href: '/category/pillows' },
  { label: 'Protectors & Linen', href: '/category/accessories' },
  { label: 'Sleep Quiz', href: '/mattress-selector', isSpecial: false },
];

const MEGA_MENUS: Record<string, {
  title: string;
  types: Array<{ label: string; desc: string; href: string }>;
  sizes: Array<{ label: string; dims: string; href: string }>;
  spotlight: { title: string; price: string; discount: string; image: string; href: string };
}> = {
  'Mattresses': {
    title: 'Mattress Collection',
    types: [
      { label: 'Orthopedic Support Foam', desc: 'Ergonomic spine alignment for back pain relief', href: '/category/mattresses' },
      { label: 'ShapeSense Memory Foam', desc: 'Zero partner disturbance & pressure relief', href: '/category/mattresses' },
      { label: 'Natural Latex Hybrid', desc: '100% Organic eco-breathable bounce', href: '/category/mattresses' },
      { label: 'Pocket Spring Luxury', desc: 'Individual pocketed coils for adaptive bounce', href: '/category/mattresses' },
    ],
    sizes: [
      { label: 'King Size Mattress', dims: '72" x 78" (182x198 cm)', href: '/category/mattresses?size=King' },
      { label: 'Queen Size Mattress', dims: '60" x 78" (152x198 cm)', href: '/category/mattresses?size=Queen' },
      { label: 'Single Size Mattress', dims: '36" x 75" (91x190 cm)', href: '/category/mattresses?size=Single' },
      { label: 'Custom Dimension Calculator', dims: 'Handcrafted to exact bed frame', href: '/size-guide' },
    ],
    spotlight: {
      title: 'ShapeSense Orthopedic Essential Mattress',
      price: '₹6,229',
      discount: '50% OFF',
      image: 'https://ik.imagekit.io/chouhan/mattress_hero1.jpg',
      href: '/product/1',
    },
  },
  'Custom Sized Beds': {
    title: 'Wooden Beds & Frames',
    types: [
      { label: 'Sheesham Solid Wood Bed', desc: 'Handcrafted solid hardwood bed frames', href: '/category/beds' },
      { label: 'Hydraulic Storage Beds', desc: 'Spacious under-bed storage space', href: '/category/beds' },
      { label: 'Upholstered Designer Beds', desc: 'Plush padded headboards', href: '/category/beds' },
    ],
    sizes: [
      { label: 'King Size Bed Frame', dims: 'For 72x78 in mattresses', href: '/category/beds' },
      { label: 'Queen Size Bed Frame', dims: 'For 60x78 in mattresses', href: '/category/beds' },
      { label: 'Custom Bed Frame Size', dims: 'Tailored dimensions', href: '/size-guide' },
    ],
    spotlight: {
      title: 'Royal Sheesham Wood King Bed',
      price: '₹18,999',
      discount: '45% OFF',
      image: 'https://ik.imagekit.io/chouhan/sofa_hero1.jpg',
      href: '/category/beds',
    },
  },
};

export function Header({
  brandName = 'Chouhan Mattress',
  brandLink = '/',
  'data-testid': testId,
}: HeaderProps) {
  const { cartCount, openDrawer } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg font-sans" data-testid={testId}>
      {/* ─── Top Luxury Gold Announcement Bar (Desktop Only) ─── */}
      <div className="hidden md:flex bg-[#090D16] text-amber-200 py-2 px-4 text-center text-xs font-medium tracking-wide border-b border-amber-900/30 items-center justify-center gap-3">
        <span className="hidden md:inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px] uppercase tracking-wider">
          <CrownIcon className="w-3.5 h-3.5 text-amber-400" /> Royal Sleep Engineering
        </span>
        <span className="text-gray-300">
          Exclusive Royal Festival Offer: Use Code <strong className="text-amber-400 font-bold uppercase">ROYALBED</strong> for <strong>Up to 55% OFF</strong> + Free White-Glove Installation
        </span>
      </div>

      {/* ─── Main Deep Royal Navy Slate Header ─── */}
      <div className="bg-[#0F172A] text-white py-2.5 sm:py-3.5 px-3.5 md:px-8 border-b border-slate-800">
        <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 focus:outline-none md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

            <Link href={brandLink} className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-black text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform border border-amber-400/40">
                <CrownIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 fill-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-none font-heading group-hover:text-amber-300 transition-colors">
                  CHOUHAN
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-amber-400 uppercase tracking-[0.2em] sm:tracking-[0.25em] leading-none mt-0.5 sm:mt-1">
                  MATTRESS
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Trigger Input Bar (Desktop/Tablet) */}
          <div className="flex-1 max-w-2xl mx-4 hidden sm:block relative">
            <button
              onClick={triggerSearch}
              className="w-full h-11 bg-slate-900/90 rounded-xl pl-10 pr-4 text-left text-xs sm:text-sm text-slate-400 flex items-center justify-between border border-slate-700/70 hover:border-amber-500/50 transition-all shadow-inner cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <SearchIcon className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                <span className="text-slate-300">Search Royal Ortho, Custom Beds, Latex, Pillows...</span>
              </div>
              <span className="text-[10px] font-bold bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                ⌘K
              </span>
            </button>
          </div>

          {/* Right: Quick Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0 text-xs font-medium">
            <div className="hidden lg:flex items-center gap-5 text-slate-300">
              <Link href="/products" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <AwardIcon className="w-3.5 h-3.5 text-amber-400" /> Catalog
              </Link>
              <Link href="/reviews" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" /> 100-Night Trial
              </Link>
              <Link href="/mattress-selector" className="hover:text-amber-400 transition-colors flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30 text-amber-300">
                <SparklesIcon className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Sleep Quiz
              </Link>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              {/* Mobile Quick Search Button */}
              <button
                onClick={triggerSearch}
                aria-label="Search Catalog"
                className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-amber-400 flex sm:hidden min-h-[44px] min-w-[44px] items-center justify-center"
                title="Search"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              <Link
                href="/account"
                aria-label="Account"
                className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white hidden sm:flex"
                title="Account"
              >
                <UserIcon className="w-5 h-5" />
              </Link>

              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-amber-400 hidden sm:flex"
                title="Wishlist"
              >
                <HeartIcon className="w-5 h-5" />
              </Link>

              <button
                onClick={openDrawer}
                aria-label="Cart"
                className="relative p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white flex items-center gap-2 bg-slate-900 border border-slate-700/60 px-2.5 sm:px-3 min-h-[44px]"
                title="Shopping Cart"
              >
                <ShoppingCartIcon className="w-5 h-5 text-amber-400" />
                <span className="hidden sm:inline-block font-semibold text-xs text-slate-200">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-extrabold px-1.5 py-0.5 rounded-full shadow-md min-w-[1.25rem] text-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Secondary Sub-Navigation Category Bar (Desktop Only with Mega Menu) ─── */}
      <div
        className="hidden md:block bg-[#0B132B] text-white relative py-2.5 px-4 md:px-8 border-t border-slate-800/80"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="container mx-auto flex items-center gap-6 text-xs font-medium whitespace-nowrap">
          {CATEGORIES_SUBNAV.map((cat, idx) => {
            const hasMegaMenu = MEGA_MENUS[cat.label];
            return (
              <div key={idx} className="relative py-1" onMouseEnter={() => hasMegaMenu && setActiveMegaMenu(cat.label)}>
                <Link
                  href={cat.href}
                  className={cn(
                    'transition-colors flex items-center gap-1.5',
                    cat.isSpecial
                      ? 'text-amber-300 font-bold bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/40 hover:bg-amber-500/25'
                      : 'text-slate-300 hover:text-amber-400',
                    activeMegaMenu === cat.label && 'text-amber-400 font-bold'
                  )}
                >
                  {cat.tag && <span className="text-[9px] bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded uppercase">{cat.tag}</span>}
                  <span>{cat.label}</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* ─── 3-Column Luxury Mega Menu Overlay ─── */}
        <AnimatePresence>
          {activeMegaMenu && MEGA_MENUS[activeMegaMenu] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-md border-b border-slate-800 text-white shadow-2xl z-50 p-8"
            >
              <div className="container mx-auto grid grid-cols-3 gap-8">
                {/* Column 1: Mattress Types */}
                <div>
                  <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
                    {MEGA_MENUS[activeMegaMenu].title}
                  </h4>
                  <div className="space-y-3">
                    {MEGA_MENUS[activeMegaMenu].types.map((t, i) => (
                      <Link
                        key={i}
                        href={t.href}
                        onClick={() => setActiveMegaMenu(null)}
                        className="block p-2 rounded-xl hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300">{t.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{t.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 2: Dimensions & Calculator */}
                <div>
                  <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
                    Popular Sizes & Custom Tools
                  </h4>
                  <div className="space-y-3">
                    {MEGA_MENUS[activeMegaMenu].sizes.map((s, i) => (
                      <Link
                        key={i}
                        href={s.href}
                        onClick={() => setActiveMegaMenu(null)}
                        className="block p-2 rounded-xl hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300">{s.label}</div>
                        <div className="text-[11px] text-amber-500/80 font-mono mt-0.5">{s.dims}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 3: Featured Spotlight Card */}
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      Spotlight Bestseller
                    </span>
                    <h5 className="font-bold text-slate-100 text-xs mt-2 line-clamp-1">
                      {MEGA_MENUS[activeMegaMenu].spotlight.title}
                    </h5>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-black text-white">{MEGA_MENUS[activeMegaMenu].spotlight.price}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">{MEGA_MENUS[activeMegaMenu].spotlight.discount}</span>
                    </div>
                  </div>

                  <Link
                    href={MEGA_MENUS[activeMegaMenu].spotlight.href}
                    onClick={() => setActiveMegaMenu(null)}
                    className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl text-center transition-colors shadow-sm"
                  >
                    Shop Bestseller Series →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0B132B] text-white p-6 space-y-4 border-t border-slate-800 md:hidden"
          >
            <div className="grid grid-cols-2 gap-3 text-sm font-medium">
              {CATEGORIES_SUBNAV.map((c, i) => (
                <Link
                  key={i}
                  href={c.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold"
                >
                  {c.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between text-xs font-medium text-slate-300">
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