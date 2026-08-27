export const COLOR_SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type ColorScaleStep = (typeof COLOR_SCALE_STEPS)[number]

export type ColorScale = Record<ColorScaleStep, string>

/** A color in OKLCH: lightness [0, 1], chroma [0, ~0.4], hue in degrees [0, 360). */
export interface Oklch {
  l: number
  c: number
  h: number
}

/**
 * The five brand colors: the master itself plus four distinct-but-
 * harmonious roles. This is what the Brand Palette displays and what a
 * Theme's `primary`/`accent` colors are drawn from — nothing about these
 * values ever depends on the selected Style.
 */
export interface BrandPalette {
  master: string
  deep: string
  muted: string
  accentA: string
  accentB: string
}

/**
 * The canonical, Style-independent neutral roles shown in the Neutral
 * Palette display. Fixed scale steps, always — a Theme built with a
 * different Style may pick *different* neutral-scale steps for its own
 * background/surface/border, but what's displayed here never changes.
 */
export interface PaletteNeutrals {
  background: string
  surface: string
  border: string
  textMuted: string
  text: string
}

/** Success/warning/danger, generated to feel like part of this specific palette rather than fixed generic colors. */
export interface PaletteSemantic {
  /**
   * Deliberately Accent's own color, not a separately generated hue — see
   * ThemeColors.info in theme/types.ts for the full reasoning (Info and
   * the Accent Badge are meant to feel related). Exposed here, at the
   * Color Foundation level, so both Theme generation and any read-only
   * palette display share the same single source rather than each
   * re-deriving "Info = Accent" independently.
   */
  info: string
  success: string
  warning: string
  danger: string
}

/**
 * The complete output of the Palette Engine: brand colors, the full
 * neutral scale (for Style to select structural values from), the fixed
 * neutral display roles, and semantic colors. A Style is combined with
 * this to produce a Theme — the Palette itself never changes because of
 * which Style is active.
 */
export interface Palette {
  brand: BrandPalette
  neutralScale: ColorScale
  neutrals: PaletteNeutrals
  semantic: PaletteSemantic
}
