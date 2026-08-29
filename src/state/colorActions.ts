import { generateBrandPalette } from '../theme/color'
import type { ColorState } from './appState'

/** The generated-palette portion of ColorState — what Palette-mode generation actions produce. */
export type GeneratedColors = Pick<ColorState, 'colors' | 'variation'>

function randomHexColor(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(3))
  return `#${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

function randomVariation(): number {
  return crypto.getRandomValues(new Uint16Array(1))[0] % 1000
}

function paletteFrom(baseColor: string, variation: number): GeneratedColors {
  return { colors: generateBrandPalette(baseColor, variation), variation }
}

/** Randomize: an entirely new Base Color and a new palette around it. */
export function randomizePalette(): GeneratedColors {
  return paletteFrom(randomHexColor(), randomVariation())
}

/** Refresh: keep the current Base Color, generate another palette around it. */
export function refreshPalette(currentBaseColor: string): GeneratedColors {
  return paletteFrom(currentBaseColor, randomVariation())
}

/** An explicit Base Color was entered: generate a fresh palette anchored to it. */
export function setBaseColor(baseColor: string): GeneratedColors {
  return paletteFrom(baseColor, randomVariation())
}

/** Switches which controls are visible. Never touches the current Brand Palette. */
export function switchColorMode(state: ColorState, mode: ColorState['mode']): ColorState {
  return { ...state, mode }
}
