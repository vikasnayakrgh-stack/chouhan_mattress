/**
 * Third-Party Script Loading Strategy
 * 
 * Provides optimized loading patterns for third-party scripts to minimize
 * impact on Core Web Vitals (LCP, INP, CLS) and TBT.
 * 
 * Strategies:
 * - Lazy loading: Load after page is interactive
 * - Defer loading: Load after DOM content loaded
 * - Preload + async: Preload critical third-party, execute async
 * - Facade pattern: Show placeholder, load real on interaction
 * - Web Workers: Offload heavy scripts to worker threads
 * - Partytown: Run third-party in web worker (recommended)
 */

export type ThirdPartyScriptStrategy = 
  | 'lazy'           // Load after idle callback
  | 'defer'          // Load after DOMContentLoaded
  | 'preload-async'  // Preload, execute async
  | 'facade'         // Show facade, load on interaction
  | 'worker'         // Run in web worker (Partytown)
  | 'blocking';      // Load synchronously (avoid)

export interface ThirdPartyScriptConfig {
  /** Unique identifier */
  id: string;
  /** Script URL */
  src: string;
  /** Loading strategy */
  strategy: ThirdPartyScriptStrategy;
  /** Script attributes */
  attributes?: Record<string, string>;
  /** Callback when script loads */
  onLoad?: () => void;
  /** Callback when script fails */
  onError?: (error: Error) => void;
  /** Conditions for loading */
  conditions?: {
    /** Load only on specific routes */
    routes?: string[];
    /** Load only after user interaction */
    onInteraction?: boolean;
    /** Load only after specific event */
    afterEvent?: string;
    /** Load only if consent given */
    consent?: string;
    /** Load only in viewport */
    inViewport?: string; // selector
  };
  /** Fallback content for facade strategy */
  fallback?: React.ReactNode;
  /** Script integrity */
  integrity?: string;
  /** Crossorigin attribute */
  crossorigin?: 'anonymous' | 'use-credentials';
}

/**
 * Predefined third-party script configurations for Wakefit
 */
export const thirdPartyScripts: ThirdPartyScriptConfig[] = [
  // Analytics - Load after interaction or idle
  {
    id: 'google-analytics',
    src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
    strategy: 'lazy',
    attributes: { async: 'true' },
    conditions: {
      consent: 'analytics',
      onInteraction: true,
    },
  },
  
  // Google Tag Manager - Load after idle
  {
    id: 'gtm',
    src: 'https://www.googletagmanager.com/gtm.js?id=GTM_XXXXXXX',
    strategy: 'lazy',
    conditions: {
      consent: 'analytics',
    },
  },
  
  // Facebook Pixel - Facade pattern (load on first click)
  {
    id: 'facebook-pixel',
    src: 'https://connect.facebook.net/en_US/fbevents.js',
    strategy: 'facade',
    conditions: {
      consent: 'marketing',
      onInteraction: true,
    },
    fallback: <div className="fb-pixel-placeholder" aria-hidden="true" />,
  },
  
  // Google Ads - Lazy load after consent
  {
    id: 'google-ads',
    src: 'https://www.googleadservices.com/pagead/conversion_async.js',
    strategy: 'lazy',
    conditions: {
      consent: 'marketing',
    },
  },
  
  // Hotjar - Facade pattern (load on scroll/interaction)
  {
    id: 'hotjar',
    src: 'https://static.hotjar.com/c/hotjar-XXXXXXX.js?sv=6',
    strategy: 'facade',
    conditions: {
      consent: 'analytics',
      onInteraction: true,
      inViewport: 'body', // Load when body is visible
    },
  },
  
  // Intercom - Load after user login or on support page
  {
    id: 'intercom',
    src: 'https://widget.intercom.io/widget/APP_ID',
    strategy: 'lazy',
    conditions: {
      routes: ['/account', '/help', '/contact'],
      onInteraction: true,
    },
  },
  
  // Razorpay - Load only on checkout page
  {
    id: 'razorpay',
    src: 'https://checkout.razorpay.com/v1/checkout.js',
    strategy: 'preload-async',
    conditions: {
      routes: ['/checkout'],
    },
    attributes: { 'data-partner-id': 'wakefit' },
  },
  
  // Shiprocket - Load on order tracking
  {
    id: 'shiprocket',
    src: 'https://tracking.shiprocket.in/widget.js',
    strategy: 'lazy',
    conditions: {
      routes: ['/orders/*', '/track/*'],
    },
  },
  
  // CleverTap - Mobile app integration
  {
    id: 'clevertap',
    src: 'https://wzr-clevertap.com/clevertap.js',
    strategy: 'lazy',
    conditions: {
      consent: 'analytics',
    },
  },
  
  // Microsoft Clarity - Session recording
  {
    id: 'clarity',
    src: 'https://www.clarity.ms/tag/XXXXXXXX',
    strategy: 'lazy',
    conditions: {
      consent: 'analytics',
    },
  },
  
  // TikTok Pixel
  {
    id: 'tiktok-pixel',
    src: 'https://analytics.tiktok.com/i18n/pixel/events.js',
    strategy: 'facade',
    conditions: {
      consent: 'marketing',
      onInteraction: true,
    },
  },
  
  // Snapchat Pixel
  {
    id: 'snapchat-pixel',
    src: 'https://sc-static.net/scripts/snaptr.js',
    strategy: 'lazy',
    conditions: {
      consent: 'marketing',
    },
  },
  
  // LinkedIn Insight Tag
  {
    id: 'linkedin-insight',
    src: 'https://snap.licdn.com/li.lms-analytics/insight.min.js',
    strategy: 'lazy',
    conditions: {
      consent: 'marketing',
    },
  },
  
  // Pinterest Tag
  {
    id: 'pinterest-tag',
    src: 'https://s.pinimg.com/ct/core.js',
    strategy: 'lazy',
    conditions: {
      consent: 'marketing',
    },
  },
  
  // Chat widget (Crisp/Tawk.to) - Facade pattern
  {
    id: 'crisp-chat',
    src: 'https://client.crisp.chat/l.js',
    strategy: 'facade',
    conditions: {
      onInteraction: true,
      inViewport: '#crisp-chat-button',
    },
    fallback: <ChatButtonFallback />,
  },
];

