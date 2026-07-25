/**
 * Critical CSS Extraction Strategy
 * 
 * This utility provides patterns and helpers for extracting and inlining critical CSS
 * to eliminate render-blocking CSS and improve LCP.
 * 
 * Strategy:
 * 1. Use Next.js built-in critical CSS extraction (experimental)
 * 2. Use critters or critical CSS tools for build-time extraction
 * 3. Inline critical CSS in <head> via next/head
 * 4. Load non-critical CSS asynchronously with media="print" onload pattern
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface CriticalCSSOptions {
  /** HTML file to extract critical CSS from */
  htmlPath: string;
  /** CSS files to analyze */
  cssPaths: string[];
  /** Viewport dimensions for critical CSS calculation */
  viewport?: { width: number; height: number };
  /** Minimum width for critical CSS */
  minWidth?: number;
  /** Maximum width for critical CSS */
  maxWidth?: number;
  /** Force inclusion of specific selectors */
  forceInclude?: string[];
  /** Ignore specific selectors */
  ignore?: string | RegExp[];
  /** Output path for critical CSS */
  outputPath?: string;
  /** Inline critical CSS in HTML */
  inline?: boolean;
}

export interface CriticalCSSResult {
  /** Extracted critical CSS */
  critical: string;
  /** Non-critical CSS (to be loaded async) */
  nonCritical: string;
  /** Original CSS size in bytes */
  originalSize: number;
  /** Critical CSS size in bytes */
  criticalSize: number;
  /** Savings percentage */
  savings: number;
}

/**
 * Extract critical CSS using a simplified approach
 * For production, consider using 'critical' or 'critters' packages
 */
export async function extractCriticalCSS(
  options: CriticalCSSOptions
): Promise<CriticalCSSResult> {
  // Read HTML and CSS files
  const html = readFileSync(options.htmlPath, 'utf-8');
  const cssContents = options.cssPaths.map((path) => readFileSync(path, 'utf-8'));
  const combinedCSS = cssContents.join('\n');
  
  // This is a simplified extraction - in production use 'critical' npm package
  // or Next.js experimental.optimizeCss
  const critical = extractCriticalCSS(combinedCSS, html, options);
  const nonCritical = removeCriticalCSS(combinedCSS, critical);
  
  const result: CriticalCSSResult = {
    critical,
    nonCritical,
    originalSize: Buffer.byteLength(combinedCSS, 'utf-8'),
    criticalSize: Buffer.byteLength(critical, 'utf-8'),
    savings: 0,
  };
  
  result.savings = ((result.originalSize - result.criticalSize) / result.originalSize) * 100;
  
  // Write output if requested
  if (options.outputPath) {
    writeFileSync(options.outputPath, critical);
  }
  
  // Inline in HTML if requested
  if (options.inline && options.htmlPath) {
    const inlinedHtml = inlineCriticalCSS(html, critical);
    writeFileSync(options.htmlPath, inlinedHtml);
  }
  
  return result;
}

/**
 * Extract critical CSS rules based on HTML content
 * This is a simplified version - use 'critical' package for production
 */
function extractCriticalCSS(
  css: string,
  html: string,
  options: CriticalCSSOptions
): string {
  // Parse CSS rules (simplified)
  const rules = parseCSSRules(css);
  
  // Extract DOM elements from HTML
  const domElements = extractDOMElements(html);
  
  // Score rules based on relevance to above-fold content
  const scoredRules = rules.map((rule) => ({
    rule,
    score: calculateRuleScore(rule, domElements, options),
  }));
  
  // Sort by score and take top rules
  const criticalRules = scoredRules
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 100) // Limit to top 100 rules
    .map((r) => r.rule);
  
  // Force include specific selectors
  if (options.forceInclude) {
    options.forceInclude.forEach((selector) => {
      const rule = rules.find((r) => r.selector.includes(selector));
      if (rule && !criticalRules.includes(rule)) {
        criticalRules.push(rule);
      }
    });
  }
  
  return criticalRules.map((r) => r.cssText).join('\n');
}

/** Parse CSS into individual rules */
function parseCSSRules(css: string): Array<{ selector: string; cssText: string }> {
  const rules: Array<{ selector: string; cssText: string }> = [];
  
  // Simple regex-based parsing (use a proper CSS parser in production)
  const ruleRegex = /([^{]+)\{([^}]+)\}/g;
  let match;
  
  while ((match = ruleRegex.exec(css)) !== null) {
    const selector = match[1].trim();
    const declarations = match[2].trim();
    rules.push({
      selector,
      cssText: `${selector} { ${declarations} }`,
    });
  }
  
  return rules;
}

/** Extract DOM elements from HTML (simplified) */
function extractDOMElements(html: string): Set<string> {
  const elements = new Set<string>();
  
  // Extract tag names, classes, IDs from HTML
  const tagRegex = /<([a-zA-Z][a-zA-Z0-9-]*)/g;
  const classRegex = /class=["']([^"']+)["']/g;
  const idRegex = /id=["']([^"']+)["']/g;
  
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    elements.add(match[1].toLowerCase());
  }
  while ((match = classRegex.exec(html)) !== null) {
    match[1].split(/\s+/).forEach((cls) => elements.add(`.${cls}`));
  }
  while ((match = idRegex.exec(html)) !== null) {
    elements.add(`#${match[1]}`);
  }
  
  return elements;
}

