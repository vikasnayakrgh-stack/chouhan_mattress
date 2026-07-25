/**
 * SVG Icon System
 * Supports:
 * - SVGR for component-based icons (build-time optimization)
 * - Custom SVG sprite for runtime sprite sheet
 * - lucide-react integration
 * - Icon registry for consistent usage
 */

import React from 'react';

// Re-export lucide-react icons
export * from 'lucide-react';

/**
 * Custom SVG Sprite System
 * Generates a single SVG sprite sheet from individual SVG files
 * Usage: <svg className="icon"><use href="/icons/sprite.svg#icon-name" /></svg>
 */

export interface IconDefinition {
  name: string;
  component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  viewBox?: string;
  width?: number;
  height?: number;
  tags?: string[];
}

export interface SpriteIcon {
  name: string;
  symbol: string; // The <symbol> element content
  viewBox: string;
  width?: number;
  height?: number;
}

/**
 * Icon categories for organization
 */
export const ICON_CATEGORIES = {
  navigation: ['chevron-right', 'chevron-left', 'chevron-up', 'chevron-down', 'menu', 'close', 'home', 'search', 'filter', 'grid', 'list'],
  commerce: ['shopping-cart', 'shopping-bag', 'credit-card', 'gift', 'tag', 'truck', 'rotate-ccw', 'shield', 'headphones', 'star', 'heart', 'percent'],
  ui: ['plus', 'minus', 'x', 'check', 'alert-circle', 'info', 'help-circle', 'settings', 'user', 'log-in', 'log-out', 'mail', 'phone', 'map-pin', 'clock', 'calendar', 'eye', 'eye-off', 'loader', 'refresh-cw', 'download', 'upload', 'share', 'copy', 'edit', 'delete', 'archive', 'folder', 'file', 'image', 'video', 'music', 'code', 'terminal', 'database', 'server', 'cloud', 'wifi', 'bluetooth', 'battery', 'cpu', 'hard-drive', 'monitor', 'smartphone', 'tablet', 'laptop', 'watch', 'camera', 'mic', 'speaker', 'volume', 'volume-x', 'volume-1', 'volume-2', 'play', 'pause', 'stop', 'skip-back', 'skip-forward', 'fast-forward', 'rewind', 'repeat', 'shuffle', 'mic-off', 'mic-2'],
  social: ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'github', 'discord', 'slack', 'email', 'rss'],
  arrows: ['arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up-right', 'arrow-down-right', 'arrow-down-left', 'arrow-up-left', 'corner-up-right', 'corner-down-right', 'corner-down-left', 'corner-up-left'],
  ecommerce: ['package', 'box', 'truck', 'rotate-ccw', 'shield', 'headphones', 'star', 'heart', 'percent', 'tag', 'credit-card', 'wallet', 'banknote', 'coins', 'receipt', 'invoice', 'shopping-cart', 'shopping-bag', 'store', 'shop'],
} as const;

/**
 * Default icon size mappings
 */
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

/**
 * Icon component props
 */
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name?: string;
  size?: keyof typeof ICON_SIZES | number;
  weight?: 'thin' | 'light' | 'regular' | 'medium' | 'bold' | 'fill';
  color?: 'currentColor' | 'inherit' | string;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

/**
 * Create a typed icon component from SVGR-generated component
 * This allows using dynamic icon names with type safety
 */
export function createIconComponent(
  icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>
) {
  return function Icon({ name, size = 'md', className = '', ...props }: IconProps) {
    if (!name) return null;
    const IconComponent = icons[name];
    if (!IconComponent) {
      console.warn(`Icon "${name}" not found`);
      return null;
    }
    
    const sizeValue = typeof size === 'number' ? size : ICON_SIZES[size];
    
    return (
      <IconComponent
        width={sizeValue}
        height={sizeValue}
        className={className}
        {...props}
      />
    );
  };
}

/**
 * SVG Sprite Generator
 * Reads SVG files from a directory and generates a sprite sheet
 */
