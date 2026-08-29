import { isValidHexColor, normalizeColor } from '../theme/color'
import type { BrandPalette } from '../theme/color'
import { fontOptions } from '../theme/fonts'
import type { ActiveSection, AppState, BorderRadius, ColorMode, FontSize, FontWeight, Spacing } from './appState'
import { defaultAppState } from './appState'

function parseSection(value: string | null): ActiveSection {
  return value === 'colors' || value === 'typography' || value === 'style' ? value : defaultAppState.activeSection
}

function parseMode(value: string | null): ColorMode {
  return value === 'palette' || value === 'custom' ? value : defaultAppState.color.mode
}

function parseInteger(value: string | null, fallback: number): number {
  const parsed = Number(value)
  return value === null || Number.isNaN(parsed) ? fallback : parsed
}

function parseFont(value: string | null): string {
  return value !== null && fontOptions.some((option) => option.id === value) ? value : defaultAppState.typography.font
}

function parseFontSize(value: string | null): FontSize {
  return value === 'small' || value === 'medium' || value === 'large' ? value : defaultAppState.typography.size
}

function parseFontWeight(value: string | null): FontWeight {
  return value === 'regular' || value === 'medium' || value === 'semibold' ? value : defaultAppState.typography.weight
}

// The `radius` URL parameter's serialized vocabulary is intentionally
// frozen to what it has always meant (independent of BorderRadius's
// current internal/UI names) — this is what lets a URL created before the
// Soft/Rounded naming correction keep reproducing the exact radius it
// always did, rather than silently flipping to the opposite treatment.
const RADIUS_FROM_URL: Record<string, BorderRadius> = {
  sharp: 'sharp',
  subtle: 'subtle',
  rounded: 'soft',
  soft: 'rounded',
}
const RADIUS_TO_URL: Record<BorderRadius, string> = {
  sharp: 'sharp',
  subtle: 'subtle',
  soft: 'rounded',
  rounded: 'soft',
}

function parseRadius(value: string | null): BorderRadius {
  return (value !== null && RADIUS_FROM_URL[value]) || defaultAppState.style.radius
}

function parseSpacing(value: string | null): Spacing {
  return value === 'compact' || value === 'medium' || value === 'spacious' ? value : defaultAppState.style.spacing
}

/**
 * All five active Brand Palette colors must be present and valid, or the
 * whole set falls back to the default palette together — partial/garbage
 * color data isn't worth trying to salvage field by field.
 */
function parseActiveColors(params: URLSearchParams): BrandPalette | null {
  const values = ['c1', 'c2', 'c3', 'c4', 'c5'].map((key) => params.get(key))
  if (values.some((value): value is string => value === null || !isValidHexColor(value))) return null
  const [master, deep, muted, accentA, accentB] = values.map((value) => normalizeColor(value as string))
  return { master, deep, muted, accentA, accentB }
}

export function readStateFromUrl(): AppState {
  const params = new URLSearchParams(window.location.search)
  // A completely bare URL (first visit, no shared link) gets the full
  // default state, including its curated default Base Color — a
  // partially-specified URL still falls back field by field, since that's
  // a deliberate shared/edited link.
  if ([...params.keys()].length === 0) return defaultAppState

  // c1-c5 are the one current Brand Palette regardless of mode — they're
  // always authoritative and are never regenerated from `base`/`seed`.
  // `base` no longer exists as its own param (see writeStateToUrl): color
  // #1 of c1-c5 already is the Base Color, so a separate value could only
  // ever go stale against it. `seed` only feeds a *future* Refresh; it
  // plays no part in reconstructing the current colors on read.
  const color: AppState['color'] = {
    mode: parseMode(params.get('mode')),
    colors: parseActiveColors(params) ?? defaultAppState.color.colors,
    variation: parseInteger(params.get('seed'), defaultAppState.color.variation),
  }

  return {
    activeSection: parseSection(params.get('section')),
    color,
    typography: {
      font: parseFont(params.get('font')),
      size: parseFontSize(params.get('size')),
      weight: parseFontWeight(params.get('weight')),
    },
    style: {
      radius: parseRadius(params.get('radius')),
      spacing: parseSpacing(params.get('spacing')),
    },
  }
}

export function writeStateToUrl(state: AppState, mode: 'push' | 'replace') {
  const colors = state.color.colors
  const params = new URLSearchParams({
    section: state.activeSection,
    mode: state.color.mode,
    c1: colors.master,
    c2: colors.deep,
    c3: colors.muted,
    c4: colors.accentA,
    c5: colors.accentB,
    seed: String(state.color.variation),
    font: state.typography.font,
    size: state.typography.size,
    weight: state.typography.weight,
    radius: RADIUS_TO_URL[state.style.radius],
    spacing: state.style.spacing,
  })

  const url = `?${params.toString()}`
  if (mode === 'push') {
    window.history.pushState(null, '', url)
  } else {
    window.history.replaceState(null, '', url)
  }
}
