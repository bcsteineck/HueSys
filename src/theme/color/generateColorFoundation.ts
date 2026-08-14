import { hexToOklch, oklchToHex } from './colorSpace'
import { pickAccessibleForeground } from './contrast'
import { generateNeutralScale } from './generateNeutralScale'
import { generatePrimaryScale } from './generateScale'
import { normalizeColor } from './normalizeColor'
import type { ColorFoundation, Oklch } from './types'

/** Fixed lightness shift used to derive interactive states from the primary color. */
const HOVER_LIGHTNESS_SHIFT = 0.08
const ACTIVE_LIGHTNESS_SHIFT = 0.14

/**
 * Darkens light primaries and lightens dark primaries by a fixed amount, so
 * hover/active states stay visibly different regardless of how light or
 * dark the supplied primary color is.
 */
function shiftLightness(color: Oklch, amount: number): Oklch {
  const direction = color.l > 0.5 ? -1 : 1
  const l = Math.min(1, Math.max(0, color.l + direction * amount))
  return { ...color, l }
}

// Fixed, primary-independent status hues (green/amber/red in OKLCH). These
// are universal semantic foundations, not a recipe's aesthetic choice — how
// a recipe applies them (solid, tinted, bordered) is a Phase 2B decision.
const SUCCESS_OKLCH: Oklch = { l: 0.6, c: 0.15, h: 145 }
const WARNING_OKLCH: Oklch = { l: 0.75, c: 0.16, h: 70 }
const DANGER_OKLCH: Oklch = { l: 0.58, c: 0.19, h: 25 }

/**
 * Converts a single primary color into the full color foundation: a tonal
 * primary scale, a tinted neutral scale, and semantic color candidates for
 * the Theme Recipe Engine (Phase 2B) to map into a Theme.
 */
export function generateColorFoundation(rawPrimaryColor: string): ColorFoundation {
  const primaryColor = normalizeColor(rawPrimaryColor)
  const primaryOklch = hexToOklch(primaryColor)

  const primaryScale = generatePrimaryScale(primaryColor)
  const neutralScale = generateNeutralScale(primaryColor)

  return {
    primaryColor,
    primaryScale,
    neutralScale,
    semantic: {
      primary: primaryColor,
      primaryHover: oklchToHex(shiftLightness(primaryOklch, HOVER_LIGHTNESS_SHIFT)),
      primaryActive: oklchToHex(shiftLightness(primaryOklch, ACTIVE_LIGHTNESS_SHIFT)),
      primaryText: pickAccessibleForeground(primaryColor),

      background: neutralScale[50],
      surface: neutralScale[100],

      text: neutralScale[900],
      textMuted: neutralScale[600],
      border: neutralScale[200],

      success: oklchToHex(SUCCESS_OKLCH),
      warning: oklchToHex(WARNING_OKLCH),
      danger: oklchToHex(DANGER_OKLCH),
    },
  }
}
