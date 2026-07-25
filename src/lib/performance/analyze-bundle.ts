/**
 * Bundle Analysis Script
 * 
 * Provides utilities for analyzing Next.js bundle sizes, identifying
 * large dependencies, and tracking bundle composition over time.
 * 
 * Usage:
 * - ANALYZE=true npm run build (uses @next/bundle-analyzer)
 * - npm run analyze:bundle (custom analysis)
 * - npm run analyze:ci (CI integration)
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface BundleAnalysisConfig {
  /** Output directory for analysis reports */
  outputDir: string;
  /** Enable detailed analysis */
  detailed: boolean;
  /** Maximum bundle size warnings (KB) */
  maxSize: {
    total: number;
    initial: number;
    chunks: Record<string, number>;
  };
  /** Include source maps in analysis */
  includeSourceMaps: boolean;
  /** Generate HTML report */
  generateHtml: boolean;
  /** Generate JSON report */
  generateJson: boolean;
  /** Fail build if budget exceeded */
  failOnBudget: boolean;
}

export interface BundleChunk {
  name: string;
  size: number;
  gzipSize: number;
  brotliSize: number;
  modules: BundleModule[];
  isInitial: boolean;
  isAsync: boolean;
}

export interface BundleModule {
  name: string;
  size: number;
  gzipSize: number;
  reasons: string[];
  chunks: string[];
}

export interface BundleReport {
  timestamp: string;
  version: string;
  totalSize: number;
  totalGzipSize: number;
  totalBrotliSize: number;
  chunks: BundleChunk[];
  budgets: {
    passed: boolean;
    violations: Array<{
      metric: string;
      budget: number;
      actual: number;
      severity: 'warning' | 'error';
    }>;
  };
  largestModules: BundleModule[];
  duplicateModules: Array<{
    name: string;
    chunks: string[];
    totalSize: number;
  }>;
  recommendations: string[];
}

/** Default bundle analysis configuration */
export const defaultBundleAnalysisConfig: BundleAnalysisConfig = {
  outputDir: join(process.cwd(), 'bundle-analysis'),
  detailed: true,
  maxSize: {
    total: 170 * 1024, // 170KB gzipped
    initial: 100 * 1024, // 100KB initial JS
    chunks: {
      framework: 45 * 1024,
      ui: 30 * 1024,
      animation: 25 * 1024,
      charts: 30 * 1024,
      forms: 15 * 1024,
      date: 10 * 1024,
      carousel: 15 * 1024,
      icons: 10 * 1024,
      commons: 20 * 1024,
      main: 80 * 1024,
    },
  },
  includeSourceMaps: false,
  generateHtml: true,
  generateJson: true,
  failOnBudget: process.env.CI === 'true',
};

/**
 * Run Next.js bundle analyzer
 * Requires @next/bundle-analyzer package
 */
export async function runBundleAnalyzer(
  config: Partial<BundleAnalysisConfig> = {}
): Promise<BundleReport> {
  const finalConfig = { ...defaultBundleAnalysisConfig, ...config };
  
  // Ensure output directory exists
  if (!existsSync(finalConfig.outputDir)) {
    mkdirSync(finalConfig.outputDir, { recursive: true });
  }

  // Set environment variable for @next/bundle-analyzer
  process.env.ANALYZE = 'true';
  process.env.BUNDLE_ANALYZE_OUTPUT_DIR = finalConfig.outputDir;

  try {
    // Run Next.js build with analyzer
    execSync('npm run build', { 
      stdio: 'inherit',
      env: { ...process.env, ANALYZE: 'true' }
    });
  } catch (error) {
    console.error('Bundle analysis build failed:', error);
    throw error;
  }

  // Parse generated reports
  const report = await parseBundleReports(finalConfig.outputDir);
  
  // Validate against budgets
  const validatedReport = validateBudgets(report, finalConfig.maxSize);
  
  // Generate recommendations
  validatedReport.recommendations = generateRecommendations(validatedReport);
  
  // Save reports
  if (finalConfig.generateJson) {
    const jsonPath = join(finalConfig.outputDir, `bundle-report-${Date.now()}.json`);
    writeFileSync(jsonPath, JSON.stringify(validatedReport, null, 2));
    console.log(`📊 JSON report saved to: ${jsonPath}`);
  }

  if (finalConfig.generateHtml) {
    const htmlPath = join(finalConfig.outputDir, `bundle-report-${Date.now()}.html`);
    writeFileSync(htmlPath, generateHtmlReport(validatedReport));
    console.log(`📊 HTML report saved to: ${htmlPath}`);
  }

  // Print summary
  printBundleSummary(validatedReport);

  if (finalConfig.failOnBudget && !validatedReport.budgets.passed) {
    throw new Error('Bundle budget exceeded! Check the report for details.');
  }

  return validatedReport;
}

