import { hexToOklch, oklchToHex } from './colorSpace'
import { generateBrandPalette } from './generateBrandPalette'
import { generateNeutralScale } from './generateNeutralScale'
import type { BrandPalette, Oklch, Palette } from './types'

// Canonical status hues (green/amber/red in OKLCH) — universal starting
// points so success/warning/danger stay recognizable. They're never used
// as-is, though: derivePersonalityColor below blends each one toward the
// palette's own hue and vividness, so status colors feel warmer, cooler,
// or softer depending on what this specific palette feels like.
const SUCCESS_OKLCH: Oklch = { l: 0.6, c: 0.15, h: 145 }
const WARNING_OKLCH: Oklch = { l: 0.75, c: 0.16, h: 70 }
const DANGER_OKLCH: Oklch = { l: 0.58, c: 0.19, h: 25 }

/** How much of the palette's own hue leaks into each semantic color. Small and fixed, so success/warning/danger stay recognizable — this is a tint of personality, not a hue replacement. */
const PERSONALITY_HUE_BLEND = 0.18
/** How much of the palette's own vividness leaks into each semantic color's chroma — a muted palette should produce visibly softer status colors. */
const PERSONALITY_CHROMA_BLEND = 0.3

function lerpHue(from: number, to: number, amount: number): number {
  const delta = ((((to - from) % 360) + 540) % 360) - 180
  return (((from + delta * amount) % 360) + 360) % 360
}

/**
 * Blends a canonical status color toward the palette's own personality:
 * hue nudges slightly toward the master's hue, and chroma leans toward the
 * master's own vividness. Lightness stays fixed, so accessibility contrast
 * — already tuned per status role — never regresses.
 */
function derivePersonalityColor(canonical: Oklch, masterOklch: Oklch): string {
  const h = lerpHue(canonical.h, masterOklch.h, PERSONALITY_HUE_BLEND)
  const personalityChroma = Math.min(Math.max(masterOklch.c, 0.02), 0.22)
  const c = canonical.c * (1 - PERSONALITY_CHROMA_BLEND) + personalityChroma * PERSONALITY_CHROMA_BLEND
  return oklchToHex({ l: canonical.l, c, h })
}

/**
 * Fixed neutral-scale steps behind the canonical, Style-independent
 * Neutral Palette display. A Theme built from this same Palette is free
 * to pick *different* steps for its own background/surface/border
 * (that's what Style's surfaceContrast/borderStrength do) — but what's
 * shown here never changes because of that.
 */
const NEUTRAL_DISPLAY_STEPS = {
  background: 50,
  surface: 100,
  border: 200,
  textMuted: 600,
  text: 900,
} as const

/**
 * The Color Foundation step: derives the full Palette — neutral scale,
 * fixed neutral display roles, and semantic colors — from an
 * already-known Brand Palette. `brand.master` anchors neutral tinting and
 * semantic personality, the same role it plays whether the Brand Palette
 * came from Palette-mode generation or from a user's Custom colors. This
 * function doesn't care which — it never generates brand colors itself.
 */
export function buildPalette(brand: BrandPalette): Palette {
  const masterOklch = hexToOklch(brand.master)
  const neutralScale = generateNeutralScale(brand.master)

  return {
    brand,
    neutralScale,
    neutrals: {
      background: neutralScale[NEUTRAL_DISPLAY_STEPS.background],
      surface: neutralScale[NEUTRAL_DISPLAY_STEPS.surface],
      border: neutralScale[NEUTRAL_DISPLAY_STEPS.border],
      textMuted: neutralScale[NEUTRAL_DISPLAY_STEPS.textMuted],
      text: neutralScale[NEUTRAL_DISPLAY_STEPS.text],
    },
    semantic: {
      success: derivePersonalityColor(SUCCESS_OKLCH, masterOklch),
      warning: derivePersonalityColor(WARNING_OKLCH, masterOklch),
      danger: derivePersonalityColor(DANGER_OKLCH, masterOklch),
    },
  }
}

/**
 * Convenience entry point for Palette mode: generates the five brand
 * colors from a master color (plus an optional variation seed), then runs
 * them through the Color Foundation. Custom mode skips straight to
 * buildPalette with its own user-supplied Brand Palette instead.
 */
export function generatePalette(rawMasterColor: string, variationSeed = 0): Palette {
  return buildPalette(generateBrandPalette(rawMasterColor, variationSeed))
}
