import type { Theme } from './types'

/**
 * Converts a Theme object into the fixed set of semantic CSS variables
 * that components read from. Token names never change — only values do.
 */
export function themeToCssVariables(theme: Theme): Record<string, string> {
  return {
    '--color-primary': theme.colors.primary,
    '--color-primary-hover': theme.colors.primaryHover,
    '--color-primary-active': theme.colors.primaryActive,
    '--color-primary-text': theme.colors.primaryText,

    '--color-secondary': theme.colors.secondary,
    '--color-secondary-hover': theme.colors.secondaryHover,
    '--color-secondary-text': theme.colors.secondaryText,

    '--color-background': theme.colors.background,
    '--color-field-background': theme.colors.fieldBackground,
    '--color-surface': theme.colors.surface,
    '--color-text': theme.colors.text,
    '--color-text-muted': theme.colors.textMuted,

    '--color-border': theme.colors.border,
    '--color-border-strong': theme.colors.borderStrong,

    '--color-disabled': theme.colors.disabled,
    '--color-disabled-text': theme.colors.disabledText,

    '--color-success': theme.colors.success,
    '--color-success-text': theme.colors.successText,
    '--color-success-surface': theme.colors.successSurface,
    '--color-success-strong-text': theme.colors.successStrongText,
    '--color-success-strong': theme.colors.successStrong,

    '--color-warning': theme.colors.warning,
    '--color-warning-text': theme.colors.warningText,
    '--color-warning-surface': theme.colors.warningSurface,
    '--color-warning-strong-text': theme.colors.warningStrongText,
    '--color-warning-strong': theme.colors.warningStrong,

    '--color-danger': theme.colors.danger,
    '--color-danger-text': theme.colors.dangerText,
    '--color-danger-surface': theme.colors.dangerSurface,
    '--color-danger-strong-text': theme.colors.dangerStrongText,
    '--color-danger-strong': theme.colors.dangerStrong,

    '--color-info': theme.colors.info,
    '--color-info-text': theme.colors.infoText,
    '--color-info-surface': theme.colors.infoSurface,

    '--color-accent': theme.colors.accent,
    '--color-accent-text': theme.colors.accentText,
    '--color-accent-surface': theme.colors.accentSurface,
    '--color-accent-surface-text': theme.colors.accentSurfaceText,

    '--color-focus-ring': theme.colors.focusRing,
    '--font-family': theme.typography.fontFamily,
    '--font-size-sm': theme.typography.fontSizeSm,
    '--font-size-base': theme.typography.fontSizeBase,
    '--font-size-lg': theme.typography.fontSizeLg,
    '--font-weight-body': String(theme.typography.fontWeightBody),
    '--font-weight-control': String(theme.typography.fontWeightControl),
    '--radius-sm': theme.radius.sm,
    '--radius-md': theme.radius.md,
    '--radius-lg': theme.radius.lg,
    '--radius-full': theme.radius.full,
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