/**
 * Parse bundle analyzer output files
 */
async function parseBundleReports(outputDir: string): Promise<BundleReport> {
  // Next.js bundle analyzer generates:
  // - .next/analyze/client.html
  // - .next/analyze/server.html
  // - .next/analyze/edge.html
  
  const analyzeDir = join(process.cwd(), '.next', 'analyze');
  
  if (!existsSync(analyzeDir)) {
    // Try webpack stats
    const statsPath = join(process.cwd(), '.next', 'stats.json');
    if (existsSync(statsPath)) {
      return parseWebpackStats(statsPath);
    }
    throw new Error('No bundle analysis output found. Run with ANALYZE=true');
  }

  // Parse the generated stats files
  const statsFiles = ['client', 'server', 'edge']
    .map((type) => join(analyzeDir, `${type}.json`))
    .filter(existsSync);

  if (statsFiles.length === 0) {
    throw new Error('No stats JSON files found in analyze directory');
  }

  // Parse first available stats file (usually client)
  return parseWebpackStats(statsFiles[0]);
}

/**
 * Parse webpack stats JSON
 */
function parseWebpackStats(statsPath: string): BundleReport {
  const stats = JSON.parse(readFileSync(statsPath, 'utf-8'));
  
  const chunks: BundleChunk[] = [];
  const allModules: BundleModule[] = [];
  
  // Parse chunks
  if (stats.chunks) {
    for (const chunk of stats.chunks) {
      const chunkModules = chunk.modules?.map((m: any) => ({
        name: m.name || m.identifier || '',
        size: m.size || 0,
        gzipSize: Math.round((m.size || 0) * 0.3), // Approximate
        reasons: m.reasons?.map((r: any) => r.type) || [],
        chunks: [chunk.id?.toString() || ''],
      })) || [];
      
      allModules.push(...chunkModules);
      
      chunks.push({
        name: chunk.names?.[0] || `chunk-${chunk.id}`,
        size: chunk.size || 0,
        gzipSize: chunk.gzipSize || Math.round((chunk.size || 0) * 0.3),
        brotliSize: chunk.brotliSize || Math.round((chunk.size || 0) * 0.25),
        modules: chunkModules,
        isInitial: chunk.initial || false,
        isAsync: !chunk.initial,
      });
    }
  }

  // Parse modules
  if (stats.modules) {
    for (const module of stats.modules) {
      if (!allModules.find(m => m.name === module.name)) {
        allModules.push({
          name: module.name || module.identifier || '',
          size: module.size || 0,
          gzipSize: Math.round((module.size || 0) * 0.3),
          reasons: module.reasons?.map((r: any) => r.type) || [],
          chunks: module.chunks?.map((c: any) => c.toString()) || [],
        });
      }
    }
  }

  // Calculate totals
  const totalSize = chunks.reduce((sum, c) => sum + c.size, 0);
  const totalGzipSize = chunks.reduce((sum, c) => sum + c.gzipSize, 0);
  const totalBrotliSize = chunks.reduce((sum, c) => sum + c.brotliSize, 0);

  // Find largest modules
  const largestModules = [...allModules]
    .sort((a, b) => b.size - a.size)
    .slice(0, 20);

  // Find duplicate modules (same name in multiple chunks)
  const moduleChunks = new Map<string, string[]>();
  for (const module of allModules) {
    const existing = moduleChunks.get(module.name) || [];
    existing.push(...module.chunks);
    moduleChunks.set(module.name, [...new Set(existing)]);
  }

  const duplicateModules = Array.from(moduleChunks.entries())
    .filter(([_, chunks]) => chunks.length > 1)
    .map(([name, chunks]) => ({
      name,
      chunks,
      totalSize: allModules
        .filter(m => m.name === name)
        .reduce((sum, m) => sum + m.size, 0),
    }))
    .sort((a, b) => b.totalSize - a.totalSize)
    .slice(0, 10);

  return {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    totalSize,
    totalGzipSize,
    totalBrotliSize,
    chunks,
    budgets: { passed: true, violations: [] },
    largestModules,
    duplicateModules,
    recommendations: [],
  };
}

