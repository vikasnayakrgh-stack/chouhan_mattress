/**
 * Wakefit Clone - Header Component
 * Reusable, accessible header with navigation, cart, search, and mobile menu
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import type { HeaderProps, NavItem } from '@/types';

export function Header({
  className = '',
  brandName,
  brandLink,
  logo,
  navItems = [],
  showCart = true,
  cartItemCount = 0,
  showSearch = true,
  showAccount = true,
  showWishlist = false,
  onToggleCart,
  onToggleSearch,
  onToggleMenu,
  isMenuOpen = false,
  isScrolled = false,
  'data-testid': testId,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const effectiveScrolled = isScrolled || scrolled;

  return (
    <motion.header
      ref={headerRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'bg-white/95 backdrop-blur-md border-b border-wakefit-gray/20',
        effectiveScrolled && 'shadow-lg bg-white/98',
        className
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      data-testid={testId}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href={brandLink}
              className="flex items-center gap-2"
              aria-label={`${brandName} - Home`}
              data-testid="header-brand-link"
            >
              {logo || (
                <span className="text-xl md:text-2xl font-bold text-wakefit-orange">
                  {brandName}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex flex-1 items-center justify-center gap-1"
            role="navigation"
            aria-label="Main navigation"
            data-testid="header-nav"
          >
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                item={item}
                index={index}
              />
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {showWishlist && (
              <IconButton
                icon="heart"
                aria-label="Wishlist"
                onClick={() => {}}
                data-testid="header-wishlist"
              />
            )}
            {showSearch && (
              <IconButton
                icon="search"
                aria-label="Search"
                onClick={onToggleSearch}
                data-testid="header-search"
              />
            )}
            {showAccount && (
              <IconButton
                icon="user"
                aria-label="My Account"
                onClick={() => {}}
                data-testid="header-account"
              />
            )}
            {showCart && (
              <CartButton
                count={cartItemCount}
                onClick={onToggleCart}
                data-testid="header-cart"
              />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-wakefit-gray/50 transition-colors"
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            data-testid="header-menu-toggle"
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-wakefit-gray/20 py-4"
              data-testid="header-mobile-nav"
            >
              <nav className="flex flex-col gap-1" role="navigation" aria-label="Mobile navigation">
                {navItems.map((item, index) => (
                  <MobileNavItem
                    key={index}
                    item={item}
                    index={index}
                  />
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-wakefit-gray/20">
                {showWishlist && (
                  <MobileActionButton
                    icon="heart"
                    label="Wishlist"
                    onClick={() => {}}
                  />
                )}
                {showSearch && (
                  <MobileActionButton
                    icon="search"
                    label="Search"
                    onClick={onToggleSearch}
                  />
                )}
                {showAccount && (
                  <MobileActionButton
                    icon="user"
                    label="My Account"
                    onClick={() => {}}
                  />
                )}
                {showCart && (
                  <MobileActionButton
                    icon="shopping-cart"
                    label={`Cart (${cartItemCount})`}
                    onClick={onToggleCart}
                    badge={cartItemCount}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

// Sub-components
function NavItem({ item, index }: { item: NavItem; index: number }) {
  const hasChildren = item.children && item.children.length > 0;
  const [isHovered, setIsHovered] = useState(false);

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'px-3 py-2 text-sm font-medium text-wakefit-dark',
          'hover:text-wakefit-orange transition-colors',
          'rounded-lg'
        )}
        data-testid={`nav-item-${index}`}
      >
        {item.label}
        {item.badge && (
          <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold text-white bg-wakefit-orange rounded-full">
            {item.badge}
          </span>
        )}
      </a>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`nav-item-${index}`}
    >
      <Link
        href={item.href}
        className={cn(
          'px-3 py-2 text-sm font-medium text-wakefit-dark',
          'hover:text-wakefit-orange transition-colors',
          'rounded-lg'
        )}
      >
        {item.icon && <span className="inline-flex mr-1.5" aria-hidden="true">{item.icon}</span>}
        {item.label}
        {item.badge && (
          <span className="ml-1.5 px-1.5 py-0.5 text-xs font-semibold text-white bg-wakefit-orange rounded-full">
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <svg className="ml-1 inline-block h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </Link>

      {/* Dropdown */}
      <AnimatePresence>
        {hasChildren && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 min-w-[200px] bg-white rounded-lg shadow-lg border border-wakefit-gray/20 py-2 z-50"
            role="menu"
          >
            {item.children!.map((child, childIndex) => (
              <Link
                key={childIndex}
                href={child.href}
                className={cn(
                  'block px-4 py-2 text-sm text-wakefit-dark',
                  'hover:bg-wakefit-gray/50 hover:text-wakefit-orange',
                  'transition-colors'
                )}
                role="menuitem"
              >
                {child.icon && <span className="inline-flex mr-2" aria-hidden="true">{child.icon}</span>}
                {child.label}
                {child.badge && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold text-white bg-wakefit-orange rounded-full">
                    {child.badge}
                  </span>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavItem({ item, index }: { item: NavItem; index: number }) {
  const hasChildren = item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(false);

  if (hasChildren) {
    return (
      <div data-testid={`mobile-nav-item-${index}`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'w-full px-3 py-3 text-left text-base font-medium text-wakefit-dark',
            'hover:bg-wakefit-gray/50 rounded-lg transition-colors',
            'flex items-center justify-between'
          )}
          aria-expanded={expanded}
        >
          <span>{item.icon && <span className="mr-2" aria-hidden="true">{item.icon}</span>}{item.label}</span>
          <svg
            className={cn('h-5 w-5 transition-transform', expanded && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-4 mt-1 space-y-1 border-l-2 border-wakefit-gray/20"
              role="menu"
            >
              {item.children!.map((child, childIndex) => (
                <Link
                  key={childIndex}
                  href={child.href}
                  className={cn(
                    'block px-3 py-2 text-sm text-wakefit-dark',
                    'hover:bg-wakefit-gray/50 hover:text-wakefit-orange rounded-lg',
                    'transition-colors'
                  )}
                  role="menuitem"
                >
                  {child.label}
                  {child.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold text-white bg-wakefit-orange rounded-full">
                      {child.badge}
                    </span>
                  )}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'block px-3 py-3 text-base font-medium text-wakefit-dark',
        'hover:bg-wakefit-gray/50 hover:text-wakefit-orange rounded-lg transition-colors'
      )}
      data-testid={`mobile-nav-item-${index}`}
    >
      {item.label}
      {item.badge && (
        <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold text-white bg-wakefit-orange rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function IconButton({
  icon,
  ariaLabel,
  'aria-label': ariaLabelProp,
  onClick,
  className = '',
  'data-testid': testId,
}: {
  icon: 'search' | 'user' | 'heart' | 'shopping-cart';
  ariaLabel?: string;
  'aria-label'?: string;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}) {
  const icons = {
    search: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    user: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    heart: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'shopping-cart': (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  };

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || ariaLabelProp}
      className={cn(
        'p-2 rounded-lg text-wakefit-dark',
        'hover:bg-wakefit-gray/50 hover:text-wakefit-orange transition-colors',
        className
      )}
      data-testid={testId}
    >
      {icons[icon]}
    </button>
  );
}

function CartButton({
  count,
  onClick,
  'data-testid': testId,
}: {
  count: number;
  onClick?: () => void;
  'data-testid'?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Shopping cart${count > 0 ? ` with ${count} items` : ' is empty'}`}
      className="relative p-2 rounded-lg text-wakefit-dark hover:bg-wakefit-gray/50 hover:text-wakefit-orange transition-colors"
      data-testid={testId}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center text-xs font-bold text-white bg-wakefit-orange rounded-full">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

function MobileActionButton({
  icon,
  label,
  onClick,
  badge,
}: {
  icon: 'search' | 'user' | 'heart' | 'shopping-cart';
  label: string;
  onClick?: () => void;
  badge?: number;
}) {
  const icons = {
    search: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    user: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    heart: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'shopping-cart': (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-between px-4 py-3 text-base font-medium text-wakefit-dark',
        'hover:bg-wakefit-gray/50 rounded-lg transition-colors'
      )}
    >
      <div className="flex items-center gap-3">
        <span className="p-2 rounded-lg bg-wakefit-gray/50 text-wakefit-orange" aria-hidden="true">
          {icons[icon]}
        </span>
        <span>{label}</span>
      </div>
      {badge && badge > 0 && (
        <span className="px-2 py-0.5 text-xs font-bold text-white bg-wakefit-orange rounded-full">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

export default Header;