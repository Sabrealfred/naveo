/**
 * Responsive design constants and utilities for Naveo platform
 * Following Ant Design's breakpoint system
 */

export const BREAKPOINTS = {
  xs: 480,   // Mobile portrait
  sm: 576,   // Mobile landscape
  md: 768,   // Tablet
  lg: 992,   // Desktop
  xl: 1200,  // Large desktop
  xxl: 1600, // Extra large desktop
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Media query strings for use in styled components or inline styles
 */
export const mediaQueries = {
  xs: `@media (max-width: ${BREAKPOINTS.xs}px)`,
  sm: `@media (max-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (max-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (max-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (max-width: ${BREAKPOINTS.xl}px)`,
  xxl: `@media (max-width: ${BREAKPOINTS.xxl}px)`,

  // Min-width queries (mobile-first approach)
  smUp: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  mdUp: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lgUp: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xlUp: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  xxlUp: `@media (min-width: ${BREAKPOINTS.xxl}px)`,
} as const;

/**
 * Responsive padding/margin values
 */
export const spacing = {
  xs: { padding: 8, margin: 8 },
  sm: { padding: 12, margin: 12 },
  md: { padding: 16, margin: 16 },
  lg: { padding: 24, margin: 24 },
  xl: { padding: 32, margin: 32 },
} as const;

/**
 * Responsive font sizes
 */
export const fontSizes = {
  heading1: { xs: 24, sm: 28, md: 32, lg: 36, xl: 40 },
  heading2: { xs: 20, sm: 22, md: 24, lg: 28, xl: 30 },
  heading3: { xs: 18, sm: 20, md: 22, lg: 24, xl: 26 },
  heading4: { xs: 16, sm: 18, md: 20, lg: 22, xl: 24 },
  body: { xs: 14, sm: 14, md: 14, lg: 16, xl: 16 },
  small: { xs: 12, sm: 12, md: 12, lg: 14, xl: 14 },
} as const;

/**
 * Hook to get current breakpoint (for React components)
 */
export const useBreakpoint = () => {
  if (typeof window === 'undefined') return 'lg';

  const width = window.innerWidth;

  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS.xxl) return 'xl';
  return 'xxl';
};

/**
 * Get responsive style value based on current breakpoint
 */
export const getResponsiveValue = <T,>(
  values: Partial<Record<Breakpoint, T>>,
  breakpoint: Breakpoint
): T | undefined => {
  // Try to get exact match first
  if (values[breakpoint]) return values[breakpoint];

  // Fallback to closest smaller breakpoint
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);

  for (let i = currentIndex - 1; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp]) return values[bp];
  }

  return undefined;
};

/**
 * Common responsive container styles
 */
export const containerStyles = {
  mobile: {
    padding: '12px',
    maxWidth: '100%',
  },
  tablet: {
    padding: '16px',
    maxWidth: '100%',
  },
  desktop: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
} as const;

/**
 * Responsive card styles
 */
export const cardStyles = {
  mobile: {
    padding: '12px',
    marginBottom: '12px',
  },
  tablet: {
    padding: '16px',
    marginBottom: '16px',
  },
  desktop: {
    padding: '24px',
    marginBottom: '24px',
  },
} as const;

/**
 * Get responsive spacing based on screen size
 */
export const getResponsiveSpacing = (breakpoint: Breakpoint) => {
  if (breakpoint === 'xs' || breakpoint === 'sm') return spacing.sm;
  if (breakpoint === 'md') return spacing.md;
  return spacing.lg;
};

export default {
  BREAKPOINTS,
  mediaQueries,
  spacing,
  fontSizes,
  useBreakpoint,
  getResponsiveValue,
  containerStyles,
  cardStyles,
  getResponsiveSpacing,
};
