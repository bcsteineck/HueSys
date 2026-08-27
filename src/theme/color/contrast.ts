import { hexToOklch, oklchToHex, relativeLuminance } from './colorSpace'
import type { ColorScale, ColorScaleStep } from './types'
import { COLOR_SCALE_STEPS } from './types'

/**
 * The hard accessibility floor (WCAG AA for normal-weight body text). No
 * semantic foreground/background pair may ever return below this.
 */
export const MIN_TEXT_CONTRAST = 4.5

/**
 * HueSys's own, stricter design target. 4.5 is the line accessibility
 * requires; 5.5 is where HueSys *prefers* to land so pairs read as
 * decisive rather than borderline — but it's a preference, not a
 * requirement: reaching it should never come at the cost of distorting a
 * color's identity or exceeding the existing bounded-adjustment budget.
 * See `derivePreservingIdentity` in semanticSurface.ts for where this
 * actually gets attempted.
 */
export const PREFERRED_TEXT_CONTRAST = 5.5

/** WCAG 1.4.11 threshold for non-text UI elements (borders, focus indicators) — a lower bar than body text, and deliberately not conflated with it. */
const WCAG_NON_TEXT_CONTRAST = 3

/**
 * OKLCH lightness above which a surface reads as "light enough to want dark
 * text" rather than "dark enough to want light text." This is a perceptual
 * threshold, not a contrast-math one — see `resolveForeground` for why the
 * two have to be kept separate.
 */
export const FOREGROUND_DIRECTION_LIGHTNESS_THRESHOLD = 0.65

export function contrastRatio(colorA: string, colorB: string): number {
  const luminanceA = relativeLuminance(colorA)
  const luminanceB = relativeLuminance(colorB)
  const lighter = Math.max(luminanceA, luminanceB)
  const darker = Math.min(luminanceA, luminanceB)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Picks whichever foreground gives better contrast against the given
 * background, preferring one that clears WCAG AA for normal text. Falls
 * back to the higher-contrast option when neither clears it. Never assumes
 * light text belongs on every background — a light primary color can
 * legitimately need a dark foreground.
 */
export function pickAccessibleForeground(
  background: string,
  lightForeground = '#ffffff',
  darkForeground = '#000000',
): string {
  const lightContrast = contrastRatio(background, lightForeground)
  const darkContrast = contrastRatio(background, darkForeground)

  if (lightContrast >= MIN_TEXT_CONTRAST && lightContrast >= darkContrast) return lightForeground
  if (darkContrast >= MIN_TEXT_CONTRAST) return darkForeground

  return lightContrast >= darkContrast ? lightForeground : darkForeground
}

/**
 * The foreground resolver every semantic surface goes through. Prefers the
 * generated Neutral Palette's own light/dark extremes over literal
 * black/white, so a resolved foreground still feels like it belongs to
 * this palette rather than a generic UI default — falling back to
 * `pickAccessibleForeground`'s guaranteed white/black only when neither
 * generated extreme clears WCAG AA against this particular background.
 *
 * Direction is decided by the background's own OKLCH lightness, not by
 * which foreground option has the higher raw contrast ratio. The two look
 * similar most of the time but diverge in exactly the cases that matter:
 * WCAG's contrast formula is asymmetric (dark text's contrast rises almost
 * linearly as a background gets lighter, while light text's contrast falls
 * hyperbolically), so "pick whichever has more contrast" is quietly biased
 * toward dark text on every background except genuinely dark ones — that
 * bias is what produced visually heavy dark-on-medium-saturated pairings
 * even though they passed AA. Perceptual lightness has no such bias: a
 * background that actually reads as light gets dark text, one that reads
 * as medium-to-dark gets light text, and accessibility still has the final
 * word — the preferred direction only wins if it actually clears AA here.
 *
 * This only enforces `MIN_TEXT_CONTRAST`, not `PREFERRED_TEXT_CONTRAST` —
 * there's no surface to adjust here, just a fixed choice between two fixed
 * neutral extremes against a fixed background, so there's nothing to
 * "try harder" for. The 5.5 preference is attempted where a surface can
 * actually move: `derivePreservingIdentity` in semanticSurface.ts.
 */
export function resolveForeground(background: string, neutralScale: ColorScale): string {
  const light = neutralScale[50]
  const dark = neutralScale[950]
  const preferDark = hexToOklch(background).l >= FOREGROUND_DIRECTION_LIGHTNESS_THRESHOLD
  const preferred = preferDark ? dark : light
  const alternative = preferDark ? light : dark

  if (contrastRatio(background, preferred) >= MIN_TEXT_CONTRAST) return preferred
  if (contrastRatio(background, alternative) >= MIN_TEXT_CONTRAST) return alternative

  return pickAccessibleForeground(background)
}

/**
 * The lightest neutral-scale step that still clears the given contrast
 * ratio against `against` — used for functional-boundary borders and focus
 * indicators that should be as quiet as possible while staying reliably
 * perceivable (WCAG 1.4.11), rather than defaulting straight to the
 * darkest neutral available.
 */
export function pickAccessibleNeutralStep(
  neutralScale: ColorScale,
  against: string,
  minContrast = WCAG_NON_TEXT_CONTRAST,
): string {
  for (const step of COLOR_SCALE_STEPS) {
    if (contrastRatio(neutralScale[step], against) >= minContrast) return neutralScale[step]
  }
  return neutralScale[950]
}

/** Interpolates lightness/chroma between two neutral-scale steps (same tint hue throughout, so hue never needs blending). Used for tokens that fall structurally *between* two existing named steps, e.g. a disabled surface that's meant to sit between `surface` and `border`. */
export function neutralScaleMidpoint(neutralScale: ColorScale, from: ColorScaleStep, to: ColorScaleStep, weight = 0.5): string {
  const a = hexToOklch(neutralScale[from])
  const b = hexToOklch(neutralScale[to])
  return oklchToHex({ l: a.l + (b.l - a.l) * weight, c: a.c + (b.c - a.c) * weight, h: a.h })
}
