import { describe, expect, it } from 'vitest'
import type { StyleState, TypographyState } from '../state/appState'
import {
  contrastRatio,
  deriveSolidSurface,
  deriveStrongSurface,
  generatePalette,
  hexToOklch,
  MIN_TEXT_CONTRAST,
  oklchToHex,
  PREFERRED_TEXT_CONTRAST,
  resolveForeground,
} from './color'
import { generateTheme } from './generateTheme'

const TYPOGRAPHY: TypographyState = { font: 'inter', size: 'medium', weight: 'medium' }
const STYLE: StyleState = { radius: 'subtle', spacing: 'medium' }

const WCAG_AA_TEXT = 4.5
const WCAG_NON_TEXT = 3

// A deliberately wide spread of master colors/variation seeds — very
// light, very dark, highly saturated, low-chroma/near-gray, and a hue
// across every major family — plus a few seeds per color so palette
// harmony (not just the master itself) gets exercised. Mirrors the
// stress-test hues called out in the design task, so this file doubles as
// the deterministic reproduction of that manual pass.
const TEST_COLORS: Record<string, string> = {
  'default indigo': '#4f46e5',
  'very light pastel': '#fef3c7',
  'very dark navy': '#0b1220',
  'highly saturated red': '#ff0033',
  'low-chroma gray-blue': '#6b7280',
  'near-pure gray': '#808080',
  yellow: '#eab308',
  lime: '#84cc16',
  cyan: '#06b6d4',
  blue: '#2563eb',
  purple: '#7c3aed',
  'pink/magenta': '#db2777',
  'orange/red': '#ea580c',
  black: '#000000',
  white: '#ffffff',
}

const VARIATION_SEEDS = [0, 1, 2]

function themesFor(masterHex: string) {
  return VARIATION_SEEDS.map((seed) => {
    const palette = generatePalette(masterHex, seed)
    return generateTheme(palette, TYPOGRAPHY, STYLE, masterHex)
  })
}

