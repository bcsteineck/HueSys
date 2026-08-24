import { hexToOklch, oklchToHex, pickAccessibleForeground } from './color'
import type { ColorScaleStep, Palette } from './color'
import { resolveFontFamily } from './fonts'
import type { BorderStrength, RadiusStyle, ShadowStyle, StyleRecipe, SurfaceContrast, Theme, ThemeRadius, ThemeShadows } from './types'

// --- Surface contrast ------------------------------------------------

// How far apart (in scale steps) background and surface sit. Background
// stays anchored at the lightest step; only surface moves further away as
// contrast increases. Both are selections from the Palette's already-
// generated neutral scale — Style never computes a new color here.
const SURFACE_CONTRAST_STEPS: Record<SurfaceContrast, { background: ColorScaleStep; surface: ColorScaleStep }> = {
  low: { background: 50, surface: 100 },
  medium: { background: 50, surface: 200 },
  high: { background: 50, surface: 300 },
}

// --- Border strength ------------------------------------------------

const BORDER_STRENGTH_STEP: Record<BorderStrength, ColorScaleStep> = {
  subtle: 200,
  medium: 300,
  strong: 400,
}

// --- Radius style ------------------------------------------------

const RADIUS_BY_STYLE: Record<RadiusStyle, ThemeRadius> = {
  sharp: { sm: '2px', md: '4px', lg: '8px' },
  soft: { sm: '4px', md: '8px', lg: '12px' },
  round: { sm: '8px', md: '12px', lg: '18px' },
}

// --- Shadow style ------------------------------------------------

const SHADOWS_BY_STYLE: Record<ShadowStyle, ThemeShadows> = {
  none: { sm: 'none', md: 'none' },
  subtle: { sm: '0 1px 2px rgba(0, 0, 0, 0.05)', md: '0 2px 6px rgba(0, 0, 0, 0.06)' },
  elevated: { sm: '0 1px 3px rgba(0, 0, 0, 0.08)', md: '0 8px 20px rgba(0, 0, 0, 0.1)' },
}

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
 * Combines an already-generated Palette with a Style into the final
 * Theme. This is where component-appearance decisions live — Style only
 * selects and recombines colors the Palette Engine already produced (plus
 * small derived interaction states like hover, via the Color Engine's own
 * primitives); it never invents a new color or regenerates the palette.
 * `masterColor`, if provided, records that the palette was anchored to a
 * user-supplied color rather than generated from scratch.
 */
export function generateTheme(palette: Palette, style: StyleRecipe, fontId: string, masterColor?: string): Theme {
  const { background, surface } = SURFACE_CONTRAST_STEPS[style.surfaceContrast]
  const borderStep = BORDER_STRENGTH_STEP[style.borderStrength]
  const primary = palette.brand.master
  const accent = palette.brand.accentA

  return {
    metadata: {
      name: style.name,
      masterColor: masterColor?.replace('#', ''),
      styleId: style.id,
    },
    colors: {
      primary,
      primaryHover: derivePrimaryHover(primary),
      primaryText: pickAccessibleForeground(primary),

      background: palette.neutralScale[background],
      surface: palette.neutralScale[surface],

      text: palette.neutralScale[900],
      textMuted: palette.neutralScale[600],
      border: palette.neutralScale[borderStep],

      success: palette.semantic.success,
      warning: palette.semantic.warning,
      danger: palette.semantic.danger,

      accent,
      accentText: pickAccessibleForeground(accent),
    },
    typography: {
      fontFamily: resolveFontFamily(fontId),
    },
    radius: RADIUS_BY_STYLE[style.radiusStyle],
    shadows: SHADOWS_BY_STYLE[style.shadowStyle],
    borders: {
      width: '1px',
    },
    transitions: {
      fast: '150ms ease',
    },
  }
}
