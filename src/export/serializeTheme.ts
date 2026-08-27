import { themeToCssVariables } from '../theme/cssVariables'
import type { Theme } from '../theme/types'

// The exact CSS variable names the exported design system actually needs
// — a curated subset of themeToCssVariables()'s full output. Excluded:
// the Solid-tier --color-accent(-text) pair and the Strong-tier
// success/warning/danger pairs (superseded by the Tinted tier Badge uses
// today — see semanticSurface.ts) and --font-size-lg (only consumed by
// HueSys's own Typography Live-Preview specimen, never by a real
// component). Order here is the order written to theme.css.
const EXPORTED_CSS_VARIABLES: readonly string[] = [
  '--color-primary',
  '--color-primary-hover',
  '--color-primary-active',
  '--color-primary-text',

  '--color-secondary',
  '--color-secondary-hover',
  '--color-secondary-text',

  '--color-background',
  '--color-field-background',
  '--color-surface',
  '--color-text',
  '--color-text-muted',

  '--color-border',
  '--color-border-strong',

  '--color-disabled',
  '--color-disabled-text',

  '--color-success',
  '--color-success-text',
  '--color-success-surface',

  '--color-warning',
  '--color-warning-text',
  '--color-warning-surface',

  '--color-danger',
  '--color-danger-text',
  '--color-danger-surface',

  '--color-info',
  '--color-info-text',
  '--color-info-surface',

  '--color-accent-surface',
  '--color-accent-surface-text',

  '--color-focus-ring',

  '--font-family',
  '--font-size-sm',
  '--font-size-base',
  '--font-weight-body',
  '--font-weight-control',

  '--radius-sm',
  '--radius-md',
  '--radius-lg',

  '--space-1',
  '--space-2',
  '--space-3',
  '--space-4',
  '--space-5',
  '--space-6',

  '--shadow-sm',
  '--shadow-md',

  '--border-width',
  '--transition-fast',
]

// Every value reaching here is a closed-form design-token value produced
// by generateTheme() — a hex color, a rem/px length, an ms duration, a
// small integer, a font-family stack (quoted names, commas, hyphens), or
// a CSS shorthand built from those — never free user text. This is a
// defensive check (per Export §28), not a real sanitizer: it rejects
// anything that couldn't legally be one of those shapes rather than
// trying to escape untrusted input.
const SAFE_CSS_VALUE = /^[a-zA-Z0-9#%.,()\s/'-]+$/

function assertSafeCssValue(name: string, value: string): string {
  if (!SAFE_CSS_VALUE.test(value)) {
    throw new Error(`Export Engine: refusing to serialize unsafe CSS value for ${name}`)
  }
  return value
}

/**
 * Deterministic, human-readable theme.css text: the same Theme object
 * always produces byte-identical output. Reuses themeToCssVariables() —
 * the exact function Live Preview itself uses — rather than re-deriving
 * CSS variable names or values, so exported and previewed output can
 * never drift apart (Export §29).
 */
export function serializeThemeCss(theme: Theme): string {
  const allVariables = themeToCssVariables(theme)
  const lines = EXPORTED_CSS_VARIABLES.map((name) => {
    const value = allVariables[name]
    if (value === undefined) {
      throw new Error(`Export Engine: expected CSS variable ${name} was not produced by themeToCssVariables`)
    }
    return `  ${name}: ${assertSafeCssValue(name, value)};`
  })
  return `:root {\n${lines.join('\n')}\n}\n`
}
