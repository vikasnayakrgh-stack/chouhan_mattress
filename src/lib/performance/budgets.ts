/**
 * Performance Budget Configuration
 * 
 * Defines the performance budgets for the Wakefit application.
 * These budgets should be enforced in CI/CD pipelines.
 * 
 * Budget Targets:
 * - LCP (Largest Contentful Paint): < 2.5s
 * - INP (Interaction to Next Paint): < 200ms
 * - CLS (Cumulative Layout Shift): < 0.1
 * - JS Bundle Size (gzipped): < 170KB
 * - Total Page Weight: < 500KB
 * - Total Requests: < 50
 */

export interface PerformanceBudget {
  /** Largest Contentful Paint - time to render largest content element */
  lcp: number;
  /** Interaction to Next Paint - responsiveness metric */
  inp: number;
  /** Cumulative Layout Shift - visual stability */
  cls: number;
  /** First Contentful Paint - first content render */
  fcp: number;
  /** Time to First Byte - server response time */
  ttfb: number;
  /** JavaScript bundle size (gzipped) in KB */
  jsBundleSize: number;
  /** CSS bundle size (gzipped) in KB */
  cssBundleSize: number;
  /** Total page weight (gzipped) in KB */
  totalPageWeight: number;
  /** Total number of HTTP requests */
  totalRequests: number;
  /** Total blocking time in ms */
  tbt: number;
  /** Speed Index in ms */
  speedIndex: number;
}

/** Core Web Vitals budgets (Google's recommended thresholds) */
export const coreWebVitalsBudget: PerformanceBudget = {
  lcp: 2500,           // < 2.5s (Good)
  inp: 200,            // < 200ms (Good)
  cls: 0.1,            // < 0.1 (Good)
  fcp: 1800,           // < 1.8s (Good)
  ttfb: 800,           // < 800ms (Good)
  jsBundleSize: 170,   // < 170KB gzipped
  cssBundleSize: 50,   // < 50KB gzipped
  totalPageWeight: 500, // < 500KB gzipped
  totalRequests: 50,    // < 50 requests
  tbt: 200,             // < 200ms
  speedIndex: 3400,     // < 3.4s
};

/** Strict budgets for critical pages (home, product, checkout) */
export const strictBudget: PerformanceBudget = {
  lcp: 2000,           // < 2.0s
  inp: 150,            // < 150ms
  cls: 0.05,           // < 0.05
  fcp: 1500,           // < 1.5s
  ttfb: 600,           // < 600ms
  jsBundleSize: 130,   // < 130KB gzipped
  cssBundleSize: 30,   // < 30KB gzipped
  totalPageWeight: 300, // < 300KB gzipped
  totalRequests: 30,    // < 30 requests
  tbt: 100,             // < 100ms
  speedIndex: 2500,     // < 2.5s
};

/** Relaxed budgets for content-heavy pages (blog, help) */
export const relaxedBudget: PerformanceBudget = {
  lcp: 3000,           // < 3.0s
  inp: 300,            // < 300ms
  cls: 0.15,           // < 0.15
  fcp: 2500,           // < 2.5s
  ttfb: 1000,          // < 1s
  jsBundleSize: 200,   // < 200KB gzipped
  cssBundleSize: 80,   // < 80KB gzipped
  totalPageWeight: 800, // < 800KB gzipped
  totalRequests: 80,    // < 80 requests
  tbt: 300,             // < 300ms
  speedIndex: 4000,     // < 4s
};

/** Budget configurations per route type */
export const budgetByRoute: Record<string, PerformanceBudget> = {
  '/': strictBudget,
  '/products': strictBudget,
  '/products/*': strictBudget,
  '/cart': strictBudget,
  '/checkout': strictBudget,
  '/account': strictBudget,
  '/blog': relaxedBudget,
  '/blog/*': relaxedBudget,
  '/help': relaxedBudget,
  '/help/*': relaxedBudget,
  '_default': coreWebVitalsBudget,
};

