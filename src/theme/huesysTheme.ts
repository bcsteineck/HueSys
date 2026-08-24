import { DEFAULT_PRIMARY_COLOR, generatePalette } from './color'
import { themeToCssVariables } from './cssVariables'
import { DEFAULT_FONT_ID } from './fonts'
import { generateTheme } from './generateTheme'
import { getStyle } from './styles'

/**
 * HueSys's own fixed visual identity — completely independent of the
 * generated Theme and never derived from AppState. The application chrome
 * (Theme Controls, Generated Palette, navigation, etc.) always uses this,
 * the same way Figma's or Photoshop's own interface never changes when
 * you edit your document. Built through the exact same Palette Engine +
 * Style pipeline as any generated Theme — just with fixed inputs instead
 * of user state — so there is still only one way a Theme is ever produced.
 */
export const huesysTheme = generateTheme(
  generatePalette(DEFAULT_PRIMARY_COLOR),
  getStyle(0),
  DEFAULT_FONT_ID,
  DEFAULT_PRIMARY_COLOR,
)

export const huesysThemeStyle = themeToCssVariables(huesysTheme)
