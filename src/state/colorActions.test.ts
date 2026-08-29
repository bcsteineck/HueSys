import { describe, expect, it } from 'vitest'
import { defaultAppState } from './appState'
import type { ColorState } from './appState'
import { randomizePalette, refreshPalette, setBaseColor, switchColorMode } from './colorActions'

const BASE_STATE: ColorState = defaultAppState.color

describe('switchColorMode', () => {
  it('only changes mode — never the current Brand Palette', () => {
    const next = switchColorMode(BASE_STATE, 'custom')
    expect(next.mode).toBe('custom')
    expect(next.colors).toBe(BASE_STATE.colors)
    expect(next.variation).toBe(BASE_STATE.variation)
  })

  it('is a no-op for colors/variation in either direction', () => {
    const toCustom = switchColorMode(BASE_STATE, 'custom')
    const backToPalette = switchColorMode(toCustom, 'palette')
    expect(backToPalette.colors).toBe(BASE_STATE.colors)
    expect(backToPalette.variation).toBe(BASE_STATE.variation)
  })

  it('repeated switching without editing or generating changes nothing', () => {
    let state = BASE_STATE
    for (let i = 0; i < 10; i++) {
      state = switchColorMode(state, i % 2 === 0 ? 'custom' : 'palette')
    }
    expect(state.colors).toEqual(BASE_STATE.colors)
    expect(state.variation).toBe(BASE_STATE.variation)
  })
})

describe('randomizePalette', () => {
  it('produces a full five-color Brand Palette with color #1 as the Base Color', () => {
    const result = randomizePalette()
    expect(Object.keys(result.colors)).toEqual(['master', 'deep', 'muted', 'accentA', 'accentB'])
    expect(typeof result.variation).toBe('number')
  })

  it('produces a different Base Color across calls (astronomically unlikely to collide)', () => {
    const a = randomizePalette()
    const b = randomizePalette()
    expect(a.colors.master).not.toBe(b.colors.master)
  })
})

describe('refreshPalette', () => {
  it('preserves the given Base Color exactly', () => {
    const anchor = '#336699'
    const result = refreshPalette(anchor)
    expect(result.colors.master).toBe(anchor)
  })

  it('can regenerate around a Base Color that came from a manual Custom edit, not just a generated one', () => {
    // Simulates: user edited color #1 directly in Custom mode, then
    // switched to Palette and hit Refresh — Refresh must anchor to that
    // edited value, not some hidden prior generation anchor.
    const manuallyEditedColor1 = '#123456'
    const result = refreshPalette(manuallyEditedColor1)
    expect(result.colors.master).toBe(manuallyEditedColor1)
  })
})

describe('setBaseColor', () => {
  it('anchors the generated palette to the given hex exactly', () => {
    const result = setBaseColor('#abcdef')
    expect(result.colors.master).toBe('#abcdef')
  })
})
