import { defaultAppState } from '../state/appState'
import { buildPalette } from './color'
import { themeToCssVariables } from './cssVariables'
import { generateTheme } from './generateTheme'

/**
 * HueSys's own fixed visual identity — completely independent of the
 * generated Theme and never derived from AppState. The application chrome
 * (Theme Controls, Generated Palette, navigation, etc.) always uses this,
 * the same way Figma's or Photoshop's own interface never changes when
 * you edit your document. Built through the exact same Color Foundation +
 * Theme pipeline as any generated Theme — just with fixed inputs instead
 * of user state — so there is still only one way a Theme is ever produced.
 */
export const huesysTheme = generateTheme(
  buildPalette(defaultAppState.color.palette.colors),
  defaultAppState.typography,
  defaultAppState.style,
  defaultAppState.color.palette.baseColor,
)

export const huesysThemeStyle = themeToCssVariables(huesysTheme)
