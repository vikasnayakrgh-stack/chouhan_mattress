/**
 * Chouhan Mattress - Accessible Breadcrumbs Component
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';
import { BreadcrumbItem } from '@/types/plp';
import { cn } from '@/lib/utils';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs md:text-sm text-gray-500 py-3', className)}
    >
      <ol className="flex items-center flex-wrap gap-1.5 list-none m-0 p-0">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-[#F26522] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] rounded"
          >
            <HomeIcon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isCurrent;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  className="font-medium text-gray-900 truncate max-w-[200px]"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#F26522] transition-colors truncate max-w-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] rounded"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
