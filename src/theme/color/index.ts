export { generatePalette } from './generatePalette'
export { DEFAULT_PRIMARY_COLOR, isValidHexColor, normalizeColor } from './normalizeColor'
export { contrastRatio, pickAccessibleForeground } from './contrast'
// Conversion primitives, exposed for Theme assembly: it's allowed to
// nudge individual colors (hue/lightness) using the Color Engine's own
// math, it just never regenerates a scale from scratch.
export { hexToOklch, oklchToHex } from './colorSpace'
export type { BrandPalette, ColorScale, ColorScaleStep, Oklch, Palette, PaletteNeutrals, PaletteSemantic } from './types'
