import { hexToOklch, oklchToHex } from './colorSpace'
import { normalizeColor } from './normalizeColor'
import { COLOR_SCALE_STEPS, type ColorScale, type ColorScaleStep } from './types'

/**
 * Target lightness for each scale step, light to dark. Fixed and
 * independent of the input color so every generated scale progresses the
 * same way; only hue and chroma come from the input. Also reused by the
 * neutral scale so both palettes share the same steps.
 */
export const STEP_LIGHTNESS: Record<ColorScaleStep, number> = {
  50: 0.97,
  100: 0.94,
  200: 0.89,
  300: 0.81,
  400: 0.72,
  500: 0.62,
  600: 0.53,
  700: 0.45,
  800: 0.37,
  900: 0.29,
  950: 0.2,
}

/**
 * Chroma multiplier applied to the input color's own chroma at each step.
 * Tapers toward the light/dark ends of the scale, where holding full
 * chroma tends to clip out of the sRGB gamut or read as muddy.
 */
const STEP_CHROMA_FACTOR: Record<ColorScaleStep, number> = {
  50: 0.15,
  100: 0.25,
  200: 0.45,
  300: 0.65,
  400: 0.85,
  500: 1,
  600: 1,
  700: 0.9,
  800: 0.75,
  900: 0.6,
  950: 0.45,
}

function closestStep(lightness: number): ColorScaleStep {
  return COLOR_SCALE_STEPS.reduce((closest, step) =>
    Math.abs(STEP_LIGHTNESS[step] - lightness) < Math.abs(STEP_LIGHTNESS[closest] - lightness) ? step : closest,
  )
}

/**
 * Generates the primary tonal scale. The input's hue is used as-is for
 * every step and is never replaced. The step whose target lightness is
 * closest to the input color is set to the input color exactly, so the
 * supplied primary always remains a visible, exact anchor within its own
 * scale rather than being approximated away.
 */
export function generatePrimaryScale(primaryColor: string): ColorScale {
  const normalized = normalizeColor(primaryColor)
  const { l, c, h } = hexToOklch(normalized)
  const anchorStep = closestStep(l)

  const scale = {} as ColorScale
  for (const step of COLOR_SCALE_STEPS) {
    scale[step] =
      step === anchorStep
        ? normalized
        : oklchToHex({ l: STEP_LIGHTNESS[step], c: c * STEP_CHROMA_FACTOR[step], h })
  }
  return scale
}