/**
 * Validate bundle against budgets
 */
function validateBudgets(
  report: BundleReport,
  budgets: BundleAnalysisConfig['maxSize']
): BundleReport {
  const violations: BundleReport['budgets']['violations'] = [];

  // Total bundle budget
  if (report.totalGzipSize > budgets.total) {
    violations.push({
      metric: 'totalGzipSize',
      budget: budgets.total,
      actual: report.totalGzipSize,
      severity: report.totalGzipSize > budgets.total * 1.2 ? 'error' : 'warning',
    });
  }

  // Initial JS budget
  const initialSize = report.chunks
    .filter(c => c.isInitial)
    .reduce((sum, c) => sum + c.gzipSize, 0);
  
  if (initialSize > budgets.initial) {
    violations.push({
      metric: 'initialJS',
      budget: budgets.initial,
      actual: initialSize,
      severity: initialSize > budgets.initial * 1.2 ? 'error' : 'warning',
    });
  }

  // Individual chunk budgets
  for (const [chunkName, budget] of Object.entries(budgets.chunks)) {
    const chunk = report.chunks.find(c => c.name.includes(chunkName));
    if (chunk && chunk.gzipSize > budget) {
      violations.push({
        metric: `chunk:${chunkName}`,
        budget,
        actual: chunk.gzipSize,
        severity: chunk.gzipSize > budget * 1.2 ? 'error' : 'warning',
      });
    }
  }

  return {
    ...report,
    budgets: {
      passed: violations.length === 0,
      violations,
    },
  };
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(report: BundleReport): string[] {
  const recommendations: string[] = [];

  // Check for large initial chunks
  const largeInitialChunks = report.chunks
    .filter(c => c.isInitial && c.gzipSize > 50 * 1024)
    .sort((a, b) => b.gzipSize - a.gzipSize);

  if (largeInitialChunks.length > 0) {
    recommendations.push(
      `Large initial chunks detected: ${largeInitialChunks.map(c => `${c.name} (${formatBytes(c.gzipSize)})`).join(', ')}. Consider code splitting or dynamic imports.`
    );
  }

  // Check for duplicate modules
  if (report.duplicateModules.length > 0) {
    const topDuplicates = report.duplicateModules.slice(0, 3);
    recommendations.push(
      `Duplicate modules found: ${topDuplicates.map(d => `${d.name} (${formatBytes(d.totalSize)})`).join(', ')}. Consider using webpack's optimization.splitChunks.`
    );
  }

  // Check for large modules
  const largeModules = report.largestModules.filter(m => m.gzipSize > 20 * 1024);
  if (largeModules.length > 0) {
    recommendations.push(
      `Large modules detected: ${largeModules.slice(0, 3).map(m => `${m.name} (${formatBytes(m.gzipSize)})`).join(', ')}. Consider lighter alternatives or dynamic imports.`
    );
  }

  // Check total size
  if (report.totalGzipSize > 150 * 1024) {
    recommendations.push(
      `Total JS bundle size (${formatBytes(report.totalGzipSize)}) exceeds recommended 150KB. Audit dependencies and implement aggressive code splitting.`
    );
  }

  // Check for specific heavy dependencies
  const heavyDeps = report.largestModules.filter(m => 
    m.name.includes('node_modules') && m.gzipSize > 15 * 1024
  );
  
  if (heavyDeps.length > 0) {
    recommendations.push(
      `Heavy dependencies: ${heavyDeps.slice(0, 3).map(m => m.name.split('node_modules/')[1]?.split('/')[0]).join(', ')}. Consider lighter alternatives.`
    );
  }

  // Check chunk count
  if (report.chunks.length > 50) {
    recommendations.push(
      `High chunk count (${report.chunks.length}). Consider consolidating smaller chunks with splitChunks.minSize.`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Bundle looks well optimized! No major issues detected.');
  }

  return recommendations;
}

/**
 * Generate HTML report
 */
function generateHtmlReport(report: BundleReport): string {
  const formatBytesHtml = (bytes: number) => {
    const kb = (bytes / 1024).toFixed(1);
    const mb = (bytes / 1024 / 1024).toFixed(2);
    return bytes > 1024 * 1024 ? `${mb} MB` : `${kb} KB`;
  };

  const chunkRows = report.chunks.map(chunk => `
    <tr class="${chunk.isInitial ? 'initial' : 'async'}">
      <td>${chunk.name}</td>
      <td>${formatBytesHtml(chunk.size)}</td>
      <td>${formatBytesHtml(chunk.gzipSize)}</td>
      <td>${formatBytesHtml(chunk.brotliSize)}</td>
      <td>${chunk.modules.length}</td>
      <td><span class="badge ${chunk.isInitial ? 'initial' : 'async'}">${chunk.isInitial ? 'Initial' : 'Async'}</span></td>
    </tr>
  `).join('');

  const moduleRows = report.largestModules.slice(0, 30).map(module => `
    <tr>
      <td><code>${module.name}</code></td>
      <td>${formatBytesHtml(module.size)}</td>
      <td>${formatBytesHtml(module.gzipSize)}</td>
      <td>${module.chunks.join(', ')}</td>
    </tr>
  `).join('');

  const violationRows = report.budgets.violations.map(v => `
    <tr class="${v.severity}">
      <td>${v.metric}</td>
      <td>${formatBytesHtml(v.budget)}</td>
      <td>${formatBytesHtml(v.actual)}</td>
      <td><span class="badge ${v.severity}">${v.severity.toUpperCase()}</span></td>
    </tr>
  `).join('') || '<tr><td colspan="4" class="pass">✅ All budgets passed!</td></tr>';

  const recommendationsHtml = report.recommendations.map(r => `
    <li>${r}</li>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bundle Analysis Report - ${report.timestamp}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8f9fa; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
    header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; }
    header h1 { font-size: 1.5rem; margin-bottom: 10px; }
    header .meta { opacity: 0.8; font-size: 0.9rem; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 20px; background: #f8f9fa; border-bottom: 1px solid #e9ecef; }
    .stat { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-value { font-size: 2rem; font-weight: 700; color: #1a1a2e; }
    .stat-label { color: #6c757d; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat.warning .stat-value { color: #fd7e14; }
    .stat.error .stat-value { color: #dc3545; }
    .stat.pass .stat-value { color: #28a745; }
    section { padding: 20px; }
    h2 { margin-bottom: 16px; color: #1a1a2e; font-size: 1.25rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e9ecef; }
    th { background: #f8f9fa; font-weight: 600; color: #495057; }
    tr:hover { background: #f8f9fa; }
    tr.initial { background: #e7f3ff; }
    tr.async { background: #fff3e0; }
    code { background: #f1f3f4; padding: 2px 6px; border-radius: 4px; font-size: 0.875rem; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
    .badge.initial { background: #e7f3ff; color: #0066cc; }
    .badge.async { background: #fff3e0; color: #e65100; }
    .badge.warning { background: #fff3cd; color: #856404; }
    .badge.error { background: #f8d7da; color: #721c24; }
    .badge.pass { background: #d4edda; color: #155724; }
    .pass { color: #28a745; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
    .footer { padding: 20px; text-align: center; color: #6c757d; font-size: 0.875rem; border-top: 1px solid #e9ecef; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📦 Bundle Analysis Report</h1>
      <div class="meta">Generated: ${new Date(report.timestamp).toLocaleString()} | Version: ${report.version}</div>
    </header>
    
    <div class="summary">
      <div class="stat ${report.budgets.passed ? 'pass' : 'error'}">
        <div class="stat-value">${formatBytesHtml(report.totalGzipSize)}</div>
        <div class="stat-label">Total JS (gzipped)</div>
      </div>
      <div class="stat">
        <div class="stat-value">${formatBytesHtml(report.totalBrotliSize)}</div>
        <div class="stat-label">Total JS (brotli)</div>
      </div>
      <div class="stat">
        <div class="stat-value">${report.chunks.length}</div>
        <div class="stat-label">Total Chunks</div>
      </div>
      <div class="stat ${report.budgets.violations.length > 0 ? 'error' : 'pass'}">
        <div class="stat-value">${report.budgets.violations.filter(v => v.severity === 'error').length}</div>
        <div class="stat-label">Budget Errors</div>
      </div>
      <div class="stat ${report.budgets.violations.some(v => v.severity === 'warning') ? 'warning' : 'pass'}">
        <div class="stat-value">${report.budgets.violations.filter(v => v.severity === 'warning').length}</div>
        <div class="stat-label">Budget Warnings</div>
      </div>
    </div>

    <section>
      <h2>📋 Budget Validation</h2>
      <table>
        <thead>
          <tr><th>Metric</th><th>Budget</th><th>Actual</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${violationRows}
        </tbody>
      </table>
    </section>

    <section>
      <h2>📦 Chunks (${report.chunks.length} total)</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Raw Size</th><th>Gzip Size</th><th>Brotli Size</th><th>Modules</th><th>Type</th></tr>
        </thead>
        <tbody>
          ${chunkRows}
        </tbody>
      </table>
    </section>

    <section>
      <h2>🔍 Largest Modules (Top 30)</h2>
      <table>
        <thead>
          <tr><th>Module</th><th>Raw Size</th><th>Gzip Size</th><th>Chunks</th></tr>
        </thead>
        <tbody>
          ${moduleRows}
        </tbody>
      </table>
    </section>

    <section>
      <h2>⚠️ Duplicate Modules (${report.duplicateModules.length})</h2>
      ${report.duplicateModules.length > 0 ? `
        <table>
          <thead><tr><th>Module</th><th>Chunks</th><th>Total Size</th></tr></thead>
          <tbody>
            ${report.duplicateModules.slice(0, 10).map(d => `
              <tr>
                <td><code>${d.name}</code></td>
                <td>${d.chunks.join(', ')}</td>
                <td>${formatBytesHtml(d.totalSize)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<p class="pass">✅ No duplicate modules detected!</p>'}
    </section>

    <section>
      <h2>💡 Recommendations</h2>
      <ul>
        ${recommendationsHtml}
      </ul>
    </section>

    <div class="footer">
      Generated by Wakefit Bundle Analyzer | ${new Date().toISOString()}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Print bundle summary to console
 */
function printBundleSummary(report: BundleReport): void {
  console.log('\n📊 ============ BUNDLE ANALYSIS SUMMARY ============');
  console.log(`📦 Total JS Size: ${formatBytes(report.totalSize)} (${formatBytes(report.totalGzipSize)} gzipped)`);
  console.log(`📦 Total Brotli: ${formatBytes(report.totalBrotliSize)}`);
  console.log(`📦 Total Chunks: ${report.chunks.length}`);
  console.log(`\n💰 Budget Status: ${report.budgets.passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (report.budgets.violations.length > 0) {
    console.log('\n⚠️  Budget Violations:');
    for (const v of report.budgets.violations) {
      const icon = v.severity === 'error' ? '❌' : '⚠️';
      console.log(`  ${icon} ${v.metric}: ${formatBytes(v.actual)} / ${formatBytes(v.budget)} (${((v.actual/v.budget)*100).toFixed(1)}%)`);
    }
  }

  console.log('\n📦 Largest Chunks:');
  const sortedChunks = [...report.chunks].sort((a, b) => b.gzipSize - a.gzipSize);
  for (const chunk of sortedChunks.slice(0, 10)) {
    const type = chunk.isInitial ? '🔴 Initial' : '🟢 Async';
    console.log(`  ${type} ${chunk.name}: ${formatBytes(chunk.gzipSize)} gzipped`);
  }

  console.log('\n🔍 Top 5 Largest Modules:');
  for (const module of report.largestModules.slice(0, 5)) {
    console.log(`  ${module.name}: ${formatBytes(module.gzipSize)} gzipped`);
  }

  if (report.duplicateModules.length > 0) {
    console.log(`\n⚠️  ${report.duplicateModules.length} duplicate modules detected`);
  }

  console.log('\n💡 Recommendations:');
  for (const rec of report.recommendations.slice(0, 5)) {
    console.log(`  • ${rec}`);
  }
  console.log('=====================================================\n');
}

/**
 * Quick bundle size check without full analysis
 * Use in CI for fast feedback
 */
export async function quickBundleCheck(): Promise<{
  passed: boolean;
  totalGzipSize: number;
  initialGzipSize: number;
  chunkCount: number;
}> {
  const statsPath = join(process.cwd(), '.next', 'stats.json');
  
  if (!existsSync(statsPath)) {
    throw new Error('No build stats found. Run "npm run build" first.');
  }

  const stats = JSON.parse(readFileSync(statsPath, 'utf-8'));
  
  const chunks = stats.chunks || [];
  const totalGzipSize = chunks.reduce((sum: number, c: any) => sum + (c.gzipSize || Math.round((c.size || 0) * 0.3)), 0);
  const initialGzipSize = chunks
    .filter((c: any) => c.initial)
    .reduce((sum: number, c: any) => sum + (c.gzipSize || Math.round((c.size || 0) * 0.3)), 0);
  
  return {
    passed: totalGzipSize <= 170 * 1024 && initialGzipSize <= 100 * 1024,
    totalGzipSize,
    initialGzipSize,
    chunkCount: chunks.length,
  };
}

/**
 * Compare two bundle reports
 */
export function compareBundles(
  baseline: BundleReport,
  current: BundleReport
): {
  sizeDiff: number;
  sizeDiffPercent: number;
  gzipDiff: number;
  gzipDiffPercent: number;
  chunkDiff: number;
  newChunks: string[];
  removedChunks: string[];
  recommendations: string[];
} {
  const sizeDiff = current.totalSize - baseline.totalSize;
  const gzipDiff = current.totalGzipSize - baseline.totalGzipSize;
  
  const baselineChunkNames = new Set(baseline.chunks.map(c => c.name));
  const currentChunkNames = new Set(current.chunks.map(c => c.name));
  
  const newChunks = current.chunks
    .filter(c => !baselineChunkNames.has(c.name))
    .map(c => c.name);
  
  const removedChunks = baseline.chunks
    .filter(c => !currentChunkNames.has(c.name))
    .map(c => c.name);

  const recommendations: string[] = [];
  
  if (gzipDiff > 10 * 1024) {
    recommendations.push(`Bundle increased by ${formatBytes(gzipDiff)} (${((gzipDiff/baseline.totalGzipSize)*100).toFixed(1)}%). Investigate new dependencies.`);
  } else if (gzipDiff < -10 * 1024) {
    recommendations.push(`Bundle decreased by ${formatBytes(-gzipDiff)} (${((-gzipDiff/baseline.totalGzipSize)*100).toFixed(1)}%). Good optimization!`);
  }

  if (newChunks.length > 0) {
    recommendations.push(`New chunks added: ${newChunks.join(', ')}. Verify they are properly code-split.`);
  }

  if (current.chunks.length > baseline.chunks.length + 5) {
    recommendations.push(`Chunk count increased significantly (${baseline.chunks.length} → ${current.chunks.length}). Consider consolidating.`);
  }

  return {
    sizeDiff,
    sizeDiffPercent: (sizeDiff / baseline.totalSize) * 100,
    gzipDiff,
    gzipDiffPercent: (gzipDiff / baseline.totalGzipSize) * 100,
    chunkDiff: current.chunks.length - baseline.chunks.length,
    newChunks,
    removedChunks,
    recommendations,
  };
}

export default {
  runBundleAnalyzer,
  quickBundleCheck,
  compareBundles,
  defaultBundleAnalysisConfig,
  parseWebpackStats,
  validateBudgets,
  generateRecommendations,
};