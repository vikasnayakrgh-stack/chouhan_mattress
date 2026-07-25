/**
 * Wakefit Clone - Optimized Image Component
 * Wrapper around Next.js Image with CDN integration, responsive sizing,
 * lazy loading, and priority loading for above-fold content
 */

'use client';

import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import React from 'react';
import { BaseComponentProps } from '@/types';

export interface OptimizedImageProps extends BaseComponentProps, Omit<ImageProps, 'loader' | 'srcSet' | 'sizes' | 'onError'> {
  // Source image path (relative to CDN or full URL)
  src: string;
  // Layout preset name
  preset?: 'hero' | 'heroTall' | 'productGrid' | 'productList' | 'featured' | 'thumbnail' | 'avatar' | 'background';
  // Custom responsive config (overrides preset)
  responsiveConfig?: Partial<ResponsiveImageConfig>;
  // Priority hint (above-fold)
  priority?: boolean;
  // Placeholder type
  placeholder?: 'blur' | 'empty';
  // Custom blur data URL
  blurDataUrl?: string;
  // Alt text (required for accessibility)
  alt: string;
  // Container className (for fill layout)
  containerClassName?: string;
  // Aspect ratio (for responsive/fill layouts)
  aspectRatio?: string;
  // Show loading skeleton
  showSkeleton?: boolean;
  // Error fallback
  fallback?: React.ReactNode;
  // On load callback
  onLoad?: () => void;
  // On error callback
  onError?: (error: Error) => void;
}

interface ResponsiveImageConfig {
  layout: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  placeholder?: 'blur' | 'empty';
  quality?: number;
  widths?: number[];
}

const RESPONSIVE_CONFIGS: Record<string, ResponsiveImageConfig> = {
  hero: {
    layout: 'fill',
    sizes: '100vw',
    priority: true,
    loading: 'eager',
    placeholder: 'blur',
    quality: 85,
    widths: [640, 1024, 1280, 1920],
    width: 1920,
    height: 1080,
  },
  heroTall: {
    layout: 'fill',
    sizes: '100vw',
    priority: true,
    loading: 'eager',
    placeholder: 'blur',
    quality: 85,
    widths: [640, 1024, 1280, 1920],
    width: 1920,
    height: 1440,
  },
  productGrid: {
    layout: 'responsive',
    width: 400,
    height: 400,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw',
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 75,
    widths: [320, 400, 600, 800],
  },
  productList: {
    layout: 'responsive',
    width: 800,
    height: 450,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 75,
    widths: [400, 600, 800, 1000],
  },
  featured: {
    layout: 'responsive',
    width: 1200,
    height: 800,
    sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 80,
    widths: [640, 800, 1200, 1600],
  },
  thumbnail: {
    layout: 'fixed',
    width: 80,
    height: 80,
    priority: false,
    loading: 'lazy',
    placeholder: 'empty',
    quality: 70,
  },
  avatar: {
    layout: 'fixed',
    width: 48,
    height: 48,
    priority: false,
    loading: 'lazy',
    placeholder: 'empty',
    quality: 70,
  },
  background: {
    layout: 'fill',
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 60,
  },
};

const PLACEHOLDERS = {
  heroBlur: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  product: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
};

function getResponsiveConfig(preset: string): ResponsiveImageConfig {
  return RESPONSIVE_CONFIGS[preset] || RESPONSIVE_CONFIGS.productGrid;
}

function getPlaceholder(preset: string): string {
  if (preset === 'hero' || preset === 'heroTall') {
    return PLACEHOLDERS.heroBlur;
  }
  return PLACEHOLDERS.product;
}

function getFillLayoutProps() {
  return {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
  };
}

function getIntrinsicLayoutProps(width: number) {
  return {
    style: {
      maxWidth: '100%',
      height: 'auto',
      width: 'auto',
    } as React.CSSProperties,
  };
}