/** Calculate relevance score for a CSS rule */
function calculateRuleScore(
  rule: { selector: string; cssText: string },
  domElements: Set<string>,
  options: CriticalCSSOptions
): number {
  let score = 0;
  const selector = rule.selector.toLowerCase();
  
  // Base score for matching DOM elements
  for (const element of domElements) {
    if (selector.includes(element.toLowerCase())) {
      score += 10;
    }
  }
  
  // Bonus for layout-critical properties
  const criticalProperties = [
    'display', 'position', 'flex', 'grid', 'width', 'height',
    'margin', 'padding', 'top', 'left', 'right', 'bottom',
    'font', 'color', 'background', 'visibility', 'opacity',
    'transform', 'transition', 'animation', 'overflow',
    'z-index', 'box-sizing',
  ];
  
  criticalProperties.forEach((prop) => {
    if (rule.cssText.includes(prop)) {
      score += 2;
    }
  });
  
  // Bonus for above-fold selectors (header, hero, nav, main)
  const aboveFoldKeywords = ['header', 'hero', 'nav', 'main', 'banner', 'above-fold', 'fold'];
  aboveFoldKeywords.forEach((keyword) => {
    if (selector.includes(keyword)) {
      score += 15;
    }
  });
  
  // Penalty for non-critical selectors
  const nonCriticalKeywords = ['footer', 'sidebar', 'aside', 'comment', 'modal', 'dropdown', 'tooltip'];
  nonCriticalKeywords.forEach((keyword) => {
    if (selector.includes(keyword)) {
      score -= 10;
    }
  });
  
  // Check ignore patterns
  if (options.ignore) {
    for (const ignore of options.ignore) {
      if (typeof ignore === 'string' && selector.includes(ignore)) {
        return -100;
      }
      if (ignore instanceof RegExp && ignore.test(selector)) {
        return -100;
      }
    }
  }
  
  return score;
}

/** Remove critical CSS from full CSS */
function removeCriticalCSS(fullCSS: string, criticalCSS: string): string {
  const criticalRules = new Set(
    criticalCSS.split('}').map((r) => r.trim()).filter(Boolean)
  );
  
  return fullCSS
    .split('}')
    .map((rule) => rule.trim())
    .filter((rule) => rule && !criticalRules.has(rule + '}'))
    .join(' }\n') + ' }';
}

/** Inline critical CSS in HTML head */
function inlineCriticalCSS(html: string, criticalCSS: string): string {
  const styleTag = `<style data-critical-css>${criticalCSS}</style>`;
  
  // Insert after <head> or before </head>
  if (html.includes('</head>')) {
    return html.replace('</head>', `${styleTag}\n</head>`);
  }
  if (html.includes('<head>')) {
    return html.replace('<head>', `<head>\n${styleTag}`);
  }
  
  return html;
}

/**
 * Next.js Critical CSS Configuration
 * Add to next.config.mjs:
 * 
 * experimental: {
 *   optimizeCss: true, // Requires 'critters' package
 * }
 */

/**
 * Critters Configuration for Next.js
 * Add to next.config.mjs:
 * 
 * const withCritters = require('@critters/next')({
 *   // Options
 * });
 * 
 * module.exports = withCritters(nextConfig);
 */

export interface CrittersOptions {
  /** Preload non-critical CSS */
  preload?: 'media' | 'swap' | 'body' | false;
  /** Inline critical CSS */
  inline?: boolean;
  /** Minify critical CSS */
  compress?: boolean;
  /** Keyframe handling */
  keyframes?: 'critical' | 'all' | 'none';
  /** Font face handling */
  fontFace?: 'critical' | 'all' | 'none';
  /** Merge inlined stylesheets */
  mergeStylesheets?: boolean;
  /** External stylesheets to process */
  external?: boolean;
  /** Inline threshold in KB */
  inlineThreshold?: number;
  /** Minimum reduction size in KB */
  minimumReduction?: number;
  /** Prune source CSS */
  pruneSource?: boolean;
}

/** Default Critters configuration for Next.js */
export const defaultCrittersOptions: CrittersOptions = {
  preload: 'media',
  inline: true,
  compress: true,
  keyframes: 'critical',
  fontFace: 'critical',
  mergeStylesheets: true,
  external: true,
  inlineThreshold: 10,
  minimumReduction: 1,
  pruneSource: true,
};

/**
 * Build-time critical CSS extraction script
 * Run with: npx tsx scripts/extract-critical-css.ts
 */
export async function extractCriticalCSSBuildTime(
  buildDir: string,
  options: Partial<CriticalCSSOptions> = {}
): Promise<void> {
  const pages = ['index.html', 'products.html', 'cart.html', 'checkout.html'];
  
  for (const page of pages) {
    const htmlPath = join(buildDir, page);
    if (!existsSync(htmlPath)) continue;
    
    // Find CSS files
    const cssFiles = ['styles.css', 'globals.css'].map((f) => join(buildDir, f))
      .filter(existsSync);
    
    if (cssFiles.length === 0) continue;
    
    await extractCriticalCSS({
      htmlPath,
      cssPaths: cssFiles,
      outputPath: join(buildDir, `critical-${page.replace('.html', '.css')}`),
      inline: true,
      forceInclude: ['.header', '.hero', '.nav', '.main', '#main-content'],
      ignore: ['.footer', '.sidebar', '.modal', '.dropdown'],
      ...options,
    });
    
    console.log(`✓ Extracted critical CSS for ${page}`);
  }
}

export default {
  extractCriticalCSS,
  extractCriticalCSSBuildTime,
  defaultCrittersOptions,
};