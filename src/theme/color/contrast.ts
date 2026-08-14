import { relativeLuminance } from './colorSpace'

/** WCAG AA contrast threshold for normal-weight body text. */
const WCAG_AA_NORMAL_TEXT_CONTRAST = 4.5

export function contrastRatio(colorA: string, colorB: string): number {
  const luminanceA = relativeLuminance(colorA)
  const luminanceB = relativeLuminance(colorB)
  const lighter = Math.max(luminanceA, luminanceB)
  const darker = Math.min(luminanceA, luminanceB)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Picks whichever foreground gives better contrast against the given
 * background, preferring one that clears WCAG AA for normal text. Falls
 * back to the higher-contrast option when neither clears it. Never assumes
 * light text belongs on every background — a light primary color can
 * legitimately need a dark foreground.
 */
export function pickAccessibleForeground(
  background: string,
  lightForeground = '#ffffff',
  darkForeground = '#000000',
): string {
  const lightContrast = contrastRatio(background, lightForeground)
  const darkContrast = contrastRatio(background, darkForeground)

  if (lightContrast >= WCAG_AA_NORMAL_TEXT_CONTRAST && lightContrast >= darkContrast) return lightForeground
  if (darkContrast >= WCAG_AA_NORMAL_TEXT_CONTRAST) return darkForeground

  return lightContrast >= darkContrast ? lightForeground : darkForeground
}