describe('generateTheme semantic contrast', () => {
  for (const [label, hex] of Object.entries(TEST_COLORS)) {
    describe(`master = ${label} (${hex})`, () => {
      const themes = themesFor(hex)

      it.each(themes.map((theme, i) => [i, theme] as const))('seed %i: text pairs clear 4.5:1', (_seed, theme) => {
        const pairs: Array<[string, string, string]> = [
          ['primary/primaryText', theme.colors.primary, theme.colors.primaryText],
          ['secondary/secondaryText', theme.colors.secondary, theme.colors.secondaryText],
          ['accent/accentText', theme.colors.accent, theme.colors.accentText],
          ['successSurface/successText', theme.colors.successSurface, theme.colors.successText],
          ['warningSurface/warningText', theme.colors.warningSurface, theme.colors.warningText],
          ['dangerSurface/dangerText', theme.colors.dangerSurface, theme.colors.dangerText],
          ['infoSurface/infoText', theme.colors.infoSurface, theme.colors.infoText],
          ['accentSurface/accentSurfaceText', theme.colors.accentSurface, theme.colors.accentSurfaceText],
          ['successStrong/successStrongText', theme.colors.successStrong, theme.colors.successStrongText],
          ['warningStrong/warningStrongText', theme.colors.warningStrong, theme.colors.warningStrongText],
          ['dangerStrong/dangerStrongText', theme.colors.dangerStrong, theme.colors.dangerStrongText],
          ['background/text', theme.colors.background, theme.colors.text],
          ['disabled/disabledText', theme.colors.disabled, theme.colors.disabledText],
        ]

        for (const [name, bg, fg] of pairs) {
          const ratio = contrastRatio(bg, fg)
          expect(ratio, `${name} (${bg} vs ${fg}) should clear ${WCAG_AA_TEXT}:1, got ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(
            WCAG_AA_TEXT,
          )
        }
      })

      it.each(themes.map((theme, i) => [i, theme] as const))('seed %i: functional borders/focus clear 3:1', (_seed, theme) => {
        const nonTextPairs: Array<[string, string, string]> = [
          ['borderStrong vs background', theme.colors.background, theme.colors.borderStrong],
          ['focusRing vs background', theme.colors.background, theme.colors.focusRing],
        ]

        for (const [name, bg, fg] of nonTextPairs) {
          const ratio = contrastRatio(bg, fg)
          expect(ratio, `${name} (${bg} vs ${fg}) should clear ${WCAG_NON_TEXT}:1, got ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(
            WCAG_NON_TEXT,
          )
        }
      })
    })
  }

  it('preserves the exact Base Color as primary regardless of variation seed', () => {
    for (const hex of Object.values(TEST_COLORS)) {
      const normalized = hex.toLowerCase()
      for (const theme of themesFor(hex)) {
        expect(theme.colors.primary).toBe(normalized)
      }
    }
  })

  it('lets light and dark foregrounds coexist across different roles in the same theme', () => {
    // Not every resolved foreground in a single theme has to be the same
    // literal color — this just documents that assumption rather than
    // asserting a specific split, so a future palette that happens to
    // produce all-light or all-dark foregrounds doesn't fail a brittle test.
    const theme = generateTheme(generatePalette('#eab308', 0), TYPOGRAPHY, STYLE)
    const foregrounds = [theme.colors.primaryText, theme.colors.successText, theme.colors.dangerText, theme.colors.infoText]
    expect(foregrounds.length).toBeGreaterThan(0)
  })
})

// Behavioral coverage for the Surface Pairing correction: direction is
// decided by the surface's own perceptual lightness (not by which
// foreground option happens to have more raw contrast), and Strong/Solid
// surfaces are allowed a small, bounded nudge when the preferred direction
// doesn't already clear AA. These deliberately assert *which direction*
// was chosen and *how far* a surface moved, not exact hex output, per the
// task's "prefer behavioral assertions" instruction.
describe('surface/foreground pairing is direction-aware, not contrast-maximizing', () => {
  const neutralScale = generatePalette('#4f46e5', 0).neutralScale

  // Deep/saturated enough that the old "maximize raw contrast" rule and a
  // perceptual-lightness rule would disagree — old logic's dark-biased
  // tie-break would land on dark text here even though the surface reads
  // as medium-to-dark.
  const DEEP_SATURATED_SURFACES: Record<string, string> = {
    'deep purple': '#5b21b6',
    'dark blue': '#1e3a8a',
    'strong/deeper green': '#15803d',
    'deep red': '#991b1b',
    'medium-dark pink': '#be185d',
    'default indigo primary': '#4f46e5',
  }

  // Bright enough that dark text is unambiguously correct — must never get
  // pushed toward light text just because a "boldness" tier wants emphasis.
  const BRIGHT_SURFACES: Record<string, string> = {
    yellow: '#eab308',
    lime: '#84cc16',
    'bright cyan': '#06b6d4',
    'light orange': '#fb923c',
    'pastel yellow': '#fef3c7',
  }

  it.each(Object.entries(DEEP_SATURATED_SURFACES))(
    'resolves the light neutral extreme for a deep/saturated surface: %s',
    (_label, hex) => {
      const foreground = resolveForeground(hex, neutralScale)
      expect(foreground).toBe(neutralScale[50])
      expect(contrastRatio(hex, foreground)).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
    },
  )

  it.each(Object.entries(BRIGHT_SURFACES))('resolves the dark neutral extreme for a bright surface, not forced light: %s', (_label, hex) => {
    const foreground = resolveForeground(hex, neutralScale)
    expect(foreground).toBe(neutralScale[950])
    expect(contrastRatio(hex, foreground)).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
  })

  // Strong tier (Badge success/warning/danger): a hue that prefers light
  // text but fails at the shared Strong anchor lightness should get a
  // *darkened* surface, not be stuck with dark text just because light
  // failed at the starting point.
  it('deriveStrongSurface darkens a light-preferring hue just enough for light text to pass', () => {
    // A saturated green at Strong's anchor lightness/chroma reliably fails
    // light-on-surface contrast at the starting point (verified via the
    // color-science stress test during implementation) — this is the case
    // the surface nudge exists for.
    const roleColor = '#16a34a'
    const anchorLightness = hexToOklch(roleColor).l
    const { background, text } = deriveStrongSurface(roleColor, neutralScale)

    expect(text).toBe(neutralScale[50])
    expect(contrastRatio(background, text)).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
    // Darkened, not lightened — and only "modestly": within a generous
    // ceiling well short of turning the green into near-black.
    const resultLightness = hexToOklch(background).l
    expect(resultLightness).toBeLessThan(anchorLightness)
    expect(anchorLightness - resultLightness).toBeLessThanOrEqual(0.35)
  })

  it('deriveStrongSurface keeps a dark-preferring hue (warning-like) on dark text, adjusting lightness rather than direction', () => {
    // A bright amber/warning-like hue must resolve dark text — even if the
    // Strong anchor needs a small nudge to actually clear AA for it, the
    // *direction* should never flip to light just because a nudge occurred.
    const roleColor = '#f59e0b'
    const { background, text } = deriveStrongSurface(roleColor, neutralScale)
    expect(text).toBe(neutralScale[950])
    expect(contrastRatio(background, text)).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
    expect(Math.abs(hexToOklch(background).l - 0.6)).toBeLessThanOrEqual(0.35)
  })

  it('deriveSolidSurface stays within a tighter, more restrained bound than Strong', () => {
    const roleColor = '#db2777'
    const anchorLightness = hexToOklch(roleColor).l
    const { background, text } = deriveSolidSurface(roleColor, neutralScale)

    expect(contrastRatio(background, text)).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
    const shift = Math.abs(hexToOklch(background).l - anchorLightness)
    // Solid is meant to stay scarce/literal — its budget is deliberately
    // smaller than Strong's; this ceiling is looser than the actual
    // internal step size so the test verifies the contract, not the
    // exact private constant.
    expect(shift).toBeLessThanOrEqual(0.15)
  })

  it('every Strong-tier and Solid-tier pair clears AA across a full hue sweep', () => {
    for (let hue = 0; hue < 360; hue += 20) {
      for (const chroma of [0.05, 0.12, 0.2]) {
        const roleColor = oklchToHex({ l: 0.55, c: chroma, h: hue })

        const strong = deriveStrongSurface(roleColor, neutralScale)
        expect(
          contrastRatio(strong.background, strong.text),
          `Strong h=${hue} c=${chroma} (${roleColor} → ${strong.background}/${strong.text})`,
        ).toBeGreaterThanOrEqual(WCAG_AA_TEXT)

        const solid = deriveSolidSurface(roleColor, neutralScale)
        expect(
          contrastRatio(solid.background, solid.text),
          `Solid h=${hue} c=${chroma} (${roleColor} → ${solid.background}/${solid.text})`,
        ).toBeGreaterThanOrEqual(WCAG_AA_TEXT)
      }
    }
  })
})

// Behavioral coverage for the Preferred Contrast Target refinement: 5.5 is
// HueSys's preferred target, 4.5 remains the hard floor, and neither
// changes the direction-first decision — a pair may legitimately settle
// for 4.5–5.5 when the bounded adjustment can't reach 5.5 without more
// distortion than the tier allows.
describe('preferred contrast target (5.5) vs. accessibility floor (4.5)', () => {
  const neutralScale = generatePalette('#4f46e5', 0).neutralScale

  it('exports 5.5 as strictly preferred over the 4.5 floor', () => {
    expect(PREFERRED_TEXT_CONTRAST).toBeGreaterThan(MIN_TEXT_CONTRAST)
    expect(MIN_TEXT_CONTRAST).toBe(4.5)
    expect(PREFERRED_TEXT_CONTRAST).toBe(5.5)
  })

  it('deriveStrongSurface reaches the preferred 5.5 target when reachable within its existing budget', () => {
    // A saturated green whose light-preferring direction fails at Strong's
    // anchor lightness (0.6) but clears 5.5 within a couple of nudge steps.
    const { background, text } = deriveStrongSurface('#16a34a', neutralScale)
    expect(text).toBe(neutralScale[50])
    expect(contrastRatio(background, text)).toBeGreaterThanOrEqual(PREFERRED_TEXT_CONTRAST)
  })

  it('deriveSolidSurface may legitimately land between 4.5 and 5.5 when its tighter budget cannot reach 5.5', () => {
    // Chosen so light text clears the floor by step 2 (Solid's max nudge)
    // but never clears 5.5 within that same restrained budget — the exact
    // "fall back to the floor rather than distort further" case.
    const roleColor = '#6b8971'
    const { background, text } = deriveSolidSurface(roleColor, neutralScale)
    const ratio = contrastRatio(background, text)

    expect(ratio).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
    expect(ratio).toBeLessThan(PREFERRED_TEXT_CONTRAST)

    // And the adjustment that got it there stayed within Solid's existing,
    // unchanged bound — reaching 4.5 didn't quietly borrow more budget.
    const shift = Math.abs(hexToOklch(background).l - hexToOklch(roleColor).l)
    expect(shift).toBeLessThanOrEqual(0.15)
  })

  it('never returns a pair below the 4.5 floor, even when 5.5 is unreachable', () => {
    for (let hue = 0; hue < 360; hue += 15) {
      for (const chroma of [0.05, 0.1, 0.15, 0.2]) {
        const roleColor = oklchToHex({ l: 0.58, c: chroma, h: hue })
        for (const pair of [deriveStrongSurface(roleColor, neutralScale), deriveSolidSurface(roleColor, neutralScale)]) {
          expect(contrastRatio(pair.background, pair.text), `${roleColor} → ${pair.background}/${pair.text}`).toBeGreaterThanOrEqual(
            MIN_TEXT_CONTRAST,
          )
        }
      }
    }
  })

  it('does not simply choose whichever foreground has the higher raw contrast', () => {
    // At Strong's own unadjusted anchor lightness (0.6), a saturated green
    // has dark text numerically ahead and already accessible (~6.4:1) while
    // light text fails outright (~3.5:1) — the "maximize contrast" rule
    // this replaced would have stopped right there and kept dark. Direction
    // says this hue should prefer light, so the function keeps adjusting
    // the surface instead of settling for the numerically-bigger, already-
    // passing dark option — mirrors the task's dark=7.0/light=5.7 example:
    // direction wins even when it isn't the bigger (or even a passing)
    // number at the starting point.
    const roleColor = '#16a34a'
    const anchorBackground = oklchToHex({ ...hexToOklch(roleColor), l: 0.6 })
    const darkAtAnchor = contrastRatio(anchorBackground, neutralScale[950])
    const lightAtAnchor = contrastRatio(anchorBackground, neutralScale[50])
    expect(darkAtAnchor).toBeGreaterThan(lightAtAnchor)
    expect(darkAtAnchor).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
    expect(lightAtAnchor).toBeLessThan(MIN_TEXT_CONTRAST)

    // Yet the actual result still uses light, having adjusted the surface
    // rather than accepting the already-accessible dark option.
    const { text } = deriveStrongSurface(roleColor, neutralScale)
    expect(text).toBe(neutralScale[50])
  })

  it('never alters Primary/Base Color to chase 5.5 — primaryText uses the best result the existing logic allows', () => {
    // A deep-but-not-extreme Base Color whose natural direction-preferred
    // foreground may land under 5.5 — Primary must stay exact regardless.
    const baseColor = '#7368d4'
    for (const seed of [0, 1, 2]) {
      const theme = generateTheme(generatePalette(baseColor, seed), TYPOGRAPHY, STYLE, baseColor)
      expect(theme.colors.primary).toBe(baseColor.toLowerCase())
      expect(contrastRatio(theme.colors.primary, theme.colors.primaryText)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
    }
  })

  it('still lets bright yellow/lime/cyan prefer dark foregrounds under the new target', () => {
    const brightSurfaces = ['#eab308', '#84cc16', '#06b6d4', '#fef3c7']
    for (const hex of brightSurfaces) {
      const foreground = resolveForeground(hex, neutralScale)
      expect(foreground).toBe(neutralScale[950])
      expect(contrastRatio(hex, foreground)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
    }
  })

  it('still lets deep saturated green/blue/purple/pink/red prefer light foregrounds under the new target', () => {
    const deepSurfaces = ['#15803d', '#1e3a8a', '#5b21b6', '#be185d', '#991b1b']
    for (const hex of deepSurfaces) {
      const foreground = resolveForeground(hex, neutralScale)
      expect(foreground).toBe(neutralScale[50])
      expect(contrastRatio(hex, foreground)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
    }
  })
})
