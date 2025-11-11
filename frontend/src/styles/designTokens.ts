/**
 * Design tokens for Naveo platform
 * Ensures visual consistency across the application
 */

export const colors = {
  // Primary brand colors
  primary: {
    main: '#1890ff',
    light: '#40a9ff',
    dark: '#096dd9',
    lighter: '#e6f7ff',
  },

  // Semantic colors
  success: {
    main: '#52c41a',
    light: '#73d13d',
    dark: '#389e0d',
    lighter: '#f6ffed',
  },
  warning: {
    main: '#faad14',
    light: '#ffc53d',
    dark: '#d48806',
    lighter: '#fffbe6',
  },
  error: {
    main: '#ff4d4f',
    light: '#ff7875',
    dark: '#cf1322',
    lighter: '#fff1f0',
  },
  info: {
    main: '#1890ff',
    light: '#40a9ff',
    dark: '#096dd9',
    lighter: '#e6f7ff',
  },

  // Neutral colors
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#f0f0f0',
      300: '#d9d9d9',
      400: '#bfbfbf',
      500: '#8c8c8c',
      600: '#595959',
      700: '#434343',
      800: '#262626',
      900: '#1f1f1f',
    },
  },

  // Chart colors
  chart: [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
  ],
} as const;

export const typography = {
  fontFamily: {
    base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
    mono: "'Fira Code', 'Courier New', monospace",
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

/**
 * Component-specific tokens
 */
export const components = {
  button: {
    height: {
      sm: '24px',
      base: '32px',
      lg: '40px',
    },
    padding: {
      sm: '4px 12px',
      base: '8px 16px',
      lg: '12px 24px',
    },
  },

  card: {
    padding: {
      sm: '12px',
      base: '16px',
      lg: '24px',
    },
    borderRadius: borderRadius.lg,
    shadow: shadows.sm,
  },

  input: {
    height: {
      sm: '24px',
      base: '32px',
      lg: '40px',
    },
    padding: {
      sm: '4px 8px',
      base: '8px 12px',
      lg: '12px 16px',
    },
    borderRadius: borderRadius.base,
  },

  table: {
    headerBg: colors.neutral.gray[50],
    rowHoverBg: colors.neutral.gray[100],
    borderColor: colors.neutral.gray[300],
  },
} as const;

/**
 * Utility function to get color value
 */
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = colors;

  for (const key of keys) {
    value = value?.[key];
  }

  return typeof value === 'string' ? value : colors.primary.main;
};

/**
 * Utility to create CSS custom properties
 */
export const cssVariables = {
  // Colors
  '--color-primary': colors.primary.main,
  '--color-success': colors.success.main,
  '--color-warning': colors.warning.main,
  '--color-error': colors.error.main,

  // Typography
  '--font-base': typography.fontFamily.base,
  '--font-heading': typography.fontFamily.heading,

  // Spacing
  '--spacing-base': spacing.base,
  '--spacing-lg': spacing.lg,

  // Border radius
  '--radius-base': borderRadius.base,
  '--radius-lg': borderRadius.lg,

  // Transitions
  '--transition-base': transitions.base,
} as const;

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  components,
  getColor,
  cssVariables,
};
