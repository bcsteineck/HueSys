import type { Theme } from './types'

/**
 * Hardcoded placeholder Theme. Phase 2 replaces this with themes generated
 * by the Theme Engine from a primary color + recipe, but the shape stays
 * the same — everything visual already derives from this object.
 */
export const defaultTheme: Theme = {
  metadata: {
    name: 'Default',
    primaryColor: '4F46E5',
    recipeId: 'minimal',
  },
  colors: {
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    primaryText: '#ffffff',
    background: '#ffffff',
    surface: '#f5f5f7',
    text: '#1f2024',
    textMuted: '#6b6b76',
    border: '#e2e2e6',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  borders: {
    width: '1px',
  },
  transitions: {
    fast: '150ms ease',
  },
}
