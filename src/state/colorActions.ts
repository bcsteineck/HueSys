import { generateBrandPalette } from '../theme/color'
import type { BrandPalette } from '../theme/color'
import type { ColorState, PaletteColorState } from './appState'

function randomHexColor(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(3))
  return `#${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

function randomVariation(): number {
  return crypto.getRandomValues(new Uint16Array(1))[0] % 1000
}

function paletteFrom(baseColor: string, variation: number): PaletteColorState {
  const colors = generateBrandPalette(baseColor, variation)
  return { baseColor: colors.master, colors, variation }
}

/** Randomize: an entirely new Base Color and a new palette around it. */
export function randomizePalette(): PaletteColorState {
  return paletteFrom(randomHexColor(), randomVariation())
}

/** Refresh: keep the current Base Color, generate another palette around it. */
export function refreshPalette(currentBaseColor: string): PaletteColorState {
  return paletteFrom(currentBaseColor, randomVariation())
}

/** An explicit Base Color was entered: generate a fresh palette anchored to it. */
export function setBaseColor(baseColor: string): PaletteColorState {
  return paletteFrom(baseColor, randomVariation())
}

/**
 * Switches Color mode. Entering Custom mode for the first time seeds its
 * five colors from whatever the active Brand Palette currently is; every
 * subsequent switch (either direction) leaves both modes' state untouched.
 */
export function switchColorMode(state: ColorState, mode: ColorState['mode']): ColorState {
  if (mode === 'custom' && !state.customInitialized) {
    return { ...state, mode, custom: { colors: state.palette.colors }, customInitialized: true }
  }
  return { ...state, mode }
}

/** The Brand Palette currently in effect, regardless of which mode produced it. */
export function activeBrandPalette(state: ColorState): BrandPalette {
  return state.mode === 'custom' ? state.custom.colors : state.palette.colors
}
