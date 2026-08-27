import type { BorderRadius, FontSize, FontWeight, Spacing, StyleState, TypographyState } from '../state/appState'
import {
  contrastRatio,
  deriveInteractionShift,
  deriveSolidSurface,
  deriveStrongSurface,
  deriveTintedSurface,
  hexToOklch,
  neutralScaleMidpoint,
  oklchToHex,
  pickAccessibleNeutralStep,
  resolveForeground,
} from './color'
import type { ColorScaleStep, Palette } from './color'
import { resolveFontFamily, resolveFontWeight } from './fonts'
import type { Theme, ThemeRadius, ThemeSpacing } from './types'

// --- Typography scale ------------------------------------------------

// Font Size adjusts a proportional scale, not one global size. "Medium"
// matches the values the component library used before Typography
// existed as its own concern, so the default look is unchanged.
const FONT_SIZE_SCALE: Record<FontSize, { sm: string; base: string; lg: string }> = {
  small: { sm: '0.75rem', base: '0.875rem', lg: '1rem' },
  medium: { sm: '0.8125rem', base: '1rem', lg: '1.125rem' },
  large: { sm: '0.875rem', base: '1.125rem', lg: '1.3125rem' },
}

// Font Weight adjusts a small hierarchy (body text vs. interactive
// controls), not one global weight. "Medium" again matches the previous
// hardcoded values (unset/400 body, 600 control).
const FONT_WEIGHT_SCALE: Record<FontWeight, { body: number; control: number }> = {
  regular: { body: 400, control: 500 },
  medium: { body: 400, control: 600 },
  semibold: { body: 500, control: 700 },
}

// --- Radius scale ------------------------------------------------

// "Subtle" matches the previous fixed radius values, so the default look
// is unchanged; the other three options fan out around it.
const RADIUS_SCALE: Record<BorderRadius, ThemeRadius> = {
  sharp: { sm: '2px', md: '4px', lg: '6px' },
  subtle: { sm: '4px', md: '8px', lg: '12px' },
  rounded: { sm: '8px', md: '12px', lg: '18px' },
  soft: { sm: '12px', md: '18px', lg: '28px' },
}

// --- Spacing scale ------------------------------------------------

// "Medium" matches the fixed spacing scale the component library used
// before Style existed as its own concern (styles/_variables.scss),
// so the default look is unchanged.
const SPACING_SCALE: Record<Spacing, ThemeSpacing> = {
  compact: { space1: '0.2rem', space2: '0.375rem', space3: '0.5rem', space4: '0.75rem', space5: '1.125rem', space6: '1.5rem' },
  medium: { space1: '0.25rem', space2: '0.5rem', space3: '0.75rem', space4: '1rem', space5: '1.5rem', space6: '2rem' },
  spacious: { space1: '0.375rem', space2: '0.75rem', space3: '1rem', space4: '1.5rem', space5: '2rem', space6: '2.75rem' },
}

// --- Fixed structural defaults ------------------------------------------------

// Not exposed as controls (per product spec). These are the exact values
// the previous "Minimal" Style used, so the default look is unchanged.
const FIXED_BACKGROUND_STEP: ColorScaleStep = 50
const FIXED_SURFACE_STEP: ColorScaleStep = 100
// 300, not 200 — resting borders (fields, unchecked Checkbox/Radio,
// off Switch) were nearly invisible against the equally-light 50/100
// background/surface steps. One step darker keeps it clearly a "quiet"
// border (borderStrong's guaranteed-3:1 hover tier lands much further
// down the scale, around 600, so the two stay well separated).
const FIXED_BORDER_STEP: ColorScaleStep = 300
const FIXED_SHADOWS = { sm: '0 1px 2px rgba(0, 0, 0, 0.05)', md: '0 2px 6px rgba(0, 0, 0, 0.06)' }
const FIXED_BORDER_WIDTH = '1px'
const FIXED_TRANSITION_FAST = '150ms ease'

// --- Interaction-state shifts ------------------------------------------------

