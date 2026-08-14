export interface ThemeMetadata {
  name: string
  /** Hex input color the theme was generated from, e.g. '4F46E5'. */
  primaryColor: string
  recipeId: string
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

export type NeutralTemperature = 'warm' | 'neutral' | 'cool'
export type SurfaceContrast = 'low' | 'medium' | 'high'
export type BorderStrength = 'subtle' | 'medium' | 'strong'
export type RadiusStyle = 'sharp' | 'soft' | 'round'
export type ShadowStyle = 'none' | 'subtle' | 'elevated'
export type PrimaryColorUsage = 'minimal' | 'balanced' | 'bold'

/**
 * Declarative description of a theme's character. A recipe never computes
 * values itself — the (future) Theme Engine reads these characteristics to
 * derive a Theme from a primary color.
 */
export interface ThemeRecipe {
  id: string
  name: string
  neutralTemperature: NeutralTemperature
  surfaceContrast: SurfaceContrast
  borderStrength: BorderStrength
  radiusStyle: RadiusStyle
  shadowStyle: ShadowStyle
  primaryColorUsage: PrimaryColorUsage
}
