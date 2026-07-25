'use client'

import { 
  useEffect, 
  useRef, 
  useState, 
  useCallback, 
  createContext, 
  useContext, 
  ReactNode,
  KeyboardEvent,
  FocusEvent
} from 'react'
import { motion } from 'framer-motion'
import { animationVariants, transitions } from './Animation'
import { cn } from '@/lib/utils'

/**
 * Skip Link Component
 * Must be the first focusable element on the page
 */
export function SkipLink({ 
  href = '#main-content', 
  children = 'Skip to main content',
  className 
}: { 
  href?: string; 
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[120]',
        'px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
    >
      {children}
    </a>
  )
}

/**
 * Focus Trap Hook
 * Traps focus within a container (for modals, drawers, etc.)
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(enabled = true) {
  const containerRef = useRef<T>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback((e: any) => {
    if (!enabled || e.key !== 'Tab') return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return;

    // Save the element that currently has focus so we can restore it later
    previousActiveElement.current = document.activeElement as HTMLElement;

    const listener = (e: Event) => {
      handleKeyDown(e);
    };

    document.addEventListener('keydown', listener);

    // Focus the first focusable element inside the container when the trap activates
    const container = containerRef.current;
    if (container) {
      const firstFocusable = container.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }

    // Cleanup: remove listener and restore focus
    return () => {
      document.removeEventListener('keydown', listener);
      previousActiveElement.current?.focus();
    };
  }, [enabled, handleKeyDown])

  return containerRef
}

/**
 * Focus Trap Component
 * Wrapper that traps focus within its children
 */
export function FocusTrap({ 
  children, 
  enabled = true,
  onEscape,
  className 
}: { 
  children: React.ReactNode;
  enabled?: boolean;
  onEscape?: () => void;
  className?: string;
}) {
  const containerRef = useFocusTrap<HTMLDivElement>(enabled)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && onEscape) {
      onEscape()
    }
  }, [onEscape])

  return (
    <div 
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={cn('focus-trap', className)}
    >
      {children}
    </div>
  )
}

/**
 * ARIA Utilities
 */
export function getAriaDescribedBy(...ids: (string | undefined)[]) {
  return ids.filter(Boolean).join(' ') || undefined
}

export function getAriaLabelledBy(...ids: (string | undefined)[]) {
  return ids.filter(Boolean).join(' ') || undefined
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

export function useId(prefix = 'id') {
  const [id] = useState(() => generateId(prefix))
  return id
}

/**
 * Live Region Component
 * For announcing dynamic content changes to screen readers
 */
export function LiveRegion({ 
  message, 
  politeness = 'polite',
  className 
}: { 
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={cn('sr-only', className)}
    >
      {message}
    </div>
  )
}

/**
 * Screen Reader Only Utility
 */
export function ScreenReaderOnly({ children, className }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <span className={cn('sr-only', className)}>
      {children}
    </span>
  )
}

/**
 * Reduced Motion Hook
 */
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

/**
 * Keyboard Navigation Hook
 * Handles arrow key navigation for menus, lists, grids
 */
interface UseKeyboardNavigationOptions {
  orientation?: 'horizontal' | 'vertical' | 'grid'
  columns?: number
  wrap?: boolean
  onSelect?: (index: number) => void
}

export function useKeyboardNavigation(
  itemCount: number,
  options: UseKeyboardNavigationOptions = {}
) {
  const { orientation = 'vertical', columns = 1, wrap = true, onSelect } = options
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let newIndex = focusedIndex

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (orientation === 'vertical' || orientation === 'grid') {
          newIndex = focusedIndex + columns
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (orientation === 'vertical' || orientation === 'grid') {
          newIndex = focusedIndex - columns
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (orientation === 'horizontal' || orientation === 'grid') {
          newIndex = focusedIndex + 1
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (orientation === 'horizontal' || orientation === 'grid') {
          newIndex = focusedIndex - 1
        }
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = itemCount - 1
        break
      case 'Enter':
      case ' ':
        if (focusedIndex >= 0 && onSelect) {
          e.preventDefault()
          onSelect(focusedIndex)
        }
        break
    }

    // Handle wrapping
    if (wrap) {
      if (newIndex >= itemCount) newIndex = 0
      if (newIndex < 0) newIndex = itemCount - 1
    } else {
      newIndex = Math.max(0, Math.min(itemCount - 1, newIndex))
    }

    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex)
    }
  }, [focusedIndex, itemCount, orientation, columns, wrap, onSelect])

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
  }
}

/**
 * Semantic HTML Wrapper Components
 */
export function MainContent({ children, className }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <main 
      id="main-content" 
      className={cn('main-content', className)}
      tabIndex={-1}
    >
      {children}
    </main>
  )
}

