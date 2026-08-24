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
    '--font-size-sm': theme.typography.fontSizeSm,
    '--font-size-base': theme.typography.fontSizeBase,
    '--font-size-lg': theme.typography.fontSizeLg,
    '--font-weight-body': String(theme.typography.fontWeightBody),
    '--font-weight-control': String(theme.typography.fontWeightControl),
    '--radius-sm': theme.radius.sm,
    '--radius-md': theme.radius.md,
    '--radius-lg': theme.radius.lg,
    '--space-1': theme.spacing.space1,
    '--space-2': theme.spacing.space2,
    '--space-3': theme.spacing.space3,
    '--space-4': theme.spacing.space4,
    '--space-5': theme.spacing.space5,
    '--space-6': theme.spacing.space6,
    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--border-width': theme.borders.width,
    '--transition-fast': theme.transitions.fast,
  }
}
