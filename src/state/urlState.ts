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

  const mode = parseMode(params.get('mode'))
  const activeColors = parseActiveColors(params)
  const baseParam = params.get('base')

  const color: AppState['color'] =
    mode === 'custom'
      ? {
          mode,
          palette: defaultAppState.color.palette,
          custom: { colors: activeColors ?? defaultAppState.color.custom.colors },
          customInitialized: true,
        }
      : {
          mode,
          palette: activeColors
            ? {
                baseColor: baseParam !== null && isValidHexColor(baseParam) ? normalizeColor(baseParam) : activeColors.master,
                colors: activeColors,
                variation: parseInteger(params.get('seed'), defaultAppState.color.palette.variation),
              }
            : defaultAppState.color.palette,
          custom: defaultAppState.color.custom,
          customInitialized: false,
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
  const activeColors = state.color.mode === 'custom' ? state.color.custom.colors : state.color.palette.colors
  const params = new URLSearchParams({
    section: state.activeSection,
    mode: state.color.mode,
    c1: activeColors.master,
    c2: activeColors.deep,
    c3: activeColors.muted,
    c4: activeColors.accentA,
    c5: activeColors.accentB,
    font: state.typography.font,
    size: state.typography.size,
    weight: state.typography.weight,
    radius: RADIUS_TO_URL[state.style.radius],
    spacing: state.style.spacing,
  })
  // Base Color and variation only apply in Palette mode — Custom mode has
  // no single anchor color driving generation.
  if (state.color.mode === 'palette') {
    params.set('base', state.color.palette.baseColor)
    params.set('seed', String(state.color.palette.variation))
  }

  const url = `?${params.toString()}`
  if (mode === 'push') {
    window.history.pushState(null, '', url)
  } else {
    window.history.replaceState(null, '', url)
  }
}
