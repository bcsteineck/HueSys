import { hexToOklch, oklchToHex } from './colorSpace'
import { contrastRatio, FOREGROUND_DIRECTION_LIGHTNESS_THRESHOLD, MIN_TEXT_CONTRAST, PREFERRED_TEXT_CONTRAST, resolveForeground } from './contrast'
import type { ColorScale, Oklch } from './types'

/**
 * The internal surface-strength model (never user-facing, four
 * conceptual tiers):
 *
 * - Quiet: plain neutral tokens (surface/background/disabled) — no
 *   generator needed here, see cssVariables/generateTheme for those.
 * - Tinted (`deriveTintedSurface`): a calm, clearly-hued surface for
 *   medium-emphasis content that covers real visual area — Alerts,
 *   Secondary Button, Badge's Primary variant. Lighter than Strong so it
 *   never competes with Primary, but more saturated than a translucent
 *   8–15% tint so the hue still reads as intentional, not washed out.
 * - Strong (`deriveStrongSurface`): a bold, mid-lightness fill reserved
 *   for small surfaces that can absorb more chroma — currently only
 *   Badge's success/warning/danger variants.
 * - Solid (`deriveSolidSurface`): the raw palette color, only nudged when
 *   the foreground pairing genuinely needs it — Accent Badge. Primary
 *   itself is Solid too but is *never* nudged (see generateTheme.ts):
 *   the Base Color has to stay exact, so Primary only gets the improved
 *   foreground-direction logic, never a surface adjustment.
 *
 * Strong and Solid both resolve their foreground through the same
 * direction-first idea `resolveForeground` uses: decide light-vs-dark from
 * the surface's own perceptual lightness, then only adjust the surface
 * (darkening it slightly to let light text pass, or the reverse) if the
 * preferred direction doesn't already clear the accessibility floor at the
 * starting point. This replaces picking whichever foreground happens to
 * have more raw contrast, which is what produced technically-accessible
 * but visually heavy dark-on-medium-saturated pairings.
 *
 * Within that adjustment, Strong and Solid *prefer* to land at
 * `PREFERRED_TEXT_CONTRAST` (5.5) rather than merely `MIN_TEXT_CONTRAST`
 * (4.5) — HueSys's own stricter target for decisive-reading pairs, not an
 * accessibility requirement. The bounded nudge budget is unchanged either
 * way; reaching 5.5 never costs more distortion than reaching 4.5 used to,
 * it's just preferred when reachable within the same budget. Tinted is
 * deliberately excluded from this — see `deriveTintedSurface`.
 *
 * Both generators anchor to a *fixed OKLCH lightness* rather than a fixed
 * percentage-mix-with-white/black — mixing percentages happens to work
 * for some hues and produces mud or blown-out pastel for others. Anchoring
 * to lightness means a pale yellow and a deep purple both land in the same
 * perceptual "how prominent does this read" zone, even though their
 * starting lightness/chroma are nothing alike.
 */
const STRONG_TARGET_LIGHTNESS = 0.6
const STRONG_CHROMA_FLOOR = 0.1
const STRONG_CHROMA_CEILING = 0.17

/**
 * Solid's nudge budget is deliberately tighter than Strong's — Solid is
 * meant to stay scarce and literal, so if the preferred foreground can't be
 * reached within a small, restrained shift, `derivePreservingIdentity`
 * falls back to whichever direction is accessible at the original color
 * rather than distorting it further to chase the preference.
 */
const SOLID_LIGHTNESS_NUDGE_STEP = 0.05
const SOLID_MAX_LIGHTNESS_NUDGES = 2

/**
 * Tinted sits well above Strong in lightness (calm, not a slab of color)
 * but below the old Subtle secondary tint's near-white 0.93 — Alerts in
 * particular need the hue to read as obviously present, not a hint of it.
 * The higher chroma ceiling (vs. the previous Subtle tier's 0.045) is what
 * makes that possible without darkening the surface itself.
 */
const TINTED_TARGET_LIGHTNESS = 0.9
const TINTED_CHROMA_SCALE = 0.75
const TINTED_CHROMA_FLOOR = 0.025
const TINTED_CHROMA_CEILING = 0.075

/**
 * The dark, hue-preserving text/border color a Tinted surface falls back
 * to when no `preferredText` is given (Badge's Success/Warning/Danger/
 * Accent variants) — a genuine darker version of the *same* color, reusing
 * Strong's chroma bounds so it reads as comparably bold, rather than a
 * generic dark neutral that would leave the badge's border/text looking
 * unrelated to its own semantic hue. 0.45, not the initially-tried 0.32 —
 * still comfortably dark enough to read as "a shade of this color," but
 * ~40% lighter so it doesn't look nearly black. The bounded nudge below
 * still darkens further per-hue if 0.45 doesn't clear the contrast target.
 */
