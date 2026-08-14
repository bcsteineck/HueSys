import { hexToOklch, oklchToHex } from './color'
import type { ColorFoundation, ColorScale, ColorScaleStep } from './color'
import { resolveFontFamily } from './fonts'
import type {
  BorderStrength,
  NeutralTemperature,
  PrimaryColorUsage,
  RadiusStyle,
  ShadowStyle,
  SurfaceContrast,
  Theme,
  ThemeRadius,
  ThemeRecipe,
  ThemeShadows,
} from './types'

// --- Neutral temperature -------------------------------------------------

// Fixed hue nudge applied across the whole neutral scale. Chroma is left
// exactly as the Color Engine generated it — only hue direction shifts —
// so at the scale's already-tiny chroma this stays a restrained tint
// rather than a visibly colored neutral.
const NEUTRAL_TEMPERATURE_HUE_SHIFT: Record<NeutralTemperature, number> = {
  warm: -20,
  neutral: 0,
  cool: 20,
}

function applyNeutralTemperature(neutralScale: ColorScale, temperature: NeutralTemperature): ColorScale {
  const shift = NEUTRAL_TEMPERATURE_HUE_SHIFT[temperature]
  if (shift === 0) return neutralScale

  const shifted = {} as ColorScale
  for (const [step, hex] of Object.entries(neutralScale) as [string, string][]) {
    const oklch = hexToOklch(hex)
    shifted[Number(step) as ColorScaleStep] = oklchToHex({ ...oklch, h: (oklch.h + shift + 360) % 360 })
  }
  return shifted
}

// --- Surface contrast ------------------------------------------------

// How far apart (in scale steps) background and surface sit. Background
// stays anchored at the lightest step; only surface moves further away as
// contrast increases.
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

// --- Primary color usage ------------------------------------------------

// `primary` itself never moves — the user's chosen color stays the visual
// anchor at every usage level. Usage instead controls how far the hover
// state steps away from it (in OKLCH lightness), toward the background if
// the primary is light, toward white if it's dark, so hover stays visible
// either way.
const PRIMARY_HOVER_SHIFT_BY_USAGE: Record<PrimaryColorUsage, number> = {
  minimal: 0.05,
  balanced: 0.08,
  bold: 0.12,
}

function derivePrimaryHover(primaryColor: string, usage: PrimaryColorUsage): string {
  const oklch = hexToOklch(primaryColor)
  const direction = oklch.l > 0.5 ? -1 : 1
  const l = Math.min(1, Math.max(0, oklch.l + direction * PRIMARY_HOVER_SHIFT_BY_USAGE[usage]))
  return oklchToHex({ ...oklch, l })
}

// --- Theme assembly ------------------------------------------------

/**
 * Converts a ColorFoundation into a Theme by interpreting a declarative
 * ThemeRecipe plus a font selection. This is where design decisions live —
 * it only selects and recombines values the Color Engine already produced
 * (with small, direction-aware OKLCH nudges via its exported primitives);
 * it never regenerates a color scale itself.
 */
export function generateTheme(colorFoundation: ColorFoundation, recipe: ThemeRecipe, fontId: string): Theme {
  const neutralScale = applyNeutralTemperature(colorFoundation.neutralScale, recipe.neutralTemperature)
  const { background, surface } = SURFACE_CONTRAST_STEPS[recipe.surfaceContrast]
  const borderStep = BORDER_STRENGTH_STEP[recipe.borderStrength]

  return {
    metadata: {
      name: recipe.name,
      primaryColor: colorFoundation.primaryColor.replace('#', ''),
      recipeId: recipe.id,
    },
    colors: {
      primary: colorFoundation.semantic.primary,
      primaryHover: derivePrimaryHover(colorFoundation.semantic.primary, recipe.primaryColorUsage),
      primaryText: colorFoundation.semantic.primaryText,

      background: neutralScale[background],
      surface: neutralScale[surface],

      text: neutralScale[900],
      textMuted: neutralScale[600],
      border: neutralScale[borderStep],

      success: colorFoundation.semantic.success,
      warning: colorFoundation.semantic.warning,
      danger: colorFoundation.semantic.danger,
    },
    typography: {
      fontFamily: resolveFontFamily(fontId),
    },
    radius: RADIUS_BY_STYLE[recipe.radiusStyle],
    shadows: SHADOWS_BY_STYLE[recipe.shadowStyle],
    borders: {
      width: '1px',
    },
    transitions: {
      fast: '150ms ease',
    },
  }
}
