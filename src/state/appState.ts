import { DEFAULT_PRIMARY_COLOR, generateBrandPalette } from '../theme/color'
import type { BrandPalette } from '../theme/color'
import { DEFAULT_FONT_ID } from '../theme/fonts'

export type ActiveSection = 'colors' | 'typography' | 'style'

export type ColorMode = 'palette' | 'custom'

export interface PaletteColorState {
  /** Always equal to palette.colors.master — HueSys's own record of "what the user asked to anchor to." */
  baseColor: string
  colors: BrandPalette
  /** Varies the palette's non-anchor roles across repeated generations from the same baseColor (Refresh). */
  variation: number
}

export interface CustomColorState {
  colors: BrandPalette
}

/**
 * Colors are either generated (Palette) or user-supplied (Custom). Both
 * modes keep their own independent state so switching back and forth
 * never loses work — only `mode` decides which one is active. `custom` is
 * seeded from the current Palette the first time Custom mode is entered
 * (tracked by customInitialized) and is left alone after that.
 */
export interface ColorState {
  mode: ColorMode
  palette: PaletteColorState
  custom: CustomColorState
  customInitialized: boolean
}

export type FontSize = 'small' | 'medium' | 'large'
export type FontWeight = 'regular' | 'medium' | 'semibold'

export interface TypographyState {
  font: string
  size: FontSize
  weight: FontWeight
}

export type BorderRadius = 'sharp' | 'subtle' | 'rounded' | 'soft'
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
    palette: {
      baseColor: DEFAULT_BRAND_PALETTE.master,
      colors: DEFAULT_BRAND_PALETTE,
      variation: 0,
    },
    custom: {
      colors: DEFAULT_BRAND_PALETTE,
    },
    customInitialized: false,
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
