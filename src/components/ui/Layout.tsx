'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

/**
 * Container Component
 * Configurable max-width container with responsive padding
 * Based on Wakefit's 1400px max container
 */
export interface ContainerProps {
  children: ReactNode
  size?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'wakefit' | 'screen'
  className?: string
  as?: 'div' | 'main' | 'section' | 'article' | 'header' | 'footer' | 'nav' | 'aside'
}

export function Container({ 
  children, 
  size = 'wakefit', 
  className, 
  as: Component = 'div' 
}: ContainerProps) {
  const sizeClasses = {
    none: 'max-w-none',
    xs: 'max-w-[20rem]',
    sm: 'max-w-[24rem]',
    md: 'max-w-[28rem]',
    lg: 'max-w-[32rem]',
    xl: 'max-w-[36rem]',
    '2xl': 'max-w-[42rem]',
    '3xl': 'max-w-[48rem]',
    '4xl': 'max-w-[56rem]',
    '5xl': 'max-w-[64rem]',
    '6xl': 'max-w-[72rem]',
    '7xl': 'max-w-[80rem]',
    full: 'max-w-full',
    wakefit: 'max-w-[87.5rem]', // 1400px
    screen: 'max-w-screen',
  }

  return (
    <Component className={cn(
      'mx-auto w-full',
      'px-4 sm:px-6 lg:px-8 xl:px-12',
      sizeClasses[size],
      className
    )}>
      {children}
    </Component>
  )
}

/**
 * Grid Component
 * Responsive grid system with auto-fit and fixed-column variants
 * Implements exact grid patterns from Wakefit audit
 */
export interface GridProps {
  children: ReactNode
  cols?: number | { sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number }
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'card' | 'category' | 'section'
  className?: string
  as?: 'div' | 'ul' | 'ol'
  autoFit?: boolean
  minItemWidth?: string
}

export function Grid({ 
  children, 
  cols = 1, 
  gap = 'md', 
  className, 
  as: Component = 'div',
  autoFit = false,
  minItemWidth = '280px'
}: GridProps) {
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
    card: 'gap-6',          // 24px - product cards
    category: 'gap-4',      // 16px - category cards
    section: 'gap-8 md:gap-12', // 32px/48px - sections
  }

  let gridTemplateCols = ''
  
  if (autoFit) {
    gridTemplateCols = `grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]`
  } else if (typeof cols === 'object') {
    const parts: string[] = []
    if (cols.sm) parts.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) parts.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) parts.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) parts.push(`xl:grid-cols-${cols.xl}`)
    if (cols['2xl']) parts.push(`2xl:grid-cols-${cols['2xl']}`)
    gridTemplateCols = `grid-cols-1 ${parts.join(' ')}`
  } else {
    gridTemplateCols = `grid-cols-${cols}`
  }

  return (
    <Component className={cn(
      'grid',
      gridTemplateCols,
      gapClasses[gap],
      className
    )}>
      {children}
    </Component>
  )
}

/**
 * Flex Component
 * Flexible flexbox wrapper with common patterns
 */
export interface FlexProps {
  children: ReactNode
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  wrap?: boolean
  className?: string
  as?: 'div' | 'nav' | 'header' | 'footer' | 'ul' | 'ol'
}

export function Flex({ 
  children, 
  direction = 'row', 
  align = 'stretch', 
  justify = 'start', 
  gap = 'none', 
  wrap = false, 
  className, 
  as: Component = 'div' 
}: FlexProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  }
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  }
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }
  
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  }

  return (
    <Component className={cn(
      'flex',
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      gapClasses[gap],
      wrap && 'flex-wrap',
      className
    )}>
      {children}
    </Component>
  )
}

/**
 * Section Component
 * Consistent vertical rhythm for page sections
 * Implements Wakefit's section padding system
 */
export interface SectionProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  as?: 'section' | 'div' | 'article'
  id?: string
  'aria-labelledby'?: string
}

export function Section({ 
  children, 
  size = 'md', 
  className, 
  as: Component = 'section',
  id,
  'aria-labelledby': ariaLabelledBy
}: SectionProps) {
  const sizeClasses = {
    sm: 'py-12 sm:py-16 lg:py-20',           // 48px → 80px
    md: 'py-16 sm:py-20 lg:py-24 xl:py-32',  // 64px → 128px
    lg: 'py-20 sm:py-24 lg:py-32 xl:py-40',  // 80px → 160px
    xl: 'py-24 sm:py-28 lg:py-40 xl:py-48',  // 96px → 192px
  }

  return (
    <Component 
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'w-full',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * Stack Component
 * Vertical or horizontal stack with consistent spacing
 */
export interface StackProps {
  children: ReactNode
  direction?: 'vertical' | 'horizontal'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  as?: 'div' | 'ul' | 'ol'
}

export function Stack({ 
  children, 
  direction = 'vertical', 
  gap = 'md', 
  className, 
  as: Component = 'div' 
}: StackProps) {
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  }

  return (
    <Component className={cn(
      'flex',
      direction === 'vertical' ? 'flex-col' : 'flex-row',
      gapClasses[gap],
      className
    )}>
      {children}
    </Component>
  )
}

/**
 * Divider Component
 * Semantic horizontal rule with styling options
 */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  className?: string
  'aria-orientation'?: 'horizontal' | 'vertical'
}

export function Divider({ 
  orientation = 'horizontal', 
  variant = 'solid', 
  className,
  'aria-orientation': ariaOrientation = orientation
}: DividerProps) {
  const baseClasses = 'border-border'
  
  const orientationClasses = {
    horizontal: 'w-full',
    vertical: 'h-full',
  }
  
  const variantClasses = {
    solid: 'border',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  }

  if (orientation === 'vertical') {
    return (
      <div 
        className={cn(
          'h-full border-l',
          variantClasses[variant],
          baseClasses,
          className
        )}
        role="separator"
        aria-orientation={ariaOrientation}
      />
    )
  }

  return (
    <hr 
      className={cn(
        'w-full border-t',
        variantClasses[variant],
        baseClasses,
        className
      )}
      role="separator"
      aria-orientation={ariaOrientation}
    />
  )
}

/**
 * Responsive Visibility Utilities
 * Show/hide elements at specific breakpoints
 */
export interface VisibleProps {
  children: ReactNode
  at?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  until?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  only?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export function Visible({ children, at, until, only, className }: VisibleProps) {
  let displayClasses = ''
  
  if (only) {
    displayClasses = `hidden ${only}:block`
  } else {
    const show = at ? `${at}:block` : 'block'
    const hide = until ? `${until}:hidden` : ''
    displayClasses = `${show} ${hide}`.trim()
  }
  
  return (
    <div className={cn(displayClasses, className)}>
      {children}
    </div>
  )
}

export interface HiddenProps {
  children: ReactNode
  at?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  until?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  only?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export function Hidden({ children, at, until, only, className }: HiddenProps) {
  let displayClasses = ''
  
  if (only) {
    displayClasses = `block ${only}:hidden`
  } else {
    const hide = at ? `${at}:hidden` : ''
    const show = until ? `${until}:block` : ''
    displayClasses = `${hide} ${show}`.trim()
  }
  
  return (
    <div className={cn(displayClasses, className)}>
      {children}
    </div>
  )
}