/**
 * Chat button fallback for facade pattern
 */
function ChatButtonFallback() {
  return (
    <button 
      id="crisp-chat-button"
      className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Open chat"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </button>
  );
}

/**
 * Script loader class with multiple strategies
 */
export class ThirdPartyScriptLoader {
  private loadedScripts = new Set<string>();
  private loadingPromises = new Map<string, Promise<void>>();
  private observers = new Map<string, IntersectionObserver>();
  
  /**
   * Load a script with the specified strategy
   */
  async load(config: ThirdPartyScriptConfig): Promise<void> {
    // Check if already loaded
    if (this.loadedScripts.has(config.id)) {
      return;
    }
    
    // Check if already loading
    if (this.loadingPromises.has(config.id)) {
      return this.loadingPromises.get(config.id);
    }
    
    // Check conditions
    if (!this.shouldLoad(config)) {
      return;
    }
    
    const promise = this.executeStrategy(config);
    this.loadingPromises.set(config.id, promise);
    
    try {
      await promise;
      this.loadedScripts.add(config.id);
    } catch (error) {
      console.error(`Failed to load third-party script: ${config.id}`, error);
      config.onError?.(error as Error);
    } finally {
      this.loadingPromises.delete(config.id);
    }
  }
  
  /**
   * Check if script should load based on conditions
   */
  private shouldLoad(config: ThirdPartyScriptConfig): boolean {
    if (!config.conditions) return true;
    
    // Check route
    if (config.conditions.routes?.length) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      const matches = config.conditions.routes.some(route => {
        const pattern = route.replace(/\*/g, '.*').replace(/\[([^\]]+)\]/g, '([^/]+)');
        return new RegExp(`^${pattern}$`).test(currentPath);
      });
      if (!matches) return false;
    }
    
    // Check consent (would integrate with consent management)
    if (config.conditions.consent) {
      const consent = this.getConsent(config.conditions.consent);
      if (!consent) return false;
    }
    
    return true;
  }
  
  /**
   * Get consent status (integrate with your CMP)
   */
  private getConsent(category: string): boolean {
    // Integrate with your consent management platform
    if (typeof window !== 'undefined') {
      // Example: return window.__cmp?.getConsent(category) || false;
      return true; // Default to true for demo
    }
    return false;
  }
  
  /**
   * Execute the loading strategy
   */
  private async executeStrategy(config: ThirdPartyScriptConfig): Promise<void> {
    switch (config.strategy) {
      case 'lazy':
        await this.loadLazy(config);
        break;
      case 'defer':
        await this.loadDefer(config);
        break;
      case 'preload-async':
        await this.loadPreloadAsync(config);
        break;
      case 'facade':
        await this.loadFacade(config);
        break;
      case 'worker':
        await this.loadWorker(config);
        break;
      case 'blocking':
        await this.loadBlocking(config);
        break;
    }
    
    config.onLoad?.();
  }
  
  /**
   * Load after idle callback (lowest priority)
   */
  private loadLazy(config: ThirdPartyScriptConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const loadScript = () => {
        const script = this.createScriptElement(config);
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      };
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadScript, { timeout: 5000 });
      } else {
        setTimeout(loadScript, 100);
      }
    });
  }
  
  /**
   * Load after DOMContentLoaded
   */
  private loadDefer(config: ThirdPartyScriptConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const loadScript = () => {
        const script = this.createScriptElement(config);
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      };
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadScript, { once: true });
      } else {
        loadScript();
      }
    });
  }
  
  /**
   * Preload then execute async
   */
  private loadPreloadAsync(config: ThirdPartyScriptConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // Preload
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'script';
      preloadLink.href = config.src;
      if (config.integrity) preloadLink.integrity = config.integrity;
      if (config.crossorigin) preloadLink.crossOrigin = config.crossorigin;
      document.head.appendChild(preloadLink);
      
      // Then load async
      const script = this.createScriptElement(config);
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  /**
   * Facade pattern - show placeholder, load on interaction
   */
  private loadFacade(config: ThirdPartyScriptConfig): Promise<void> {
    return new Promise((resolve) => {
      const loadScript = () => {
        const script = this.createScriptElement(config);
        script.onload = resolve;
        script.onerror = () => resolve(); // Don't reject for facade
        document.head.appendChild(script);
        
        // Remove fallback
        const fallback = document.getElementById(`${config.id}-fallback`);
        fallback?.remove();
      };
      
      // Load on interaction
      if (config.conditions?.onInteraction) {
        const events = ['click', 'scroll', 'mousemove', 'keydown', 'touchstart'];
        const cleanup = () => {
          events.forEach(e => document.removeEventListener(e, loadScript, { passive: true }));
        };
        
        events.forEach(e => document.addEventListener(e, () => {
          cleanup();
          loadScript();
        }, { once: true, passive: true }));
      }
      
      // Load when in viewport
      if (config.conditions?.inViewport) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            observer.disconnect();
            loadScript();
          }
        });
        const target = document.querySelector(config.conditions.inViewport!);
        if (target) observer.observe(target);
        this.observers.set(config.id, observer);
      }
      
      // Show fallback
      if (config.fallback && typeof document !== 'undefined') {
        const container = document.createElement('div');
        container.id = `${config.id}-fallback`;
        // Would render React fallback here in practice
        document.body.appendChild(container);
      }
    });
  }
  
  /**
   * Load in Web Worker (Partytown)
   */
  private loadWorker(config: ThirdPartyScriptConfig): Promise<void> {
    // This would integrate with Partytown
    // For now, fall back to lazy loading
    console.warn(`Web Worker strategy not implemented for ${config.id}, falling back to lazy`);
    return this.loadLazy(config);
  }
  
  /**
   * Load blocking (synchronous - avoid!)
   */
  private loadBlocking(config: ThirdPartyScriptConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.createScriptElement(config);
      script.async = false;
      script.defer = false;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  /**
   * Create script element with attributes
   */
  private createScriptElement(config: ThirdPartyScriptConfig): HTMLScriptElement {
    const script = document.createElement('script');
    script.src = config.src;
    script.id = config.id;
    script.dataset.thirdParty = 'true';
    
    if (config.integrity) script.integrity = config.integrity;
    if (config.crossorigin) script.crossOrigin = config.crossorigin;
    if (config.attributes) {
      Object.entries(config.attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
    }
    
    return script;
  }
  
  /**
   * Load multiple scripts
   */
  async loadAll(configs: ThirdPartyScriptConfig[]): Promise<void> {
    await Promise.allSettled(configs.map(c => this.load(c)));
  }
  
  /**
   * Load scripts for current route
   */
  async loadForCurrentRoute(): Promise<void> {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const routeScripts = thirdPartyScripts.filter(config => {
      if (!config.conditions?.routes) return true;
      return config.conditions.routes.some(route => {
        const pattern = route.replace(/\*/g, '.*').replace(/\[([^\]]+)\]/g, '([^/]+)');
        return new RegExp(`^${pattern}$`).test(currentPath);
      });
    });
    
    await this.loadAll(routeScripts);
  }
  
  /**
   * Unload a script (cleanup)
   */
  unload(id: string): void {
    const script = document.getElementById(id) as HTMLScriptElement;
    if (script) {
      script.remove();
      this.loadedScripts.delete(id);
    }
    
    const observer = this.observers.get(id);
    if (observer) {
      observer.disconnect();
      this.observers.delete(id);
    }
  }
  
  /**
   * Get loaded scripts
   */
  getLoadedScripts(): string[] {
    return Array.from(this.loadedScripts);
  }
}

