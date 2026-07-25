/**
 * Accessibility Utilities
 * WCAG 2.1 AA compliant patterns and utilities
 */

// Screen reader only utility
export const srOnly = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// Focus visible styles
export const focusVisible = `
  &:focus-visible {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-color: var(--color-primary);
  }
`;

// Skip link component styles
export const skipLink = `
  ${srOnly}
  &:focus {
    position: fixed;
    top: var(--space-4);
    left: var(--space-4);
    z-index: var(--z-toast);
    padding: var(--space-2) var(--space-4);
    background: var(--color-primary);
    color: var(--color-primary-foreground);
    border-radius: var(--radius);
    font-weight: var(--font-weight-medium);
  }
`;

// Live region for announcements
export function LiveRegion({ 
  politeness = 'polite', 
  children, 
  id 
}: { 
  politeness?: 'polite' | 'assertive'; 
  children: React.ReactNode; 
  id?: string;
}) {
  return (
    <div
      id={id}
      role={politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={politeness}
      aria-atomic="true"
      className={srOnly}
    >
      {children}
    </div>
  );
}

// Focus trap hook
export function useFocusTrap(enabled: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
    
    container.addEventListener('keydown', handleTab);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  }, [enabled]);
  
  return containerRef;
}

// ARIA utilities
export const aria = {
  // Generate unique IDs for aria relationships
  generateId: (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Get labelledby attributes
  getAriaLabelledBy: (...ids: (string | undefined)[]) => 
    ids.filter(Boolean).join(' ') || undefined,
  
  // Get describedby attributes
  getAriaDescribedBy: (...ids: (string | undefined)[]) => 
    ids.filter(Boolean).join(' ') || undefined,
  
  // Menu roles
  menu: { role: 'menu' as const },
  menuitem: { role: 'menuitem' as const },
  menubar: { role: 'menubar' as const },
  
  // Dialog roles
  dialog: { role: 'dialog' as const, ariaModal: true },
  alertdialog: { role: 'alertdialog' as const, ariaModal: true },
  
  // Listbox/combobox
  listbox: { role: 'listbox' as const },
  option: { role: 'option' as const },
  combobox: { role: 'combobox' as const },
  
  // Tablist
  tablist: { role: 'tablist' as const },
  tab: { role: 'tab' as const },
  tabpanel: { role: 'tabpanel' as const },
  
  // Carousel
  region: { role: 'region' as const },
};

// Keyboard navigation helpers
export function useArrowNavigation(
  items: HTMLElement[],
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
    onSelect?: (index: number) => void;
  } = {}
) {
  const { orientation = 'horizontal', loop = true, onSelect } = options;
  
  return useCallback((e: React.KeyboardEvent) => {
    const currentIndex = items.findIndex(el => el === document.activeElement);
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          nextIndex = currentIndex + 1;
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          nextIndex = currentIndex - 1;
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          nextIndex = currentIndex + 1;
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          nextIndex = currentIndex - 1;
        }
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect?.(currentIndex);
        return;
      default:
        return;
    }
    
    if (loop) {
      if (nextIndex >= items.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = items.length - 1;
    } else {
      nextIndex = Math.max(0, Math.min(nextIndex, items.length - 1));
    }
    
    items[nextIndex]?.focus();
  }, [items, orientation, loop, onSelect]);
}

// Reduced motion hook
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReduced;
}

// Color contrast utilities
export function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = hex.replace('#', '').match(/.{2}/g)?.map(c => parseInt(c, 16) / 255) || [0, 0, 0];
    const linear = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsWCAG(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA', size: 'normal' | 'large' = 'normal'): boolean {
  const ratio = getContrastRatio(foreground, background);
  const thresholds = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 }
  };
  return ratio >= thresholds[level][size];
}

// Semantic HTML wrapper components
export function MainContent({ children, id = 'main-content' }: { children: React.ReactNode; id?: string }) {
  return <main id={id} className="min-h-[calc(100vh-200px)]">{children}</main>;
}

export function PageHeader({ children, level = 1 }: { children: React.ReactNode; level?: 1 | 2 | 3 }) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <header><Tag>{children}</Tag></header>;
}

export function SectionLandmark({ 
  children, 
  label, 
  id 
}: { 
  children: React.ReactNode; 
  label: string; 
  id?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className={srOnly}>{label}</h2>
      {children}
    </section>
  );
}

// Color mode utilities
export function useColorScheme(): 'light' | 'dark' {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setScheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handler = (e: MediaQueryListEvent) => setScheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return scheme;
}

// Add missing imports
import { useState, useEffect, useCallback, useRef } from 'react';