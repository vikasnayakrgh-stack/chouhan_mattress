'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { motion, Variants, Transition } from 'framer-motion'

/**
 * Animation Presets
 * Based on Wakefit's audit: 300ms standard, easings, keyframes
 */

// Framer Motion variants matching our design tokens
export const animationVariants = {
  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } as Variants,
  
  fadeOut: {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  } as Variants,
  
  // Slide animations
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  } as Variants,
  
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  } as Variants,
  
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  } as Variants,
  
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  } as Variants,
  
  // Scale animations
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  } as Variants,
  
  scaleOut: {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.95 },
  } as Variants,
  
  // Stagger children
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  } as Variants,
  
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  } as Variants,
  
  // Page transitions
  pageEnter: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
    },
  } as Variants,
  
  // Modal/Dialog
  modalOverlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,
  
  modalContent: {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20,
      transition: { duration: 0.2 }
    },
  } as Variants,
  
  // Drawer (side panel)
  drawerOverlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,
  
  drawerContent: {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      x: '100%',
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
    },
  } as Variants,
  
  // Dropdown/Menu
  dropdownOverlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,
  
  dropdownContent: {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.15, ease: [0, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.1, ease: [0.4, 0, 1, 1] }
    },
  } as Variants,
  
  // Tooltip
  tooltip: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.1 }
    },
  } as Variants,
  
  // Toast
  toast: {
    hidden: { opacity: 0, x: 100, scale: 0.9 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      x: 100, 
      scale: 0.9,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }
    },
  } as Variants,
  
  // Card hover
  cardHover: {
    initial: { y: 0, boxShadow: '0 2px 8px 0 rgb(0 0 0 / 0.08), 0 1px 3px 0 rgb(0 0 0 / 0.05)' },
    hover: { 
      y: -4, 
      boxShadow: '0 12px 24px -8px rgb(0 0 0 / 0.12), 0 4px 12px -4px rgb(0 0 0 / 0.08)',
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
  } as Variants,
  
  // Button press
  buttonPress: {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  } as Variants,
  
  // Image reveal
  imageReveal: {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
    },
  } as Variants,
  
  // Shimmer loading
  shimmer: {
    hidden: { backgroundPosition: '-200% 0' },
    visible: { 
      backgroundPosition: '200% 0',
      transition: { duration: 2, repeat: Infinity, ease: 'linear' }
    },
  } as Variants,
  
  // Float animation
  float: {
    initial: { y: 0 },
    animate: { 
      y: [-10, 10, -10],
      transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
    },
  } as Variants,
  
  // Wiggle
  wiggle: {
    initial: { rotate: 0 },
    animate: { 
      rotate: [-3, 3, -3],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
    },
  } as Variants,
  
  // Countdown tick
  countdownTick: {
    initial: { scale: 1, opacity: 1 },
    animate: { 
      scale: [1, 1.1, 1],
      opacity: [1, 0.7, 1],
      transition: { duration: 1, ease: [0.4, 0, 0.2, 1] }
    },
  } as Variants,
}

// Standard transitions matching design tokens
export const transitions = {
  instant: { duration: 0 },
  fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  normal: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  slow: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  slower: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  carousel: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  modal: { duration: 0.2, ease: [0, 0, 0.2, 1] },
  tooltip: { duration: 0.1, ease: [0.4, 0, 0.2, 1] },
  dropdown: { duration: 0.15, ease: [0, 0, 0.2, 1] },
  
  // Spring easings
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springGentle: { type: 'spring', stiffness: 200, damping: 25 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 20 },
  snappy: { duration: 0.2, ease: [0.2, 0, 0, 1] },
  gentle: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  
  // Entrance/exit
  enter: { duration: 0.3, ease: [0, 0, 0.2, 1] },
  exit: { duration: 0.2, ease: [0.4, 0, 1, 1] },
}

