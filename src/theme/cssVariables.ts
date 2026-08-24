import type { Theme } from './types'

/**
 * Converts a Theme object into the fixed set of semantic CSS variables
 * that components read from. Token names never change — only values do.
 */
export function themeToCssVariables(theme: Theme): Record<string, string> {
  return {
    '--color-primary': theme.colors.primary,
    '--color-primary-hover': theme.colors.primaryHover,
    '--color-primary-text': theme.colors.primaryText,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-text': theme.colors.text,
    '--color-text-muted': theme.colors.textMuted,
    '--color-border': theme.colors.border,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-danger': theme.colors.danger,
    '--color-accent': theme.colors.accent,
    '--color-accent-text': theme.colors.accentText,
    '--font-family': theme.typography.fontFamily,
    '--radius-sm': theme.radius.sm,
    '--radius-md': theme.radius.md,
    '--radius-lg': theme.radius.lg,
    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--border-width': theme.borders.width,
    '--transition-fast': theme.transitions.fast,
  }
}
