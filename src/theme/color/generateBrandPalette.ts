import { hexToOklch, oklchToHex } from './colorSpace'
import { normalizeColor } from './normalizeColor'
import type { BrandPalette, Oklch } from './types'

/**
 * Below this chroma, the master's hue is mostly numerical noise (the same
 * problem the neutral scale's tint guards against) — not worth building a
 * hue-relationship palette on. Near-gray masters fall back to a fixed,
 * deterministic anchor hue (nudged by the variation seed) instead of an
 * unstable one.
 */
const MIN_CHROMA_FOR_HUE = 0.02

/** A calm blue-violet — HueSys's own default primary hue — used as the anchor when the master has no reliable hue of its own. */
const FALLBACK_HUE = 264

/** Degrees the fallback anchor hue shifts per seed step, so regenerating a near-gray master still visibly varies. */
const FALLBACK_HUE_SEED_STEP = 47

interface HarmonyRecipe {
  /** Hue offsets in degrees, relative to the anchor hue. accentA is always the quieter, closer-to-anchor accent; accentB is always the bolder, farther one. */
  deepHueOffset: number
  mutedHueOffset: number
  accentAHueOffset: number
  accentBHueOffset: number
}

// Four curated harmony strategies. Only hue placement differs between them
// — that IS the defining difference between analogous, complementary, and
// split-complementary schemes in color theory — lightness/chroma per role
// stay consistent so the choice of recipe never changes how "loud" a
// palette feels, only which hues it explores.
const ANALOGOUS: HarmonyRecipe = {
  deepHueOffset: -8,
  mutedHueOffset: 8,
  accentAHueOffset: 35,
  accentBHueOffset: -35,
}

const COMPLEMENTARY: HarmonyRecipe = {
  deepHueOffset: -6,
  mutedHueOffset: 6,
  accentAHueOffset: 165,
  accentBHueOffset: 195,
}

const SPLIT_COMPLEMENTARY: HarmonyRecipe = {
  deepHueOffset: -6,
  mutedHueOffset: 6,
  accentAHueOffset: 150,
  accentBHueOffset: 210,
}

// Most of the palette stays close to the master's own hue (tonal
// variation); only accentB makes a deliberate, single jump elsewhere. This
// is the recipe used for near-neutral masters, where nothing else would
// have a "true" hue to relate to.
const TONAL_ACCENT: HarmonyRecipe = {
  deepHueOffset: -4,
  mutedHueOffset: 4,
  accentAHueOffset: 8,
  accentBHueOffset: 150,
}

const CHROMATIC_RECIPES = [ANALOGOUS, COMPLEMENTARY, SPLIT_COMPLEMENTARY]

function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360
}

function roleColor(anchor: Oklch, hueOffset: number, lightness: number, chroma: number): string {
  return oklchToHex({ l: lightness, c: chroma, h: normalizeHue(anchor.h + hueOffset) })
}

/**
 * Generates the five brand colors from a single master color: the master
 * itself, a deep companion shade, a muted support tone, and two accent
 * colors in genuinely different hues. Each role has a fixed lightness/
 * chroma treatment; only hue placement varies by recipe — so every
 * palette has real visual hierarchy, not just tints of one hue.
 *
 * `variationSeed` is the only source of variety between repeated calls
 * with the same master color: it never introduces randomness itself
 * (same master + same seed always produce the same palette), it just
 * lets the caller deterministically ask for "a different one" by passing
 * a different seed. Regenerating with no master supplied is handled by
 * the caller picking a new random master color, not by this function.
 */
export function generateBrandPalette(rawMasterColor: string, variationSeed = 0): BrandPalette {
  const master = normalizeColor(rawMasterColor)
  const masterOklch = hexToOklch(master)
  const isNearGray = masterOklch.c < MIN_CHROMA_FOR_HUE

  const anchorHue = isNearGray
    ? normalizeHue(FALLBACK_HUE + variationSeed * FALLBACK_HUE_SEED_STEP)
    : masterOklch.h
  const anchor: Oklch = { ...masterOklch, h: anchorHue }

  const recipe = isNearGray
    ? TONAL_ACCENT
    : CHROMATIC_RECIPES[(Math.floor(masterOklch.h / 120) + variationSeed) % 3]

  const deepLightness = Math.min(0.45, Math.max(0.16, anchor.l - 0.32))
  const deepChroma = Math.min(anchor.c, 0.13)
  const mutedChroma = Math.max(anchor.c * 0.35, 0.02)
  const accentChroma = Math.min(Math.max(anchor.c, 0.13), 0.19)

  return {
    master,
    deep: roleColor(anchor, recipe.deepHueOffset, deepLightness, deepChroma),
    muted: roleColor(anchor, recipe.mutedHueOffset, 0.62, mutedChroma),
    accentA: roleColor(anchor, recipe.accentAHueOffset, 0.68, accentChroma),
    accentB: roleColor(anchor, recipe.accentBHueOffset, 0.56, accentChroma),
  }
}
