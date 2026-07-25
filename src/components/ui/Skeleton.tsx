/**
 * Wakefit Clone - Skeleton Component
 * Reusable loading skeletons for various content types
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { SkeletonProps, BaseComponentProps } from '@/types';

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  count = 1,
  'data-testid': testId,
}: SkeletonProps) {
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: '',
  };

  const baseStyle: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    text: {
      height: '1rem',
      borderRadius: '0.25rem',
      ...baseStyle,
    },
    circular: {
      borderRadius: '9999px',
      width: height || width || '3rem',
      height: height || width || '3rem',
      ...baseStyle,
    },
    rectangular: {
      borderRadius: '0.5rem',
      ...baseStyle,
    },
    card: {
      borderRadius: '0.75rem',
      width: '100%',
      height: '16rem',
      ...baseStyle,
    },
    product: {
      borderRadius: '0.75rem',
      width: '100%',
      height: '24rem',
      ...baseStyle,
    },
    avatar: {
      borderRadius: '9999px',
      width: '3rem',
      height: '3rem',
      ...baseStyle,
    },
    button: {
      borderRadius: '0.5rem',
      height: '2.75rem',
      width: '8rem',
      ...baseStyle,
    },
    input: {
      borderRadius: '0.5rem',
      height: '2.75rem',
      width: '100%',
      ...baseStyle,
    },
  };

  const renderSkeleton = () => (
    <div
      className={cn(
        'bg-wakefit-gray/20',
        animationClasses[animation],
        className
      )}
      style={variantStyles[variant] || variantStyles.rectangular}
      data-testid={testId}
      aria-hidden="true"
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-3" data-testid={testId}>
        {Array.from({ length: count }).map((_, index) => (
          <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
            {renderSkeleton()}
          </motion.div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
}

// Specialized skeleton components
export function TextSkeleton({
  lines = 3,
  className = '',
  ...props
}: { lines?: number; className?: string } & Omit<SkeletonProps, 'variant' | 'count'>) {
  return (
    <div className={cn('space-y-2', className)} data-testid={props['data-testid']}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '60%' : '100%'}
          animation="wave"
          {...props}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({
  className = '',
  showImage = true,
  showTitle = true,
  showDescription = true,
  showAction = true,
  ...props
}: {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showAction?: boolean;
} & Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn('bg-white rounded-xl border border-wakefit-gray/20 overflow-hidden', className)} data-testid={props['data-testid']}>
      {showImage && (
        <Skeleton
          variant="rectangular"
          className="aspect-square w-full"
          animation="wave"
        />
      )}
      <div className="p-4 space-y-3">
        {showTitle && <Skeleton variant="text" width="70%" animation="wave" />}
        {showDescription && (
          <div className="space-y-2">
            <Skeleton variant="text" width="90%" animation="wave" />
            <Skeleton variant="text" width="60%" animation="wave" />
          </div>
        )}
        {showAction && (
          <Skeleton variant="button" animation="wave" />
        )}
      </div>
    </div>
  );
}

export function ProductSkeleton({
  className = '',
  variant = 'grid',
  ...props
}: {
  className?: string;
  variant?: 'grid' | 'list' | 'featured' | 'compact' | 'masonry';
} & Omit<SkeletonProps, 'variant'>) {
  if (variant === 'list') {
    return (
      <div className={cn('flex flex-col md:flex-row bg-white rounded-xl border border-wakefit-gray/20 overflow-hidden', className)} data-testid={props['data-testid']}>
        <Skeleton variant="rectangular" className="md:w-64 aspect-square" animation="wave" />
        <div className="flex-1 p-4 md:p-6 space-y-4">
          <Skeleton variant="text" width="25%" animation="wave" />
          <Skeleton variant="text" width="75%" animation="wave" />
          <Skeleton variant="text" width="50%" animation="wave" />
          <Skeleton variant="text" width="85%" animation="wave" />
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width="1rem" height="1rem" animation="wave" />
            <Skeleton variant="circular" width="1rem" height="1rem" animation="wave" />
            <Skeleton variant="circular" width="1rem" height="1rem" animation="wave" />
            <Skeleton variant="circular" width="1rem" height="1rem" animation="wave" />
            <Skeleton variant="circular" width="1rem" height="1rem" animation="wave" />
          </div>
          <Skeleton variant="text" width="20%" animation="wave" />
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={cn('bg-white rounded-2xl border border-wakefit-gray/20 overflow-hidden', className)} data-testid={props['data-testid']}>
        <Skeleton variant="rectangular" className="aspect-[4/3] w-full" animation="wave" />
        <div className="p-6 space-y-4">
          <Skeleton variant="text" width="30%" animation="wave" />
          <Skeleton variant="text" width="75%" animation="wave" />
          <Skeleton variant="text" width="50%" animation="wave" />
          <Skeleton variant="text" width="65%" animation="wave" />
          <div className="flex items-center gap-1">
            <Skeleton variant="circular" width="1.25rem" height="1.25rem" animation="wave" />
            <Skeleton variant="circular" width="1.25rem" height="1.25rem" animation="wave" />
            <Skeleton variant="circular" width="1.25rem" height="1.25rem" animation="wave" />
            <Skeleton variant="circular" width="1.25rem" height="1.25rem" animation="wave" />
            <Skeleton variant="circular" width="1.25rem" height="1.25rem" animation="wave" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton variant="rectangular" className="h-20" animation="wave" />
            <Skeleton variant="rectangular" className="h-20" animation="wave" />
            <Skeleton variant="rectangular" className="h-20" animation="wave" />
            <Skeleton variant="rectangular" className="h-20" animation="wave" />
          </div>
          <div className="flex gap-3">
            <Skeleton variant="button" className="flex-1" animation="wave" />
            <Skeleton variant="button" className="w-12" animation="wave" />
          </div>
        </div>
      </div>
    );
  }

  // Default grid variant
  return (
    <div className={cn('bg-white rounded-xl border border-wakefit-gray/20 overflow-hidden', className)} data-testid={props['data-testid']}>
      <Skeleton variant="rectangular" className="aspect-square w-full" animation="wave" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="30%" animation="wave" />
        <Skeleton variant="text" width="75%" animation="wave" />
        <Skeleton variant="text" width="50%" animation="wave" />
        <div className="flex items-center gap-1">
          <Skeleton variant="circular" width="1rem" height="1rem" animation="wave" />
          <Skeleton variant="circular" width="1rem" height="1rem" animation="wave" />
          <Skeleton variant="circular" width="1rem" height="1rem" animation="wave" />
          <Skeleton variant="circular" width="1rem" height="1rem" animation="wave" />
          <Skeleton variant="circular" width="1rem" height="1rem" animation="wave" />
        </div>
        <Skeleton variant="text" width="20%" animation="wave" />
      </div>
    </div>
  );
}

export function AvatarSkeleton({
  className = '',
  size = 'md',
  ...props
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
} & Omit<SkeletonProps, 'variant'>) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizes[size], className)}
      animation="wave"
      {...props}
    />
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className = '',
  ...props
}: {
  rows?: number;
  columns?: number;
  className?: string;
} & Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn('bg-white rounded-xl border border-wakefit-gray/20 overflow-hidden', className)} data-testid={props['data-testid']}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-wakefit-gray/50">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-4 py-3 text-left">
                  <Skeleton variant="text" width="80%" animation="wave" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t border-wakefit-gray/20">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <Skeleton variant="text" width="90%" animation="wave" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ListSkeleton({
  items = 5,
  className = '',
  ...props
}: {
  items?: number;
  className?: string;
} & Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn('space-y-3', className)} data-testid={props['data-testid']}>
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-3 bg-white rounded-lg border border-wakefit-gray/20"
        >
          <Skeleton variant="circular" className="w-12 h-12" animation="wave" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton variant="text" width="60%" animation="wave" />
          </div>
          <Skeleton variant="text" width="20%" animation="wave" />
        </div>
      ))}
    </div>
  );
}

// Need to import motion for animated skeletons
import { motion } from 'framer-motion';

export default Skeleton;