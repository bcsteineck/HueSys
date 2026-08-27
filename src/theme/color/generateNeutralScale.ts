import { hexToOklch, oklchToHex } from './colorSpace'
import { STEP_LIGHTNESS } from './generateScale'
import { normalizeColor } from './normalizeColor'
import { COLOR_SCALE_STEPS, type ColorScale } from './types'

/**
 * Chroma applied across the whole neutral scale. Fixed and small — not
 * derived from the primary's own chroma — so a highly saturated primary
 * doesn't produce a visibly colored "neutral" scale.
 *
 * Deliberately tiny: OKLCH's displayable chroma range shrinks sharply near
 * white/black, so a fixed chroma is not equally subtle at every step. The
 * palest steps (50/100) are exactly where `background`/`surface`/`disabled`
 * live, and are also where the least chroma "headroom" exists before a
 * neutral reads as a describable color (green-gray, purple-gray, etc.)
 * rather than an neutral with a whisper of personality. Calibrated small
 * enough that even a highly saturated primary keeps structural surfaces
 * genuinely neutral.
 */
const NEUTRAL_TINT_CHROMA = 0.004

/**
 * Below this input chroma, the primary is close enough to gray that its
 * hue angle is mostly numerical noise and not worth inheriting. The
 * neutral scale falls back to a true, untinted gray in that case.
 */
const MIN_CHROMA_FOR_TINT = 0.01

/**
 * Generates a neutral scale tinted with a subtle hint of the primary
 * color's hue, using the same lightness steps as the primary scale so
 * both palettes read as one system.
 */
export function generateNeutralScale(primaryColor: string): ColorScale {
  const { c, h } = hexToOklch(normalizeColor(primaryColor))
  const tintChroma = c < MIN_CHROMA_FOR_TINT ? 0 : NEUTRAL_TINT_CHROMA

  const scale = {} as ColorScale
  for (const step of COLOR_SCALE_STEPS) {
    scale[step] = oklchToHex({ l: STEP_LIGHTNESS[step], c: tintChroma, h })
  }
  return scale
}