// Fixed — not a Style concern. Darkens light surfaces and lightens dark
// ones by the same amount, so hover/active stay visible either way. Active
// shifts further than hover in the same direction, so pressed feedback
// reads as "more of the same," not a different color.
const HOVER_SHIFT = 0.08
const ACTIVE_SHIFT = 0.14

// --- Disabled surface ------------------------------------------------

// Sits between the neutral scale's `surface` and `border` steps — visibly
// muted without going as dark as a structural border would look as a
// fill. `disabledText` reuses the scale's existing 500 step directly (no
// interpolation needed): dark enough to stay perceivable, light enough to
// read as de-emphasized.
const DISABLED_SURFACE_STEP_FROM: ColorScaleStep = 100
const DISABLED_SURFACE_STEP_TO: ColorScaleStep = 200
const DISABLED_SURFACE_WEIGHT = 0.6
// 700, not a lighter/subtler step: the fill (a visibly muted, tinted
// neutral) is what signals "disabled," not the text itself needing to
// look faint — disabled content still has to be readable at normal-text
// contrast against its own (light) disabled fill.
const DISABLED_TEXT_STEP: ColorScaleStep = 700

// --- Theme assembly ------------------------------------------------

/**
 * Combines an already-generated Palette (Colors), Typography state, and
 * Style state into the final Theme. Each concern stays independent:
 * Typography never touches colors, Style never touches colors or
 * Typography, and Colors never touch Typography or Style. Structural
 * properties Style doesn't expose (shadows, border width, transitions,
 * surface treatment) use fixed sensible defaults. `masterColor`, when
 * provided, records that the active Brand Palette has an explicit Base
 * Color (Palette mode) rather than being fully user-supplied (Custom mode).
 */