export function PageHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <header className={cn('page-header', className)}>
      {children}
    </header>
  )
}

export function SectionLandmark({ 
  children, 
  label,
  className 
}: { 
  children: React.ReactNode; 
  label: string;
  className?: string;
}) {
  return (
    <section 
      aria-labelledby={label ? `${label}-heading` : undefined}
      className={cn('section-landmark', className)}
    >
      {children}
    </section>
  )
}

/**
 * ARIA Dialog Component
 * Accessible modal dialog with proper focus management
 */
interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Dialog({ 
  open, 
  onClose, 
  title, 
  description, 
  children, 
  size = 'md'
}: DialogProps) {
  const titleId = useId('dialog-title')
  const descriptionId = useId('dialog-description')
  const containerRef = useFocusTrap<HTMLDivElement>(true)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!open) return null

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants.modalOverlay}
      transition={transitions.modal}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={animationVariants.modalContent}
        transition={transitions.spring}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl',
          size === 'sm' && 'max-w-sm',
          size === 'md' && 'max-w-lg',
          size === 'lg' && 'max-w-2xl',
          size === 'xl' && 'max-w-4xl',
          size === 'full' && 'max-w-[90vw] m-4'
        )}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 id={titleId} className="text-heading-lg font-semibold text-foreground">
              {title}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg text-muted-foreground hover:text-foreground',
                'hover:bg-accent transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {description && (
            <p id={descriptionId} className="text-body-md text-muted-foreground mb-6">
              {description}
            </p>
          )}
          
          <div 
            role="document"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
          >
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Accessible Dropdown Menu
 */
interface DropdownProps {
  trigger: React.ReactNode
  items: Array<{
    label: string
    onClick: () => void
    disabled?: boolean
    icon?: React.ReactNode
    danger?: boolean
  }>
  align?: 'left' | 'right'
}

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { focusedIndex, handleKeyDown } = useKeyboardNavigation(items.length, {
    orientation: 'vertical',
    wrap: true,
  })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return
      if (menuRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleItemKeyDown = (e: KeyboardEvent, index: number) => {
    handleKeyDown(e)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      items[index]?.onClick()
      setOpen(false)
      triggerRef.current?.focus()
    }
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
      >
        {trigger}
      </button>

      {open && (
        <motion.div
          ref={menuRef}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants.dropdownContent}
          transition={transitions.dropdown}
          role="menu"
          aria-orientation="vertical"
          className={cn(
            'absolute top-full mt-1 z-[70] min-w-[200px] bg-background rounded-lg border border-border shadow-lg py-1',
            align === 'right' && 'right-0',
            align === 'left' && 'left-0'
          )}
        >
          {items.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
              onKeyDown={(e) => handleItemKeyDown(e, index)}
              disabled={item.disabled}
              role="menuitem"
              tabIndex={index === focusedIndex ? 0 : -1}
              className={cn(
                'w-full px-4 py-2 text-left text-body-md transition-colors',
                'focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground',
                'disabled:opacity-50 disabled:pointer-events-none',
                item.danger && 'text-destructive hover:bg-destructive/10',
                !item.danger && 'hover:bg-accent hover:text-accent-foreground'
              )}
              style={{ opacity: item.disabled ? 0.5 : 1 }}
            >
              <span className="flex items-center gap-3">
                {item.icon && <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  )
}

/**
 * Accessible Tabs Component
 */
interface TabsProps {
  tabs: Array<{
    id: string
    label: string
    content: React.ReactNode
    disabled?: boolean
  }>
  defaultTab?: string
  onChange?: (id: string) => void
  className?: string
}

export function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let newIndex = index
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        newIndex = (index + 1) % tabs.length
        break
      case 'ArrowLeft':
        e.preventDefault()
        newIndex = (index - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = tabs.length - 1
        break
    }
    
    if (newIndex !== index && !tabs[newIndex].disabled) {
      setActiveTab(tabs[newIndex].id)
    }
  }

  return (
    <div className={className} role="tablist" aria-orientation="horizontal">
      <div className="flex gap-2 border-b border-border pb-px">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            aria-disabled={tab.disabled}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => {
              if (!tab.disabled) {
                setActiveTab(tab.id)
                onChange?.(tab.id)
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors relative',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              tab.disabled 
                ? 'text-muted-foreground cursor-not-allowed' 
                : activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
            )}
            disabled={tab.disabled}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            initial={false}
            animate={activeTab === tab.id ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn('animate-in fade-in slide-up', activeTab !== tab.id && 'hidden')}
          >
            {tab.content}
          </motion.div>
        ))}
      </div>
    </div>
  )
}