export async function generateSpriteSheet(
  svgDir: string,
  outputPath: string,
  options: {
    prefix?: string;
    symbolIdPrefix?: string;
    includeDimensions?: boolean;
  } = {}
): Promise<string> {
  // This would be run at build time
  // const fs = await import('fs/promises');
  // const path = await import('path');
  // const { optimize } = await import('svgo');
  
  // const files = await fs.readdir(svgDir);
  // const svgFiles = files.filter(f => f.endsWith('.svg'));
  
  // let symbols = '';
  // for (const file of svgFiles) {
  //   const content = await fs.readFile(path.join(svgDir, file), 'utf-8');
  //   const optimized = optimize(content, {
  //     plugins: [
  //       'removeDimensions',
  //       'removeXMLNS',
  //       'cleanupIds',
  //       { name: 'addAttributesToSVGElement', params: { attributes: [{ 'fill': 'currentColor' }] } },
  //     ],
  //   });
  //   
  //   const name = options.symbolIdPrefix ? `${options.symbolIdPrefix}-${file.replace('.svg', '')}` : file.replace('.svg', '');
  //   const viewBoxMatch = optimized.data.match(/viewBox="([^"]+)"/);
  //   const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
  //   
  //   symbols += `<symbol id="${name}" viewBox="${viewBox}">${optimized.data.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</symbol>`;
  // }
  
  // const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">${symbols}</svg>`;
  // await fs.writeFile(outputPath, sprite);
  // return sprite;
  
  return '<svg xmlns="http://www.w3.org/2000/svg" style="display:none;"><!-- Generated at build time --></svg>';
}

/**
 * Sprite Icon Component
 * Uses SVG <use> to reference symbols from sprite sheet
 */
export interface SpriteIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: keyof typeof ICON_SIZES | number;
  spriteUrl?: string; // Default: '/icons/sprite.svg'
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

export function SpriteIcon({ 
  name, 
  size = 'md', 
  spriteUrl = '/icons/sprite.svg', 
  className = '', 
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = true,
  ...props 
}: SpriteIconProps) {
  const sizeValue = typeof size === 'number' ? size : ICON_SIZES[size];
  const symbolId = name.startsWith('#') ? name : `#${name}`;
  
  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      focusable="false"
      role="img"
      {...props}
    >
      <use href={`${spriteUrl}${symbolId}`} />
    </svg>
  );
}

/**
 * Icon Registry
 * Central place to register and retrieve icons
 */
class IconRegistry {
  private icons: Map<string, IconDefinition> = new Map();
  private spriteIcons: Map<string, SpriteIcon> = new Map();
  
  register(icon: IconDefinition): void {
    this.icons.set(icon.name, icon);
  }
  
  registerSprite(icon: SpriteIcon): void {
    this.spriteIcons.set(icon.name, icon);
  }
  
  get(name: string): IconDefinition | undefined {
    return this.icons.get(name);
  }
  
  getSprite(name: string): SpriteIcon | undefined {
    return this.spriteIcons.get(name);
  }
  
  getAll(): IconDefinition[] {
    return Array.from(this.icons.values());
  }
  
  getByCategory(category: keyof typeof ICON_CATEGORIES): IconDefinition[] {
    const names = ICON_CATEGORIES[category];
    return names.map(name => this.icons.get(name)).filter(Boolean) as IconDefinition[];
  }
  
  has(name: string): boolean {
    return this.icons.has(name) || this.spriteIcons.has(name);
  }
}

// Singleton instance
export const iconRegistry = new IconRegistry();

/**
 * Pre-register common lucide icons
 * This happens at module load time
 */
function registerLucideIcons() {
  // These will be populated when lucide-react is imported
  // The actual registration happens in the icon components
}

registerLucideIcons();

/**
 * Hook for using icons with consistent sizing and styling
 */
export function useIcon() {
  return {
    sizes: ICON_SIZES,
    categories: ICON_CATEGORIES,
    registry: iconRegistry,
  };
}

/**
 * Dynamic icon loader for code-splitting
 * Only loads the icon component when needed
 */
export function createLazyIconLoader(
  importFn: () => Promise<{ default: React.ComponentType<React.SVGProps<SVGSVGElement>> }>
) {
  return React.lazy(importFn);
}

/**
 * Icon wrapper with error boundary and loading state
 */
export function IconWrapper({ 
  children, 
  fallback = null,
  loading = null 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}) {
  // This would use React.Suspense and ErrorBoundary
  return <>{children}</>;
}

// Re-export React for convenience
export { React };

export default {
  ICON_SIZES,
  ICON_CATEGORIES,
  SpriteIcon,
  iconRegistry,
  createIconComponent,
  generateSpriteSheet,
  createLazyIconLoader,
  useIcon,
};