/**
 * Singleton instance
 */
export const thirdPartyLoader = new ThirdPartyScriptLoader();

/**
 * React hook for loading third-party scripts
 */
export function useThirdPartyScript(config: ThirdPartyScriptConfig) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    thirdPartyLoader.load(config)
      .then(() => {
        if (mounted) setLoaded(true);
      })
      .catch(err => {
        if (mounted) setError(err);
      });
    
    return () => {
      mounted = false;
    };
  }, [config.id]);
  
  return { loaded, error };
}

import { useState, useEffect } from 'react';

/**
 * Facade component wrapper
 */
interface FacadeProps {
  config: ThirdPartyScriptConfig;
  children: React.ReactNode;
  onLoad?: () => void;
}

export function ThirdPartyFacade({ config, children, onLoad }: FacadeProps) {
  const [showFallback, setShowFallback] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadScript = async () => {
      setShowFallback(false);
      try {
        await thirdPartyLoader.load(config);
        setLoaded(true);
        onLoad?.();
      } catch (error) {
        console.error(`Failed to load ${config.id}:`, error);
      }
    };
    
    // Load on interaction
    const events = ['click', 'scroll', 'mousemove', 'keydown', 'touchstart'];
    const cleanup = () => {
      events.forEach(e => containerRef.current?.removeEventListener(e, loadScript));
    };
    
    events.forEach(e => containerRef.current?.addEventListener(e, loadScript, { once: true, passive: true }));
    
    // Load when in viewport
    if (config.conditions?.inViewport) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          loadScript();
        }
      });
      const target = containerRef.current?.querySelector(config.conditions.inViewport);
      if (target) observer.observe(target);
      return () => observer.disconnect();
    }
    
    return cleanup;
  }, [config.id]);
  
  return (
    <div ref={containerRef}>
      {showFallback && config.fallback ? config.fallback : children}
    </div>
  );
}