const SHADE_TARGET_LIGHTNESS = 0.45
const SHADE_NUDGE_STEP = 0.06
const SHADE_MAX_NUDGES = 4

/** How far (and in which two directions) to nudge lightness when the starting target can't resolve an accessible foreground — see `derivePreservingIdentity` below. */
const LIGHTNESS_NUDGE_STEP = 0.07
const MAX_LIGHTNESS_NUDGES = 4

function clampLightness(l: number): number {
  return Math.min(0.97, Math.max(0.06, l))
}

/**
 * Section 15's rule in code, made direction-aware and two-tier: decide the
 * visually preferred foreground from `directionLightness` (same threshold
 * `resolveForeground` uses), then search the bounded nudge budget — same
 * direction as before (darker to help light text, lighter to help dark
 * text) — for a step that reaches HueSys's *preferred* target,
 * `PREFERRED_TEXT_CONTRAST` (5.5), stopping at the very first one found so
 * the least possible distortion is used. If no step within budget reaches
 * 5.5, fall back to the least-distorted step that at least clears the
 * accessibility floor, `MIN_TEXT_CONTRAST` (4.5). Only if nothing in the
 * budget clears even the floor does this give up on the preference
 * entirely and fall back to `resolveForeground` at the original, unaltered
 * lightness — "adjust within reason," not "distort until safe at any
 * cost," and "prefer decisive," not "require decisive."
 *
 * `directionLightness` is separate from `targetLightness` because Strong
 * anchors every hue to the *same* construction lightness for consistent
 * boldness (see `deriveStrongSurface`) — the direction has to come from
 * the role color's own natural lightness instead, or every Strong surface
 * would make the same choice regardless of hue.
 */
function derivePreservingIdentity(
  targetLightness: number,
  chroma: number,
  hue: number,
  neutralScale: ColorScale,
  nudgeStep: number = LIGHTNESS_NUDGE_STEP,
  maxNudges: number = MAX_LIGHTNESS_NUDGES,
  directionLightness: number = targetLightness,
): { background: string; text: string } {
  const preferDark = directionLightness >= FOREGROUND_DIRECTION_LIGHTNESS_THRESHOLD
  const direction = preferDark ? 1 : -1
  const preferredText = preferDark ? neutralScale[950] : neutralScale[50]

  let bestWithinFloor: { background: string; text: string } | undefined

  for (let step = 0; step <= maxNudges; step++) {
    const l = clampLightness(targetLightness + direction * step * nudgeStep)
    const background = oklchToHex({ l, c: chroma, h: hue })
    const ratio = contrastRatio(background, preferredText)

    if (ratio >= PREFERRED_TEXT_CONTRAST) {
      return { background, text: preferredText }
    }
    if (!bestWithinFloor && ratio >= MIN_TEXT_CONTRAST) {
      bestWithinFloor = { background, text: preferredText }
    }
  }

  if (bestWithinFloor) return bestWithinFloor

  const background = oklchToHex({ l: targetLightness, c: chroma, h: hue })
  return { background, text: resolveForeground(background, neutralScale) }
}

/**
 * A bold, unmistakably-colored surface for the one tier that can afford
 * it: Badge's success/warning/danger variants. Small surfaces read as
 * "expressive" at a saturation that would feel heavy across a full-width
 * Alert — see `deriveTintedSurface` for that case.
 *
 * Direction comes from `roleColor`'s own natural lightness (e.g. a bright
 * amber Warning vs. a more moderate green Success), even though every
 * Strong surface is *constructed* at the same anchor lightness for
 * consistent boldness across hues — see `derivePreservingIdentity`'s doc.
 */
export function deriveStrongSurface(roleColor: string, neutralScale: ColorScale): { background: string; text: string } {
  const { l, c, h } = hexToOklch(roleColor)
  const chroma = Math.min(Math.max(c, STRONG_CHROMA_FLOOR), STRONG_CHROMA_CEILING)
  return derivePreservingIdentity(STRONG_TARGET_LIGHTNESS, chroma, h, neutralScale, LIGHTNESS_NUDGE_STEP, MAX_LIGHTNESS_NUDGES, l)
}

