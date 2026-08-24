export interface ThemeMetadata {
  name: string
  /** Hex the palette was anchored to, e.g. '4F46E5' — present only when the user explicitly supplied a master color, absent for a randomly generated palette. */
  masterColor?: string
  styleId: string
}

export interface ThemeColors {
  primary: string
  primaryHover: string
  /** Text/icon color for content placed on a primary-colored surface (e.g. Button, Badge). */
  primaryText: string
  background: string
  surface: string
  text: string
  /** Secondary text — placeholders, helper text, muted labels. */
  textMuted: string
  border: string
  /** Status accents shared by Alert, Badge, and form validation states. */
  success: string
  warning: string
  danger: string
  /** A second, genuinely different palette hue — for content that wants palette variety without status meaning (e.g. an "accent" Badge, an "info" Alert). */
  accent: string
  /** Text/icon color for content placed on an accent-colored surface. */
  accentText: string
}

export interface ThemeTypography {
  fontFamily: string
}

export interface ThemeRadius {
  sm: string
  md: string
  lg: string
}

export interface ThemeShadows {
  sm: string
  md: string
}

export interface ThemeBorders {
  width: string
}

export interface ThemeTransitions {
  fast: string
}

export interface Theme {
  metadata: ThemeMetadata
  colors: ThemeColors
  typography: ThemeTypography
  radius: ThemeRadius
  shadows: ThemeShadows
  borders: ThemeBorders
  transitions: ThemeTransitions
}

export type SurfaceContrast = 'low' | 'medium' | 'high'
export type BorderStrength = 'subtle' | 'medium' | 'strong'
export type RadiusStyle = 'sharp' | 'soft' | 'round'
export type ShadowStyle = 'none' | 'subtle' | 'elevated'

/**
 * Declarative description of a Style's visual character — component
 * appearance only. A StyleRecipe never computes values itself and never
 * influences color generation (that's the Palette Engine's job); Theme
 * assembly reads these characteristics to decide how the Palette that's
 * already been generated gets applied to structural properties.
 */
export interface StyleRecipe {
  id: string
  name: string
  surfaceContrast: SurfaceContrast
  borderStrength: BorderStrength
  radiusStyle: RadiusStyle
  shadowStyle: ShadowStyle
}