// Simple loader function
const defaultLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  if (src.startsWith('http') || src.startsWith('/')) {
    if (src.includes('ik.imagekit.io')) {
      const q = quality || 80;
      const baseUrl = src.split('?')[0];
      return `${baseUrl}?tr=w-${width},q-${q}`;
    }
    return src;
  }
  // Assume it's a relative path to the CDN
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (quality) params.set('q', quality.toString());
  const query = params.toString();
  return `https://ik.imagekit.io/2xkwa8s1i/${src}${query ? `?${query}` : ''}`;
};

export function OptimizedImage({
  src,
  preset = 'productGrid',
  responsiveConfig = {},
  priority = false,
  placeholder = 'blur',
  blurDataUrl,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio,
  showSkeleton = true,
  fallback,
  onLoad,
  onError,
  'data-testid': testId,
  ...props
}: OptimizedImageProps) {
  // Get responsive config
  const config = getResponsiveConfig(preset);
  const mergedConfig: ResponsiveImageConfig = {
    ...config,
    ...responsiveConfig,
    priority: priority ?? config.priority,
    loading: priority ? 'eager' : config.loading,
  };

  // Get placeholder
  const placeholderData = blurDataUrl || getPlaceholder(preset);

  // Determine layout props
  let layoutProps: React.HTMLAttributes<HTMLDivElement> = {};
  let imageProps: ImageProps = {
    src,
    alt,
    priority: mergedConfig.priority,
    loading: mergedConfig.loading,
    placeholder: mergedConfig.placeholder || placeholder,
    blurDataURL: mergedConfig.placeholder === 'blur' ? placeholderData : undefined,
    quality: mergedConfig.quality,
    onLoad,
    onError: (e: any) => {
      if (onError) {
        try {
          (onError as any)(e);
        } catch {
          // ignore
        }
      }
    },
    loader: defaultLoader,
  };

  switch (mergedConfig.layout) {
    case 'fixed':
      imageProps.width = mergedConfig.width;
      imageProps.height = mergedConfig.height;
      break;
    case 'intrinsic':
      imageProps.width = mergedConfig.width;
      imageProps.height = mergedConfig.height;
      layoutProps = getIntrinsicLayoutProps(mergedConfig.width!);
      break;
    case 'responsive':
      imageProps.width = mergedConfig.width || 1920;
      imageProps.height = mergedConfig.height || 1080;
      imageProps.sizes = mergedConfig.sizes;
      break;
    case 'fill':
      (imageProps as any).fill = true;
      imageProps.sizes = mergedConfig.sizes;
      // Remove width/height — Next.js fill prop is mutually exclusive with them
      delete (imageProps as any).width;
      delete (imageProps as any).height;
      break;
  }

  // Override with custom aspect ratio if provided
  if (aspectRatio && mergedConfig.layout !== 'fixed') {
    const [w, h] = aspectRatio.split('/').map(Number);
    if (mergedConfig.layout === 'responsive') {
      imageProps.width = w * 100;
      imageProps.height = h * 100;
    }
  }

  return (
    <div
      className={cn('relative overflow-hidden', containerClassName)}
      style={layoutProps.style}
      role="img"
      aria-label={alt}
      data-testid={testId}
    >
      <Image
        className={cn('transition-opacity duration-300', className)}
        {...imageProps}
        {...props}
      />
      {showSkeleton && mergedConfig.placeholder === 'blur' && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          style={{
            backgroundImage: `url("${placeholderData}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
          aria-hidden="true"
        />
      )}
      {fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted" aria-hidden="true">
          {fallback}
        </div>
      )}
    </div>
  );
}

/**
 * HeroImage - Specialized for above-fold hero banners
 * Always priority loaded with blur placeholder
 */
export interface HeroImageProps extends BaseComponentProps, Omit<OptimizedImageProps, 'preset' | 'priority' | 'placeholder' | 'height'> {
  src: string;
  alt: string;
  cta?: React.ReactNode;
  overlay?: React.ReactNode;
  height?: 'standard' | 'tall' | 'full';
}

export function HeroImage({
  src,
  alt,
  cta,
  overlay,
  height = 'standard',
  className = '',
  containerClassName = '',
  'data-testid': testId,
  ...props
}: HeroImageProps) {
  const preset = height === 'tall' ? 'heroTall' : height === 'full' ? 'hero' : 'hero';

  return (
    <div className={cn('relative w-full', containerClassName)} data-testid={testId}>
      <OptimizedImage
        src={src}
        alt={alt}
        preset={preset}
        priority={true}
        placeholder="blur"
        className={cn('w-full h-full object-cover', className)}
        containerClassName="relative"
        {...props}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      )}
      {(cta || overlay) && (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="container mx-auto max-w-6xl w-full">
            <div className="max-w-3xl animate-slide-up">
              {overlay}
              {cta}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ProductImage - Optimized for product grid/list views
 * Uses responsive sizing based on grid columns
 */
export interface ProductImageProps extends BaseComponentProps, Omit<OptimizedImageProps, 'preset'> {
  src: string;
  alt: string;
  variant?: 'grid' | 'list' | 'featured' | 'thumbnail';
  badge?: React.ReactNode;
  onClick?: () => void;
}

export function ProductImage({
  src,
  alt,
  variant = 'grid',
  badge,
  onClick,
  className = '',
  containerClassName = '',
  'data-testid': testId,
  ...props
}: ProductImageProps) {
  const presetMap = {
    grid: 'productGrid',
    list: 'productList',
    featured: 'featured',
    thumbnail: 'thumbnail',
  } as const;

  const preset = presetMap[variant];
  const isClickable = typeof onClick === 'function';

  return (
    <div
      className={cn('relative group overflow-hidden', containerClassName)}
      onClick={onClick}
      style={isClickable ? { cursor: 'pointer' } : undefined}
      data-testid={testId}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        preset={preset}
        placeholder="blur"
        className={cn(
          'transition-transform duration-500 ease-out',
          'group-hover:scale-105',
          className
        )}
        containerClassName={cn('aspect-square', containerClassName)}
        {...props}
      />
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          {badge}
        </div>
      )}
    </div>
  );
}

/**
 * AvatarImage - Optimized for user avatars/profile images
 * Circular, small, with fallback initials
 */
export interface AvatarImageProps extends BaseComponentProps, Omit<OptimizedImageProps, 'preset' | 'src'> {
  src?: string;
  alt: string;
  name?: string; // For fallback initials
  size?: number;
  fallbackColor?: string;
}

export function AvatarImage({
  src,
  alt,
  name,
  size = 48,
  fallbackColor = '#f59e0b',
  className = '',
  'data-testid': testId,
  ...props
}: AvatarImageProps) {
  return (
    <div
      className={cn('relative inline-flex shrink-0 overflow-hidden rounded-full', className)}
      style={{ width: size, height: size }}
      data-testid={testId}
    >
      {src ? (
        <OptimizedImage
          src={src}
          alt={alt}
          preset="avatar"
          placeholder="blur"
          className="w-full h-full object-cover"
          {...props}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-medium text-white"
          style={{ backgroundColor: fallbackColor }}
          aria-label={alt}
        >
          {name
            ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : '?'}
        </div>
      )}
    </div>
  );
}

/**
 * BackgroundImage - For decorative background images
 * Uses fill layout with absolute positioning
 */
export interface BackgroundImageProps extends BaseComponentProps, Omit<OptimizedImageProps, 'preset' | 'alt'> {
  src: string;
  children: React.ReactNode;
  overlay?: React.ReactNode;
  opacity?: number;
  className?: string;
}

export function BackgroundImage({
  src,
  children,
  overlay,
  opacity = 1,
  className = '',
  'data-testid': testId,
  onError,
  ...props
}: BackgroundImageProps) {
  return (
    <div className={cn('relative overflow-hidden', className)} data-testid={testId} {...props}>
      <OptimizedImage
        src={src}
        alt=""
        preset="background"
        placeholder="blur"
        priority={false}
        className={cn('absolute inset-0 w-full h-full object-cover transition-opacity duration-500', opacity < 1 && 'opacity-50')}
        containerClassName="relative"
        aria-hidden="true"
      />
      {overlay && (
        <div className="absolute inset-0 bg-black/50" style={{ opacity }} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default OptimizedImage;