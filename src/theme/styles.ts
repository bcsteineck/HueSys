import type { StyleRecipe } from './types'

/**
 * The curated Style set, in a fixed order — index N always refers to the
 * same Style. Each is a plain declarative object describing component
 * appearance only; all interpretation happens in generateTheme.ts. None
 * of these fields influence color generation — that's the Palette
 * Engine's job, not Style's.
 */
export const styles: StyleRecipe[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    surfaceContrast: 'low',
    borderStrength: 'subtle',
    radiusStyle: 'soft',
    shadowStyle: 'subtle',
  },
  {
    id: 'soft',
    name: 'Soft',
    surfaceContrast: 'low',
    borderStrength: 'subtle',
    radiusStyle: 'round',
    shadowStyle: 'elevated',
  },
  {
    id: 'sharp',
    name: 'Sharp',
    surfaceContrast: 'low',
    borderStrength: 'medium',
    radiusStyle: 'sharp',
    shadowStyle: 'none',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    surfaceContrast: 'medium',
    borderStrength: 'medium',
    radiusStyle: 'round',
    shadowStyle: 'subtle',
  },
  {
    id: 'elevated',
    name: 'Elevated',
    surfaceContrast: 'medium',
    borderStrength: 'subtle',
    radiusStyle: 'soft',
    shadowStyle: 'elevated',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    surfaceContrast: 'medium',
    borderStrength: 'strong',
    radiusStyle: 'sharp',
    shadowStyle: 'none',
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    surfaceContrast: 'high',
    borderStrength: 'medium',
    radiusStyle: 'soft',
    shadowStyle: 'subtle',
  },
]

/**
 * Clamps an index to a valid Style position. Any out-of-range or invalid
 * index (negative, fractional, NaN, too large) resolves to 0 rather than
 * throwing — the single source of truth both Style lookup and the
 * Previous/Next navigation UI rely on.
 */
export function getStyleIndex(index: number): number {
  return Number.isInteger(index) && index >= 0 && index < styles.length ? index : 0
}

/** Looks up a Style by index, safely falling back to Style #0. */
export function getStyle(index: number): StyleRecipe {
  return styles[getStyleIndex(index)]
}