/**
 * Solid emphasis: the color stays essentially literal — anchored to its
 * *own* lightness rather than a fixed target the way Strong is — and only
 * shifts within a small bounded range if that's what it takes for the
 * visually preferred foreground to clear AA. Used for Accent Badge, the
 * one Solid surface allowed to adjust (Primary must stay the exact Base
 * Color, so it never runs through this — see generateTheme.ts).
 */
export function deriveSolidSurface(roleColor: string, neutralScale: ColorScale): { background: string; text: string } {
  const { l, c, h } = hexToOklch(roleColor)
  return derivePreservingIdentity(l, c, h, neutralScale, SOLID_LIGHTNESS_NUDGE_STEP, SOLID_MAX_LIGHTNESS_NUDGES)
}

/**
 * A dark, saturated version of `tintSource`'s own hue — for text/borders
 * that need to sit on a pale Tinted surface while still visibly belonging
 * to that surface's color, not reading as plain black-on-tint. Only ever
 * darkens further (never lightens: the Tint background this pairs with is
 * always pale), preferring `PREFERRED_TEXT_CONTRAST` and falling back to
 * `MIN_TEXT_CONTRAST`, same two-tier policy as everywhere else. Falling
 * through to a neutral `resolveForeground` is a last resort that should
 * essentially never trigger in practice.
 */
function deriveTintedForeground(tintSource: string, background: string, neutralScale: ColorScale): string {
  const { c, h } = hexToOklch(tintSource)
  const chroma = Math.min(Math.max(c, STRONG_CHROMA_FLOOR), STRONG_CHROMA_CEILING)

  // Deliberately MIN_TEXT_CONTRAST only, not the two-tier preferred/floor
  // policy used elsewhere — stopping at the first (lightest) step that
  // clears the accessibility floor is the point: chasing 5.5 here would
  // keep darkening straight past the lighter shade this was tuned for,
  // even after 4.5 was already satisfied.
  for (let step = 0; step <= SHADE_MAX_NUDGES; step++) {
    const l = clampLightness(SHADE_TARGET_LIGHTNESS - step * SHADE_NUDGE_STEP)
    const candidate = oklchToHex({ l, c: chroma, h })
    if (contrastRatio(background, candidate) >= MIN_TEXT_CONTRAST) return candidate
  }

  return resolveForeground(background, neutralScale)
}

/**
 * The shared "Tinted" surface: calm, clearly-hued, built to hold a dark
 * foreground comfortably rather than needing contrast math to decide
 * between light/dark on a case-by-case basis. Used for Alerts, Secondary
 * Button, and Badge's Primary/Success/Warning/Danger/Accent variants —
 * genuinely the same visual role (medium-emphasis, palette-derived, never
 * competing with Primary) even though those consumers are otherwise
 * unrelated components.
 *
 * `preferredText`, when given, is tried first (e.g. Secondary wants
 * Primary's own color as its text whenever that reads legibly, so it
 * visibly stays "in the Primary family" instead of deriving its own
 * shade). Without one, the fallback is a dark shade of `tintSource`'s own
 * hue (see `deriveTintedForeground`) — not a generic dark neutral — so a
 * badge's border/text still visibly belongs to its own semantic color.
 */
export function deriveTintedSurface(
  tintSource: string,
  neutralScale: ColorScale,
  preferredText?: string,
): { background: string; text: string } {
  const { c, h } = hexToOklch(tintSource)
  const chroma = Math.min(Math.max(c * TINTED_CHROMA_SCALE, TINTED_CHROMA_FLOOR), TINTED_CHROMA_CEILING)
  const background = oklchToHex({ l: TINTED_TARGET_LIGHTNESS, c: chroma, h })

  // Deliberately checked against MIN_TEXT_CONTRAST, not PREFERRED —
  // Tinted surfaces aren't part of this refinement (see module doc): if
  // Primary's own color already reads legibly here, that's the intended
  // default, not something to chase 5.5 for by adjusting this surface.
  if (preferredText && contrastRatio(background, preferredText) >= MIN_TEXT_CONTRAST) {
    return { background, text: preferredText }
  }
  return { background, text: deriveTintedForeground(tintSource, background, neutralScale) }
}

/** Deterministic perceptual hover/active variation for a filled surface — shifts lightness toward the surrounding contrast direction (darker on a light color, lighter on a dark one) rather than a generic opacity/filter, so the result stays recognizably the same color. */
export function deriveInteractionShift(color: string, amount: number): string {
  const oklch: Oklch = hexToOklch(color)
  const direction = oklch.l > 0.5 ? -1 : 1
  const l = clampLightness(oklch.l + direction * amount)
  return oklchToHex({ ...oklch, l })
}
