export interface ThemeMetadata {
  /** Hex the palette was anchored to, e.g. '4F46E5' — present only when the active Brand Palette has an explicit Base Color (Palette mode), absent in Custom mode. */
  masterColor?: string
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

/**
 * Typography tokens. Font Size produces a small proportional scale rather
 * than one global size; Font Weight produces a small hierarchy (body text
 * vs. interactive controls) rather than one global weight.
 */
export interface ThemeTypography {
  fontFamily: string
  fontSizeSm: string
  fontSizeBase: string
  fontSizeLg: string
  fontWeightBody: number
  fontWeightControl: number
}

export interface ThemeRadius {
  sm: string
  md: string
  lg: string
}

/** Generated spacing scale — consumed by the generated component library only, never by HueSys's own application layout. */
export interface ThemeSpacing {
  space1: string
  space2: string
  space3: string
  space4: string
  space5: string
  space6: string
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
  spacing: ThemeSpacing
  shadows: ThemeShadows
  borders: ThemeBorders
  transitions: ThemeTransitions
}
