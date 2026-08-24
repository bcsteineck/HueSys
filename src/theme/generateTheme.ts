import type { BorderRadius, FontSize, FontWeight, Spacing, StyleState, TypographyState } from '../state/appState'
import { hexToOklch, oklchToHex, pickAccessibleForeground } from './color'
import type { ColorScaleStep, Palette } from './color'
import { resolveFontFamily, resolveFontWeight } from './fonts'
import type { Theme, ThemeRadius, ThemeSpacing } from './types'

// --- Typography scale ------------------------------------------------

// Font Size adjusts a proportional scale, not one global size. "Medium"
// matches the values the component library used before Typography
// existed as its own concern, so the default look is unchanged.
const FONT_SIZE_SCALE: Record<FontSize, { sm: string; base: string; lg: string }> = {
  small: { sm: '0.75rem', base: '0.875rem', lg: '1rem' },
  medium: { sm: '0.8125rem', base: '1rem', lg: '1.125rem' },
  large: { sm: '0.875rem', base: '1.125rem', lg: '1.3125rem' },
}

// Font Weight adjusts a small hierarchy (body text vs. interactive
// controls), not one global weight. "Medium" again matches the previous
// hardcoded values (unset/400 body, 600 control).
const FONT_WEIGHT_SCALE: Record<FontWeight, { body: number; control: number }> = {
  regular: { body: 400, control: 500 },
  medium: { body: 400, control: 600 },
  semibold: { body: 500, control: 700 },
}

// --- Radius scale ------------------------------------------------

// "Subtle" matches the previous fixed radius values, so the default look
// is unchanged; the other three options fan out around it.
const RADIUS_SCALE: Record<BorderRadius, ThemeRadius> = {
  sharp: { sm: '2px', md: '4px', lg: '6px' },
  subtle: { sm: '4px', md: '8px', lg: '12px' },
  rounded: { sm: '8px', md: '12px', lg: '18px' },
  soft: { sm: '12px', md: '18px', lg: '28px' },
}

// --- Spacing scale ------------------------------------------------

// "Medium" matches the fixed spacing scale the component library used
// before Style existed as its own concern (styles/_variables.scss),
// so the default look is unchanged.
const SPACING_SCALE: Record<Spacing, ThemeSpacing> = {
  compact: { space1: '0.2rem', space2: '0.375rem', space3: '0.5rem', space4: '0.75rem', space5: '1.125rem', space6: '1.5rem' },
  medium: { space1: '0.25rem', space2: '0.5rem', space3: '0.75rem', space4: '1rem', space5: '1.5rem', space6: '2rem' },
  spacious: { space1: '0.375rem', space2: '0.75rem', space3: '1rem', space4: '1.5rem', space5: '2rem', space6: '2.75rem' },
}

// --- Fixed structural defaults ------------------------------------------------

// Not exposed as controls (per product spec). These are the exact values
// the previous "Minimal" Style used, so the default look is unchanged.
const FIXED_BACKGROUND_STEP: ColorScaleStep = 50
const FIXED_SURFACE_STEP: ColorScaleStep = 100
const FIXED_BORDER_STEP: ColorScaleStep = 200
const FIXED_SHADOWS = { sm: '0 1px 2px rgba(0, 0, 0, 0.05)', md: '0 2px 6px rgba(0, 0, 0, 0.06)' }
const FIXED_BORDER_WIDTH = '1px'
const FIXED_TRANSITION_FAST = '150ms ease'

// --- Primary hover ------------------------------------------------

// Fixed — not a Style concern. Darkens light primaries and lightens dark
// primaries by the same amount, so hover stays visible either way.
const PRIMARY_HOVER_SHIFT = 0.08

function derivePrimaryHover(primaryColor: string): string {
  const oklch = hexToOklch(primaryColor)
  const direction = oklch.l > 0.5 ? -1 : 1
  const l = Math.min(1, Math.max(0, oklch.l + direction * PRIMARY_HOVER_SHIFT))
  return oklchToHex({ ...oklch, l })
}

// --- Theme assembly ------------------------------------------------

/**
 * Combines an already-generated Palette (Colors), Typography state, and
 * Style state into the final Theme. Each concern stays independent:
 * Typography never touches colors, Style never touches colors or
 * Typography, and Colors never touch Typography or Style. Structural
 * properties Style doesn't expose (shadows, border width, transitions,
 * surface treatment) use fixed sensible defaults. `masterColor`, when
 * provided, records that the active Brand Palette has an explicit Base
 * Color (Palette mode) rather than being fully user-supplied (Custom mode).
 */
export function generateTheme(palette: Palette, typography: TypographyState, style: StyleState, masterColor?: string): Theme {
  const primary = palette.brand.master
  const accent = palette.brand.accentA
  const fontSize = FONT_SIZE_SCALE[typography.size]
  const fontWeight = FONT_WEIGHT_SCALE[typography.weight]

  return {
    metadata: {
      masterColor: masterColor?.replace('#', ''),
    },
    colors: {
      primary,
      primaryHover: derivePrimaryHover(primary),
      primaryText: pickAccessibleForeground(primary),

      background: palette.neutralScale[FIXED_BACKGROUND_STEP],
      surface: palette.neutralScale[FIXED_SURFACE_STEP],

      text: palette.neutralScale[900],
      textMuted: palette.neutralScale[600],
      border: palette.neutralScale[FIXED_BORDER_STEP],

      success: palette.semantic.success,
      warning: palette.semantic.warning,
      danger: palette.semantic.danger,

      accent,
      accentText: pickAccessibleForeground(accent),
    },
    typography: {
      fontFamily: resolveFontFamily(typography.font),
      fontSizeSm: fontSize.sm,
      fontSizeBase: fontSize.base,
      fontSizeLg: fontSize.lg,
      // Not every curated font ships every requested weight (e.g.
      // Merriweather has no 500/600) — resolve to the nearest weight the
      // selected font actually supports rather than relying on the
      // browser's synthetic bold/thin.
      fontWeightBody: resolveFontWeight(typography.font, fontWeight.body),
      fontWeightControl: resolveFontWeight(typography.font, fontWeight.control),
    },
    radius: RADIUS_SCALE[style.radius],
    spacing: SPACING_SCALE[style.spacing],
    shadows: FIXED_SHADOWS,
    borders: {
      width: FIXED_BORDER_WIDTH,
    },
    transitions: {
      fast: FIXED_TRANSITION_FAST,
    },
  }
}