import { useRef } from 'react';

/**
 * Partytown integration for running third-party scripts in Web Worker
 * Add to next.config.mjs:
 * 
 * const withPartytown = require('@builder.io/partytown/next');
 * module.exports = withPartytown(nextConfig);
 * 
 * And in layout.tsx:
 * <script
 *   dangerouslySetInnerHTML={{
 *     __html: `
 *       (function() {
 *         var script = document.createElement('script');
 *         script.src = '/~partytown/partytown.js';
 *         script.setAttribute('data-partytown', '');
 *         document.head.appendChild(script);
 *       })();
 *     `
 *   }}
 * />
 */
export const partytownConfig = {
  // Forward these to the main thread
  forward: ['dataLayer.push', 'gtag', 'fbq', '_hsq', 'Intercom'],
  
  // Run these in the worker
  workers: [
    'www.googletagmanager.com',
    'www.google-analytics.com',
    'connect.facebook.net',
    'static.hotjar.com',
    'widget.intercom.io',
    'www.clarity.ms',
    'analytics.tiktok.com',
  ],
  
  // Debug mode
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Consent-based script loading
 * Integrate with your CMP (Cookiebot, OneTrust, etc.)
 */
export function loadScriptsForConsent(consentCategories: string[]): void {
  const scriptsToLoad = thirdPartyScripts.filter(config => {
    if (!config.conditions?.consent) return true;
    return consentCategories.includes(config.conditions.consent!);
  });
  
  thirdPartyLoader.loadAll(scriptsToLoad);
}

/**
 * Performance monitoring for third-party scripts
 */
export function monitorThirdPartyPerformance(): void {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        // Check if it's a third-party resource
        const isThirdParty = !resource.name.startsWith(window.location.origin);
        
        if (isThirdParty && resource.initiatorType === 'script') {
          console.log(`Third-party script: ${resource.name}`, {
            duration: `${resource.duration.toFixed(1)}ms`,
            transferSize: `${(resource.transferSize / 1024).toFixed(1)}KB`,
            blockedTime: `${(resource.responseStart - resource.requestStart).toFixed(1)}ms`,
          });
          
          // Report to analytics if duration > 100ms
          if (resource.duration > 100) {
            // Report slow third-party script
            if (window.gtag) {
              window.gtag('event', 'slow_third_party_script', {
                script_name: resource.name,
                duration: Math.round(resource.duration),
              });
            }
          }
        }
      }
    });
    
    observer.observe({ type: 'resource', buffered: true });
  } catch (e) {
    console.warn('Third-party performance monitoring not supported:', e);
  }
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    _hsq: any[];
    Intercom: any;
  }
}

export default {
  thirdPartyScripts,
  thirdPartyLoader,
  useThirdPartyScript,
  ThirdPartyFacade,
  partytownConfig,
  loadScriptsForConsent,
  monitorThirdPartyPerformance,
};