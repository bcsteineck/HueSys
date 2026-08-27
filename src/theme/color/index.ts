export { buildPalette, generatePalette } from './generatePalette'
export { generateBrandPalette } from './generateBrandPalette'
export { DEFAULT_PRIMARY_COLOR, isValidHexColor, normalizeColor } from './normalizeColor'
export {
  contrastRatio,
  MIN_TEXT_CONTRAST,
  neutralScaleMidpoint,
  pickAccessibleForeground,
  pickAccessibleNeutralStep,
  PREFERRED_TEXT_CONTRAST,
  resolveForeground,
} from './contrast'
export { deriveInteractionShift, deriveSolidSurface, deriveStrongSurface, deriveTintedSurface } from './semanticSurface'
// Conversion primitives, exposed for Theme assembly: it's allowed to
// nudge individual colors (hue/lightness) using the Color Engine's own
// math, it just never regenerates a scale from scratch.
export { hexToOklch, oklchToHex } from './colorSpace'
export { COLOR_SCALE_STEPS } from './types'
export type { BrandPalette, ColorScale, ColorScaleStep, Oklch, Palette, PaletteNeutrals, PaletteSemantic } from './types'
