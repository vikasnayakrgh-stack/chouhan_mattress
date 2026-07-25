/**
 * Font Configuration using next/font
 * Optimized font loading with display: swap, preconnect, and variable fonts
 * 
 * Fonts:
 * - Poppins: 400, 500, 600, 700, 800 (headings, UI)
 * - Inter: 400, 500, 600 (body text, UI)
 */

import { Poppins, Inter } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Poppins - Google Font
 * Used for headings, UI elements, brand text
 * Weights: 400, 500, 600, 700, 800
 */
export const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-poppins',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  weight: ['400', '500', '600', '700', '800'],
  preload: true,
  adjustFontFallback: true,
});

/**
 * Inter - Google Font
 * Used for body text, UI, data display
 * Weights: 400, 500, 600
 */
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  weight: ['400', '500', '600'],
  preload: true,
  adjustFontFallback: true,
});

/**
 * Local font fallback (if self-hosting)
 * Uncomment and configure if hosting fonts locally
 */
// export const poppinsLocal = localFont({
//   src: [
//     { path: '../../public/fonts/poppins/Poppins-Regular.woff2', weight: '400', style: 'normal' },
//     { path: '../../public/fonts/poppins/Poppins-Medium.woff2', weight: '500', style: 'normal' },
//     { path: '../../public/fonts/poppins/Poppins-SemiBold.woff2', weight: '600', style: 'normal' },
//     { path: '../../public/fonts/poppins/Poppins-Bold.woff2', weight: '700', style: 'normal' },
//     { path: '../../public/fonts/poppins/Poppins-ExtraBold.woff2', weight: '800', style: 'normal' },
//   ],
//   display: 'swap',
//   variable: '--font-poppins',
//   fallback: ['system-ui', 'sans-serif'],
//   preload: true,
//   adjustFontFallback: true,
// });

// export const interLocal = localFont({
//   src: [
//     { path: '../../public/fonts/inter/Inter-Regular.woff2', weight: '400', style: 'normal' },
//     { path: '../../public/fonts/inter/Inter-Medium.woff2', weight: '500', style: 'normal' },
//     { path: '../../public/fonts/inter/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
//   ],
//   display: 'swap',
//   variable: '--font-inter',
//   fallback: ['system-ui', 'sans-serif'],
//   preload: true,
//   adjustFontFallback: true,
// });

/**
 * Font CSS variable names for Tailwind integration
 * Use in globals.css or tailwind.config.ts
 */
export const FONT_VARIABLES = {
  poppins: '--font-poppins',
  inter: '--font-inter',
} as const;

/**
 * Combined font class names for RootLayout
 */
export const fontClassNames = `${poppins.variable} ${inter.variable}`;

/**
 * Preconnect and DNS prefetch hints for font domains
 * Add these to layout.tsx <head>
 */
export const fontPreconnectHints = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' as const },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
  { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
  { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
];

/**
 * Font subset configuration for performance
 * Only load latin subset unless internationalization needed
 */
export const FONT_SUBSETS = {
  poppins: ['latin', 'latin-ext'] as const,
  inter: ['latin'] as const,
};

/**
 * Variable font axes (for future variable font support)
 * Poppins Variable: wght@400..800
 * Inter Variable: wght@100..900
 */
export const VARIABLE_FONT_CONFIG = {
  poppins: {
    family: 'Poppins Variable',
    src: 'url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJbecmNE.woff2) format("woff2-variations")',
    weight: '400 800',
    display: 'swap',
  },
  inter: {
    family: 'Inter Variable',
    src: 'url(https://rsms.me/inter/font-files/InterVariable.woff2) format("woff2-variations")',
    weight: '100 900',
    display: 'swap',
  },
};

/**
 * Generate @font-face declarations for local hosting
 * Use if self-hosting fonts for better performance control
 */
export function generateFontFaceCSS(): string {
  return `
/* Poppins - Self-hosted fallback */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/poppins/Poppins-Regular.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/poppins/Poppins-Medium.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/poppins/Poppins-SemiBold.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/poppins/Poppins-Bold.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url('/fonts/poppins/Poppins-ExtraBold.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Inter - Self-hosted fallback */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter/Inter-Regular.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/inter/Inter-Medium.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/inter/Inter-SemiBold.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`;
}

/**
 * Tailwind CSS font family configuration
 * Add to tailwind.config.ts fontFamily section
 */
export const tailwindFontFamilies = {
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
  display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
  body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
};

/**
 * CSS custom properties for font sizes and line heights
 * Use with @layer utilities in globals.css
 */
export const fontScaleCSS = `
:root {
  /* Font families via CSS variables */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-heading: var(--font-poppins), system-ui, sans-serif;
  --font-display: var(--font-poppins), system-ui, sans-serif;
  --font-body: var(--font-inter), system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  
  /* Font sizes (fluid typography with clamp) */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);      /* 12-14px */
  --text-sm: clamp(0.875rem, 0.825rem + 0.25vw, 1rem);         /* 14-16px */
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);        /* 16-18px */
  --text-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem);      /* 18-20px */
  --text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);          /* 20-24px */
  --text-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem);       /* 24-30px */
  --text-3xl: clamp(1.875rem, 1.65rem + 1.125vw, 2.5rem);      /* 30-40px */
  --text-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3.125rem);       /* 36-50px */
  --text-5xl: clamp(3rem, 2.5rem + 2.5vw, 4rem);               /* 48-64px */
  --text-6xl: clamp(3.75rem, 3rem + 3.75vw, 5rem);             /* 60-80px */
  
  /* Line heights */
  --leading-tight: 1.1;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* Letter spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
`;

export default {
  poppins,
  inter,
  FONT_VARIABLES,
  fontClassNames,
  fontPreconnectHints,
  FONT_SUBSETS,
  VARIABLE_FONT_CONFIG,
  generateFontFaceCSS,
  tailwindFontFamilies,
  fontScaleCSS,
};