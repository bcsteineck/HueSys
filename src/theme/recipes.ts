import type { ThemeRecipe } from './types'

/**
 * The curated MVP recipe set, in a fixed order — index N always refers to
 * the same recipe. Each is a plain declarative object; all interpretation
 * happens in generateTheme.ts.
 */
export const themeRecipes: ThemeRecipe[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    neutralTemperature: 'neutral',
    surfaceContrast: 'low',
    borderStrength: 'subtle',
    radiusStyle: 'soft',
    shadowStyle: 'subtle',
    primaryColorUsage: 'minimal',
  },
  {
    id: 'soft',
    name: 'Soft',
    neutralTemperature: 'warm',
    surfaceContrast: 'low',
    borderStrength: 'subtle',
    radiusStyle: 'round',
    shadowStyle: 'subtle',
    primaryColorUsage: 'balanced',
  },
  {
    id: 'crisp',
    name: 'Crisp',
    neutralTemperature: 'cool',
    surfaceContrast: 'low',
    borderStrength: 'medium',
    radiusStyle: 'sharp',
    shadowStyle: 'none',
    primaryColorUsage: 'balanced',
  },
  {
    id: 'elevated',
    name: 'Elevated',
    neutralTemperature: 'neutral',
    surfaceContrast: 'medium',
    borderStrength: 'subtle',
    radiusStyle: 'soft',
    shadowStyle: 'elevated',
    primaryColorUsage: 'bold',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    neutralTemperature: 'neutral',
    surfaceContrast: 'medium',
    borderStrength: 'strong',
    radiusStyle: 'sharp',
    shadowStyle: 'none',
    primaryColorUsage: 'balanced',
  },
  {
    id: 'warm',
    name: 'Warm',
    neutralTemperature: 'warm',
    surfaceContrast: 'medium',
    borderStrength: 'medium',
    radiusStyle: 'round',
    shadowStyle: 'subtle',
    primaryColorUsage: 'bold',
  },
  {
    id: 'cool',
    name: 'Cool',
    neutralTemperature: 'cool',
    surfaceContrast: 'low',
    borderStrength: 'subtle',
    radiusStyle: 'round',
    shadowStyle: 'elevated',
    primaryColorUsage: 'minimal',
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    neutralTemperature: 'neutral',
    surfaceContrast: 'high',
    borderStrength: 'medium',
    radiusStyle: 'soft',
    shadowStyle: 'subtle',
    primaryColorUsage: 'bold',
  },
]

/**
 * Looks up a recipe by index. Any out-of-range or invalid index (negative,
 * fractional, NaN, too large) falls back to recipe #0 rather than throwing.
 */
export function getThemeRecipe(index: number): ThemeRecipe {
  return themeRecipes[index] ?? themeRecipes[0]
}
