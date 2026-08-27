export interface ThemeMetadata {
  /** Hex the palette was anchored to, e.g. '4F46E5' — present only when the active Brand Palette has an explicit Base Color (Palette mode), absent in Custom mode. */
  masterColor?: string
}

export interface ThemeColors {
  primary: string
  primaryHover: string
  /** A step further than `primaryHover`, in the same direction — for `:active`/pressed feedback on filled Primary surfaces. */
  primaryActive: string
  /** Text/icon color for content placed on a primary-colored surface (e.g. Button, Badge). */
  primaryText: string

  /**
   * A lower-emphasis *treatment* derived from Primary/Muted — not an
   * independent color choice. Used anywhere a component wants "clearly
   * branded, but subordinate to Primary": the Secondary Button, Badge's
   * Primary variant, and the hover fill for Outline/Ghost buttons.
   */
  secondary: string
  secondaryHover: string
  /** Text/icon color for content placed on a `secondary` surface. */
  secondaryText: string

  background: string
  surface: string
  text: string
  /** Secondary text — placeholders, helper text, muted labels. */
  textMuted: string

  /**
   * Structural boundaries — Card, and the resting/disabled state of every
   * field and selection control. Deliberately not contrast-guaranteed on
   * its own: these controls are also identifiable by shape, fill, and
   * adjacent label text, so a quiet border reads as "calm," not
   * "invisible." See `borderStrong` for the guardrail tier.
   */
  border: string
  /**
   * A guaranteed-≥3:1-against-`background` neutral, reserved for cases
   * where a border is genuinely the *only* available boundary cue —
   * currently used as the hover-state border for fields (a deliberate
   * "getting stronger" step between resting `border` and the dedicated
   * `focusRing`/`danger` treatments). Not used as anyone's default resting
   * border: applying a guardrail-strength token everywhere reads as
   * harsh rather than accessible.
   */
  borderStrong: string

  /** Neutral fill for disabled surfaces (fields, filled buttons/badges when disabled). */
  disabled: string
  /** Text/icon color for content on a `disabled` surface — still perceivable, not decorative. */
  disabledText: string

  /** Status accents shared by Alert, Badge, and form validation states (e.g. Input's error border). Palette-personality-blended, but always recognizable as its status hue family. */
  success: string
  /** Text/icon color for content on a `successSurface`. */
  successText: string
  /** Alert's Success surface — Tinted tier (see semanticSurface.ts): calm and clearly-hued, built to comfortably hold a dark foreground rather than compete with Primary across a full-width surface. */
  successSurface: string
  /** Text/icon color for content on `successStrong`. */
  successStrongText: string
  /** Badge's Success surface — Strong tier: bolder than `successSurface`, since a small badge can absorb more saturation than a full-width Alert without becoming visually heavy. */
  successStrong: string

  warning: string
  warningText: string
  warningSurface: string
  warningStrongText: string
  warningStrong: string

  danger: string
  dangerText: string
  dangerSurface: string
  dangerStrongText: string
  dangerStrong: string

  /** Informational family — deliberately derived from Accent rather than a fixed blue, so Info and the Accent Badge feel related. Alert-only (no Badge "Info" variant exists), so there's no `infoStrong` counterpart. */
  info: string
  infoText: string
  infoSurface: string

  /** A second, genuinely different palette hue — for content that wants palette variety without status meaning (e.g. an "accent" Badge). */
  accent: string
  /** Text/icon color for content placed on an accent-colored surface. */
  accentText: string
  /** Accent Badge's surface — Tinted tier (see semanticSurface.ts), paired with `accentSurfaceText`. Distinct from the bolder `accent`/`accentText` Solid pair, which remains available for other uses. */
  accentSurface: string
  /** Text/border color for content on `accentSurface`. */
  accentSurfaceText: string

  /** Shared focus-indicator color for every interactive generated component — Primary when it reads clearly against `background`, otherwise a guaranteed-visible neutral fallback. Independent of any component's own border/fill treatment. */
  focusRing: string
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
