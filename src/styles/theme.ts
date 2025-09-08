export const theme = {
  colors: {
    primary: {
      DEFAULT: '#1F4E79',
    },
    secondary: {
      DEFAULT: '#F5A623',
    },
    accent: {
      DEFAULT: '#34A853',
    },
    gray: {
      100: '#F7F7F7',
      300: '#D1D1D1',
      500: '#9B9B9B',
      700: '#4A4A4A',
      900: '#1A1A1A',
    },
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    h1: ['2.25rem', { lineHeight: '1.2' }],
    h2: ['1.875rem', { lineHeight: '1.2' }],
    h3: ['1.5rem', { lineHeight: '1.2' }],
    body: ['1rem', { lineHeight: '1.5' }],
    caption: ['0.875rem', { lineHeight: '1.4' }],
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
} as const;

export type Theme = typeof theme;