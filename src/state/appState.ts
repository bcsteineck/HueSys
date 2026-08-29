import { DEFAULT_PRIMARY_COLOR, generateBrandPalette } from '../theme/color'
import type { BrandPalette } from '../theme/color'
import { DEFAULT_FONT_ID } from '../theme/fonts'

export type ActiveSection = 'colors' | 'typography' | 'style'

export type ColorMode = 'palette' | 'custom'

/**
 * Palette and Custom are two ways of operating on one current Brand
 * Palette, not two separately persisted datasets — Palette mode generates
 * `colors`, Custom mode edits it directly, and switching between them
 * never itself changes `colors`. Color #1 (`colors.master`) is always the
 * Base Color; there's no separate `baseColor` field to keep in sync or let
 * go stale, it's simply read from `colors.master` wherever needed.
 */
export interface ColorState {
  mode: ColorMode
  colors: BrandPalette
  /** Seeds Refresh's next variation — varies the palette's non-anchor roles across repeated generations from the same Base Color. Independent of `colors`; not used to reconstruct them. */
  variation: number
}

export type FontSize = 'small' | 'medium' | 'large'
export type FontWeight = 'regular' | 'medium' | 'semibold'

export interface TypographyState {
  font: string
  size: FontSize
  weight: FontWeight
}

export type BorderRadius = 'sharp' | 'subtle' | 'soft' | 'rounded'
export type Spacing = 'compact' | 'medium' | 'spacious'

export interface StyleState {
  radius: BorderRadius
  spacing: Spacing
}

export interface AppState {
  activeSection: ActiveSection
  color: ColorState
  typography: TypographyState
  style: StyleState
}

// The canonical default Brand Palette ("State 0") — generated once, the
// same way any Palette-mode generation works, so a fresh visit needs no
// user action before the generated component system renders.
const DEFAULT_BRAND_PALETTE = generateBrandPalette(DEFAULT_PRIMARY_COLOR, 0)

export const defaultAppState: AppState = {
  activeSection: 'colors',
  color: {
    mode: 'palette',
    colors: DEFAULT_BRAND_PALETTE,
    variation: 0,
  },
  typography: {
    font: DEFAULT_FONT_ID,
    size: 'medium',
    weight: 'medium',
  },
  style: {
    radius: 'subtle',
    spacing: 'medium',
  },
}