export function generateTheme(palette: Palette, typography: TypographyState, style: StyleState, masterColor?: string): Theme {
  const primary = palette.brand.master
  const accent = palette.brand.accentA
  const neutralScale = palette.neutralScale
  const background = neutralScale[FIXED_BACKGROUND_STEP]

  // Input/Textarea/Select's own background — lightened halfway from
  // `background` toward literal white. Even `background` itself (already
  // the lightest generated neutral step) reads as visibly grayish once
  // it's the fill of a small field sitting directly against the truly
  // white Live Preview canvas around it; halving both the remaining
  // lightness gap and the chroma keeps it a genuine (if faint) neutral
  // rather than jumping straight to a hardcoded white. Scoped to fields
  // via their own token — Card and the page background are untouched.
  const backgroundOklch = hexToOklch(background)
  const fieldBackground = oklchToHex({
    l: backgroundOklch.l + (1 - backgroundOklch.l) * 0.5,
    c: backgroundOklch.c * 0.5,
    h: backgroundOklch.h,
  })

  const fontSize = FONT_SIZE_SCALE[typography.size]
  const fontWeight = FONT_WEIGHT_SCALE[typography.weight]

  // Secondary: a lower-emphasis treatment *derived from* Primary/Muted,
  // not an independently-chosen color — see deriveTintedSurface's doc.
  // Reused by the Secondary Button, Badge's Primary variant, and
  // Outline/Ghost's hover fill, so all three read as the same "quietly
  // branded" language instead of each inventing its own tint.
  const secondarySurface = deriveTintedSurface(palette.brand.muted, neutralScale, primary)

  // Alerts *and* Badge's success/warning/danger/accent variants all use
  // the calm Tinted tier now — a light surface with a darker
  // border/text pulled from the same tier, rather than the bolder Strong/
  // Solid fills those badges used previously. Info deliberately shares
  // Accent's hue rather than a fixed blue family (see ThemeColors.info doc).
  const successSurface = deriveTintedSurface(palette.semantic.success, neutralScale)
  const warningSurface = deriveTintedSurface(palette.semantic.warning, neutralScale)
  const dangerSurface = deriveTintedSurface(palette.semantic.danger, neutralScale)
  const infoSurface = deriveTintedSurface(accent, neutralScale)
  const accentSurface = deriveTintedSurface(accent, neutralScale)

  // The Strong tier (bolder than Tinted) isn't consumed by any component
  // right now — Badge's success/warning/danger variants moved to Tinted
  // above — but stays exposed on Theme in case a future treatment wants
  // a bolder small-surface option again.
  const successStrong = deriveStrongSurface(palette.semantic.success, neutralScale)
  const warningStrong = deriveStrongSurface(palette.semantic.warning, neutralScale)
  const dangerStrong = deriveStrongSurface(palette.semantic.danger, neutralScale)

  // Accent Badge is the one Solid surface allowed to adjust — Primary
  // can't (the Base Color must stay exact), so it only gets the improved
  // foreground-direction logic below, never a surface nudge. Kept
  // alongside `accentSurface` above (not currently consumed by any
  // component) since a future bold/solid Accent treatment may still want it.
  const accentSolid = deriveSolidSurface(accent, neutralScale)

  return {
    metadata: {
      masterColor: masterColor?.replace('#', ''),
    },
    colors: {
      primary,
      primaryHover: deriveInteractionShift(primary, HOVER_SHIFT),
      primaryActive: deriveInteractionShift(primary, ACTIVE_SHIFT),
      primaryText: resolveForeground(primary, neutralScale),

      secondary: secondarySurface.background,
      secondaryHover: deriveInteractionShift(secondarySurface.background, HOVER_SHIFT),
      secondaryText: secondarySurface.text,

      background,
      fieldBackground,
      surface: neutralScale[FIXED_SURFACE_STEP],
      text: neutralScale[900],
      textMuted: neutralScale[600],

      border: neutralScale[FIXED_BORDER_STEP],
      borderStrong: pickAccessibleNeutralStep(neutralScale, background),

      disabled: neutralScaleMidpoint(neutralScale, DISABLED_SURFACE_STEP_FROM, DISABLED_SURFACE_STEP_TO, DISABLED_SURFACE_WEIGHT),
      disabledText: neutralScale[DISABLED_TEXT_STEP],

      success: palette.semantic.success,
      successText: successSurface.text,
      successSurface: successSurface.background,
      successStrongText: successStrong.text,
      successStrong: successStrong.background,

      warning: palette.semantic.warning,
      warningText: warningSurface.text,
      warningSurface: warningSurface.background,
      warningStrongText: warningStrong.text,
      warningStrong: warningStrong.background,

      danger: palette.semantic.danger,
      dangerText: dangerSurface.text,
      dangerSurface: dangerSurface.background,
      dangerStrongText: dangerStrong.text,
      dangerStrong: dangerStrong.background,

      // Raw accent, not accentSolid — Alert's info border-color must stay
      // untouched by this pass (see Alert.scss), and deriveTintedSurface
      // only reads accent's hue/chroma anyway, so which one feeds it here
      // makes no visual difference to infoSurface/infoText.
      info: accent,
      infoText: infoSurface.text,
      infoSurface: infoSurface.background,

      accent: accentSolid.background,
      accentText: accentSolid.text,
      accentSurface: accentSurface.background,
      accentSurfaceText: accentSurface.text,

      focusRing: contrastRatio(primary, background) >= 3 ? primary : pickAccessibleNeutralStep(neutralScale, background),
    },
    typography: {
      fontFamily: resolveFontFamily(typography.font),
      fontSizeSm: fontSize.sm,
      fontSizeBase: fontSize.base,
      fontSizeLg: fontSize.lg,
      // Not every curated font ships every requested weight (e.g.
      // Merriweather has no 500/600) — resolve to the nearest weight the
      // selected font actually supports rather than relying on the
      // browser's synthetic bold/thin.
      fontWeightBody: resolveFontWeight(typography.font, fontWeight.body),
      fontWeightControl: resolveFontWeight(typography.font, fontWeight.control),
    },
    radius: RADIUS_SCALE[style.radius],
    spacing: SPACING_SCALE[style.spacing],
    shadows: FIXED_SHADOWS,
    borders: {
      width: FIXED_BORDER_WIDTH,
    },
    transitions: {
      fast: FIXED_TRANSITION_FAST,
    },
  }
}
