import { buildPalette, DEFAULT_PRIMARY_COLOR, generateBrandPalette } from '../theme/color'
import { generateTheme } from '../theme/generateTheme'
import type { StyleState, TypographyState } from '../state/appState'
import type { Theme } from '../theme/types'

/** A real, fully-derived Theme for export tests — goes through the actual Color/Typography/Style pipeline rather than a hand-built fixture, so tests exercise the same object Live Preview would render. */
export function makeTestTheme(overrides?: { typography?: Partial<TypographyState>; style?: Partial<StyleState> }): Theme {
  const brand = generateBrandPalette(DEFAULT_PRIMARY_COLOR, 0)
  const palette = buildPalette(brand)
  const typography: TypographyState = { font: 'inter', size: 'medium', weight: 'medium', ...overrides?.typography }
  const style: StyleState = { radius: 'subtle', spacing: 'medium', ...overrides?.style }
  return generateTheme(palette, typography, style, DEFAULT_PRIMARY_COLOR)
}