/** Get budget for a specific route */
export function getBudgetForRoute(pathname: string): PerformanceBudget {
  // Exact match first
  if (budgetByRoute[pathname]) {
    return budgetByRoute[pathname];
  }
  
  // Pattern match for dynamic routes
  for (const [pattern, budget] of Object.entries(budgetByRoute)) {
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      if (pathname.startsWith(prefix)) {
        return budget;
      }
    }
  }
  
  return budgetByRoute._default;
}

/** Budget validation result */
export interface BudgetValidationResult {
  passed: boolean;
  budget: PerformanceBudget;
  actual: Partial<PerformanceBudget>;
  violations: Array<{
    metric: keyof PerformanceBudget;
    budget: number;
    actual: number;
    severity: 'warning' | 'error';
  }>;
}

/** Validate metrics against budget */
export function validateBudget(
  actualMetrics: Partial<PerformanceBudget>,
  budget: PerformanceBudget = coreWebVitalsBudget
): BudgetValidationResult {
  const violations: BudgetValidationResult['violations'] = [];
  
  for (const [metric, budgetValue] of Object.entries(budget)) {
    const actualValue = actualMetrics[metric as keyof PerformanceBudget];
    
    if (actualValue !== undefined && actualValue > budgetValue) {
      // Determine severity: error if > 20% over budget, warning otherwise
      const percentOver = ((actualValue - budgetValue) / budgetValue) * 100;
      violations.push({
        metric: metric as keyof PerformanceBudget,
        budget: budgetValue,
        actual: actualValue,
        severity: percentOver > 20 ? 'error' : 'warning',
      });
    }
  }
  
  return {
    passed: violations.length === 0,
    budget,
    actual: actualMetrics,
    violations,
  };
}

/** CI/CD budget configuration for different environments */
export const ciBudgets = {
  /** PR/Preview budgets - stricter to catch regressions early */
  preview: {
    ...coreWebVitalsBudget,
    lcp: 2200,
    inp: 180,
    cls: 0.08,
    jsBundleSize: 150,
    totalPageWeight: 400,
  },
  /** Production budgets - aligned with Core Web Vitals thresholds */
  production: coreWebVitalsBudget,
  /** Staging budgets - same as production for accurate testing */
  staging: coreWebVitalsBudget,
} as const;

/** Bundle size budgets by bundle name */
export const bundleSizeBudgets = {
  'main': 80,           // Main bundle (KB gzipped)
  'framework': 45,      // React/Next.js framework
  'vendor': 30,         // Vendor libraries
  'common': 15,         // Shared chunks
  'css': 30,            // CSS bundle
  'fonts': 50,          // Font files (total)
  'images-above-fold': 100, // Above-fold images
  'total-js': 170,      // Total JS budget
  'total-css': 50,      // Total CSS budget
} as const;

/** Performance budget configuration for CI tools */
export const performanceBudgetConfig = {
  budgets: [
    { resourceType: 'script', budget: bundleSizeBudgets['total-js'] },
    { resourceType: 'stylesheet', budget: bundleSizeBudgets['total-css'] },
    { resourceType: 'font', budget: bundleSizeBudgets['fonts'] },
    { resourceType: 'image', budget: bundleSizeBudgets['images-above-fold'] },
    { resourceType: 'total', budget: coreWebVitalsBudget.totalPageWeight },
  ],
  metrics: [
    { name: 'lcp', budget: coreWebVitalsBudget.lcp },
    { name: 'inp', budget: coreWebVitalsBudget.inp },
    { name: 'cls', budget: coreWebVitalsBudget.cls },
    { name: 'fcp', budget: coreWebVitalsBudget.fcp },
    { name: 'ttfb', budget: coreWebVitalsBudget.ttfb },
    { name: 'tbt', budget: coreWebVitalsBudget.tbt },
  ],
};

/** Generate Lighthouse CI config budget section */
export function generateLighthouseBudgetConfig() {
  return {
    ci: {
      collect: {
        numberOfRuns: 3,
        settings: {
          budget: performanceBudgetConfig.budgets,
        },
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 0.9 }],
          'categories:accessibility': ['error', { minScore: 0.9 }],
          'categories:best-practices': ['error', { minScore: 0.9 }],
          'categories:seo': ['error', { minScore: 0.9 }],
        },
      },
    },
  };
}

export default coreWebVitalsBudget;