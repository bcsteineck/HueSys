import { getFont } from '../theme/fonts'
import type { Theme } from '../theme/types'

// These two curated fonts are system-native — no external request is ever
// needed for them (see theme/fonts.ts).
const SYSTEM_FONT_IDS = new Set(['system', 'georgia'])

export function isHostedFont(fontId: string): boolean {
  return !SYSTEM_FONT_IDS.has(fontId)
}

/** The distinct font weights the current Theme actually renders with — never every weight the font ships. */
export function getRequiredWeights(theme: Theme): number[] {
  return Array.from(new Set([theme.typography.fontWeightBody, theme.typography.fontWeightControl])).sort((a, b) => a - b)
}

// Matches the naming convention already used by index.html's own curated
// Google Fonts request: spaces become "+" in the family param.
function googleFontsHref(label: string, weights: number[]): string {
  const family = `family=${label.replace(/ /g, '+')}:wght@${weights.join(';')}`
  return `https://fonts.googleapis.com/css2?${family}&display=swap`
}

/** The exact `<link>` tags to drop into an exported project's index.html, or null when the selected font needs no external request. */
export function getGoogleFontsLinkTags(fontId: string, theme: Theme): string[] | null {
  if (!isHostedFont(fontId)) return null
  const font = getFont(fontId)
  const href = googleFontsHref(font.label, getRequiredWeights(theme))
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com" />',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
    `<link href="${href}" rel="stylesheet" />`,
  ]
}

/** README-ready markdown explaining the selected font and, for hosted fonts, the exact snippet to add. */
export function getFontReadmeSection(fontId: string, theme: Theme): string {
  const font = getFont(fontId)
  const weights = getRequiredWeights(theme)

  if (!isHostedFont(fontId)) {
    return `This theme uses **${font.label}** (\`${font.family}\`) — a system font stack, so no external font request is needed.`
  }

  const href = googleFontsHref(font.label, weights)
  return [
    `This theme uses **${font.label}** at weight${weights.length > 1 ? 's' : ''} ${weights.join(', ')}.`,
    '',
    'Add this to your `<head>` (or your framework\'s equivalent) before the app renders:',
    '',
    '```html',
    '<link rel="preconnect" href="https://fonts.googleapis.com" />',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
    `<link href="${href}" rel="stylesheet" />`,
    '```',
  ].join('\n')
}
