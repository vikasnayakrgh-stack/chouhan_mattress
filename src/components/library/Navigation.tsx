/**
 * Wakefit Clone - Navigation Component
 * Reusable navigation with horizontal/vertical layouts, collapsible, accessible
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NavigationProps, NavItem } from '@/types';

export function Navigation({
  className = '',
  items = [],
  orientation = 'horizontal',
  collapsed = false,
  onItemClick,
  activeHref,
  'data-testid': testId,
}: NavigationProps) {
  return (
    <nav
      className={cn(
        'transition-all duration-300',
        orientation === 'horizontal' ? 'flex items-center' : 'flex flex-col',
        collapsed && 'overflow-hidden',
        className
      )}
      role="navigation"
      aria-label={orientation === 'horizontal' ? 'Main navigation' : 'Sidebar navigation'}
      data-testid={testId}
    >
      {orientation === 'horizontal' ? (
        <ul className="flex flex-wrap items-center gap-1" role="menubar">
          {items.map((item, index) => (
            <NavItemHorizontal
              key={index}
              item={item}
              index={index}
              isActive={item.href === activeHref}
              activeHref={activeHref}
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-1 w-full" role="menu">
          {items.map((item, index) => (
            <NavItemVertical
              key={index}
              item={item}
              index={index}
              isActive={item.href === activeHref}
              activeHref={activeHref}
              onItemClick={onItemClick}
              collapsed={collapsed}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}

// Horizontal Nav Item
function NavItemHorizontal({
  item,
  index,
  isActive,
  activeHref,
  onItemClick,
}: {
  item: NavItem;
  index: number;
  isActive: boolean;
  activeHref?: string;
  onItemClick?: (item: NavItem) => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (onItemClick) {
      onItemClick(item);
    }
  };

  if (item.external) {
    return (
      <li role="none">
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'px-3 py-2 text-sm font-medium text-wakefit-dark',
            'hover:text-wakefit-orange transition-colors rounded-lg',
            isActive && 'text-wakefit-orange bg-wakefit-orange/10'
          )}
          role="menuitem"
          data-testid={`nav-item-${index}`}
        >
          {item.icon && <span className="inline-flex mr-1.5" aria-hidden="true">{item.icon}</span>}
          {item.label}
          {item.badge && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs font-semibold text-white bg-wakefit-orange rounded-full">
              {item.badge}
            </span>
          )}
        </a>
      </li>
    );
  }

  return (
    <li role="none" className="relative">
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          isActive
            ? 'text-wakefit-orange bg-wakefit-orange/10'
            : 'text-wakefit-dark hover:text-wakefit-orange hover:bg-wakefit-gray/50'
        )}
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-haspopup={hasChildren}
        role="menuitem"
        data-testid={`nav-item-${index}`}
      >
        {item.icon && <span className="flex-shrink-0" aria-hidden="true">{item.icon}</span>}
        {item.label}
        {item.badge && (
          <span className="px-1.5 py-0.5 text-xs font-semibold text-white bg-wakefit-orange rounded-full">
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <svg
            className={cn('h-4 w-4 flex-shrink-0 transition-transform', isOpen && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {hasChildren && isOpen && (
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
                  'block px-4 py-2 text-sm transition-colors',
                  isActive && child.href === activeHref
                    ? 'text-wakefit-orange bg-wakefit-orange/10'
                    : 'text-wakefit-dark hover:text-wakefit-orange hover:bg-wakefit-gray/50'
                )}
                role="menuitem"
                onClick={() => onItemClick?.(child)}
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
    </li>
  );
}

// Vertical Nav Item
function NavItemVertical({
  item,
  index,
  isActive,
  activeHref,
  onItemClick,
  collapsed,
}: {
  item: NavItem;
  index: number;
  isActive: boolean;
  activeHref?: string;
  onItemClick?: (item: NavItem) => void;
  collapsed: boolean;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (onItemClick) {
      onItemClick(item);
    }
  };

  const label = collapsed && !hasChildren ? item.icon : item.label;

  if (item.external) {
    return (
      <li role="none">
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
            isActive
              ? 'text-wakefit-orange bg-wakefit-orange/10'
              : 'text-wakefit-dark hover:text-wakefit-orange hover:bg-wakefit-gray/50'
          )}
          role="menuitem"
          data-testid={`nav-item-${index}`}
          title={collapsed ? item.label : undefined}
        >
          {item.icon && <span className="flex-shrink-0" aria-hidden="true">{item.icon}</span>}
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
          {item.badge && !collapsed && (
            <span className="ml-auto px-1.5 py-0.5 text-xs font-semibold text-white bg-wakefit-orange rounded-full">
              {item.badge}
            </span>
          )}
        </a>
      </li>
    );
  }

  return (
    <li role="none" className="relative">
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-left',
          isActive
            ? 'text-wakefit-orange bg-wakefit-orange/10'
            : 'text-wakefit-dark hover:text-wakefit-orange hover:bg-wakefit-gray/50'
        )}
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-haspopup={hasChildren}
        role="menuitem"
        data-testid={`nav-item-${index}`}
        title={collapsed && !hasChildren ? item.label : undefined}
      >
        {item.icon && <span className="flex-shrink-0" aria-hidden="true">{item.icon}</span>}
        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
        {collapsed && !hasChildren && <span className="sr-only">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className="ml-auto px-1.5 py-0.5 text-xs font-semibold text-white bg-wakefit-orange rounded-full">
            {item.badge}
          </span>
        )}
        {!collapsed && hasChildren && (
          <svg
            className={cn('h-4 w-4 flex-shrink-0 ml-auto transition-transform', isOpen && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {!collapsed && hasChildren && isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-4 mt-1 space-y-1 border-l-2 border-wakefit-gray/20"
            role="menu"
          >
            {item.children!.map((child, childIndex) => (
              <li key={childIndex} role="none">
                <Link
                  href={child.href}
                  className={cn(
                    'block px-3 py-2 text-sm rounded-lg transition-colors',
                    isActive && child.href === activeHref
                      ? 'text-wakefit-orange bg-wakefit-orange/10'
                      : 'text-wakefit-dark hover:text-wakefit-orange hover:bg-wakefit-gray/50'
                  )}
                  role="menuitem"
                  onClick={() => onItemClick?.(child)}
                >
                  {child.icon && <span className="inline-flex mr-2" aria-hidden="true">{child.icon}</span>}
                  {child.label}
                  {child.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold text-white bg-wakefit-orange rounded-full">
                      {child.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

export default Navigation;