// Motion components with presets
export function FadeIn({ children, delay = 0, className, ...props }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.fadeIn}
      transition={{ ...transitions.normal, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideUp({ children, delay = 0, className, ...props }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.slideUp}
      transition={{ ...transitions.normal, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideDown({ children, delay = 0, className, ...props }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.slideDown}
      transition={{ ...transitions.normal, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0, className, ...props }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.scaleIn}
      transition={{ ...transitions.normal, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, delay = 0, className, ...props }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants.staggerContainer}
      transition={{ ...transitions.normal, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, ...props }: { 
  children: React.ReactNode; 
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      variants={animationVariants.staggerItem}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// AnimatePresence wrapper for exit animations
export function AnimateWrapper({ 
  children, 
  mode = 'popLayout',
  className,
  ...props 
}: { 
  children: React.ReactNode; 
  mode?: 'popLayout' | 'wait' | 'sync';
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants.fadeIn}
      transition={transitions.normal}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Page transition component
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants.pageEnter}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

// Modal transition
export function ModalTransition({ isOpen, onClose, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial="hidden"
      animate={isOpen ? 'visible' : 'hidden'}
      variants={animationVariants.modalOverlay}
      transition={transitions.modal}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        exit="exit"
        variants={animationVariants.modalContent}
        transition={transitions.spring}
        onClick={(e) => e.stopPropagation()}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl p-6 md:p-8"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Drawer transition
export function DrawerTransition({ isOpen, onClose, children, position = 'right' }: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
}) {
  const variants = {
    right: animationVariants.drawerContent,
    left: { ...animationVariants.drawerContent, hidden: { x: '-100%' } },
    top: { ...animationVariants.drawerContent, hidden: { y: '-100%' } },
    bottom: { ...animationVariants.drawerContent, hidden: { y: '100%' } },
  }[position]
  
  return (
    <motion.div
      initial="hidden"
      animate={isOpen ? 'visible' : 'hidden'}
      variants={animationVariants.drawerOverlay}
      transition={transitions.normal}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        exit="exit"
        variants={variants}
        transition={transitions.spring}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'fixed z-[90] bg-background shadow-2xl',
          position === 'right' && 'right-0 top-0 h-full w-full md:w-96',
          position === 'left' && 'left-0 top-0 h-full w-full md:w-96',
          position === 'top' && 'top-0 left-0 right-0 h-auto',
          position === 'bottom' && 'bottom-0 left-0 right-0 h-auto'
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Toast container
export function ToastContainer({ toasts, onClose }: { 
  toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>; 
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[120] flex flex-col gap-2">
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants.toast}
          transition={transitions.spring}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl min-w-[300px] max-w-md',
            toast.type === 'success' && 'bg-green-50 text-green-800 border border-green-200',
            toast.type === 'error' && 'bg-red-50 text-red-800 border border-red-200',
            toast.type === 'info' && 'bg-blue-50 text-blue-800 border border-blue-200'
          )}
          onClick={() => onClose(toast.id)}
        >
          <span className="flex-1 text-sm">{toast.message}</span>
        </motion.div>
      ))}
    </div>
  )
}

// Card with hover animation
export function AnimatedCard({ 
  children, 
  className, 
  hover = true,
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  hover?: boolean;
  [key: string]: any;
}) {
  return (
    <motion.div
      variants={animationVariants.cardHover}
      initial="initial"
      animate={hover ? 'hover' : undefined}
      whileHover={hover ? 'hover' : undefined}
      className={cn('group relative', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Button with press animation
export function AnimatedButton({ 
  children, 
  className, 
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.button
      variants={animationVariants.buttonPress}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Image with reveal animation
export function AnimatedImage({ 
  src, 
  alt, 
  className, 
  delay = 0,
  priority = false,
  ...props 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  delay?: number;
  priority?: boolean;
  [key: string]: any;
}) {
  return (
    <motion.img
      src={src}
      alt={alt}
      variants={animationVariants.imageReveal}
      initial="hidden"
      animate="visible"
      transition={{ ...transitions.slow, delay }}
      className={cn('w-full h-full object-cover', className)}
      {...props}
    />
  )
}

// Shimmer loading skeleton
export function ShimmerSkeleton({ 
  className, 
  variant = 'text',
  lines = 1,
  ...props 
}: { 
  className?: string; 
  variant?: 'text' | 'card' | 'image' | 'button' | 'avatar' | 'title';
  lines?: number;
  [key: string]: any;
}) {
  const variants = {
    text: 'h-4 w-full',
    card: 'h-64 w-full rounded-xl',
    image: 'aspect-[1/1] w-full rounded-xl',
    button: 'h-11 w-24 rounded-lg',
    avatar: 'h-10 w-10 rounded-full',
    title: 'h-6 w-3/4 rounded mb-2',
  }
  
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            'bg-muted rounded animate-pulse',
            variants[variant]
          )}
          animate="visible"
          variants={animationVariants.shimmer}
          style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)' }}
        />
      ))}
    </div>
  )
}

// Hook for scroll-triggered animations
export function useScrollAnimation(options: { once?: boolean; threshold?: number; rootMargin?: string } = {}) {
  const elementRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (options.once !== false) {
            observer.unobserve(element)
          }
        } else if (!options.once) {
          setIsVisible(false)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      }
    )
    
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  
  return { ref: elementRef, isVisible }
}

// Hook for reduced motion
export function useAnimationReducedMotion() {
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

// Export all
export const animation = {
  variants: animationVariants,
  transitions,
  components: {
    FadeIn,
    SlideUp,
    SlideDown,
    ScaleIn,
    StaggerContainer,
    StaggerItem,
    AnimateWrapper,
    PageTransition,
    ModalTransition,
    DrawerTransition,
    ToastContainer,
    AnimatedCard,
    AnimatedButton,
    AnimatedImage,
    ShimmerSkeleton,
  },
  hooks: {
    useScrollAnimation,
    useReducedMotion: useAnimationReducedMotion,
  },
}

export default animation