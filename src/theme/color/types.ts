export const COLOR_SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type ColorScaleStep = (typeof COLOR_SCALE_STEPS)[number]

export type ColorScale = Record<ColorScaleStep, string>

export interface SemanticColorCandidates {
  primary: string
  primaryHover: string
  primaryActive: string
  primaryText: string

  background: string
  surface: string

  text: string
  textMuted: string
  border: string

  success: string
  warning: string
  danger: string
}

export interface ColorFoundation {
  primaryColor: string
  primaryScale: ColorScale
  neutralScale: ColorScale
  semantic: SemanticColorCandidates
}

/** A color in OKLCH: lightness [0, 1], chroma [0, ~0.4], hue in degrees [0, 360). */
export interface Oklch {
  l: number
  c: number
  h: number
}
