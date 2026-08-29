import { beforeEach, describe, expect, it } from 'vitest'
import { defaultAppState } from './appState'
import type { AppState } from './appState'
import { readStateFromUrl, writeStateToUrl } from './urlState'

// No jsdom in this project — readStateFromUrl/writeStateToUrl only ever
// touch window.location.search and window.history.{push,replace}State, so
// a tiny in-memory stand-in is enough for a genuine write → read round
// trip without adding a DOM dependency.
function installFakeWindow() {
  const location = { search: '' }
  function setFromUrl(url: string) {
    location.search = url.includes('?') ? url.slice(url.indexOf('?')) : ''
  }
  const history = {
    pushState: (_state: unknown, _title: string, url: string) => setFromUrl(url),
    replaceState: (_state: unknown, _title: string, url: string) => setFromUrl(url),
  }
  ;(globalThis as unknown as { window: { location: typeof location; history: typeof history } }).window = { location, history }
  return location
}

const CUSTOM_PALETTE = { master: '#123456', deep: '#08004c', muted: '#7f80b6', accentA: '#e37a00', accentB: '#568600' }

beforeEach(() => {
  installFakeWindow()
})

describe('write → read round trip', () => {
  it('restores an identical color state for either mode', () => {
    for (const mode of ['palette', 'custom'] as const) {
      const state: AppState = { ...defaultAppState, color: { mode, colors: CUSTOM_PALETTE, variation: 42 } }
      writeStateToUrl(state, 'replace')
      const restored = readStateFromUrl()
      expect(restored.color).toEqual(state.color)
    }
  })

  it('a Custom edit survives being read back while the URL still says mode=palette', () => {
    // Generate → Custom → edit → Palette → reload: the URL is written
    // while back in Palette mode, but c1-c5 must still be the edited
    // colors, not whatever Palette last generated.
    const state: AppState = { ...defaultAppState, color: { mode: 'palette', colors: CUSTOM_PALETTE, variation: 7 } }
    writeStateToUrl(state, 'replace')
    const restored = readStateFromUrl()
    expect(restored.color.colors).toEqual(CUSTOM_PALETTE)
  })
})

describe('backward compatibility with pre-unification URLs', () => {
  it('ignores a stale/mismatched legacy base param and trusts c1 instead', () => {
    const location = installFakeWindow()
    // An old URL could have `base` present (no longer written) diverging
    // from c1 — c1 must win outright now that there's no separate anchor
    // field for `base` to populate.
    location.search =
      '?section=colors&mode=palette&c1=%23123456&c2=%2308004c&c3=%237f80b6&c4=%23e37a00&c5=%23568600&base=%23ffffff&font=inter&size=medium&weight=medium&radius=subtle&spacing=medium'
    const restored = readStateFromUrl()
    expect(restored.color.colors.master).toBe('#123456')
  })

  it('falls back to the default variation when an old custom-mode URL has no seed', () => {
    const location = installFakeWindow()
    // Pre-unification custom-mode URLs never wrote base/seed at all.
    location.search =
      '?section=colors&mode=custom&c1=%23123456&c2=%2308004c&c3=%237f80b6&c4=%23e37a00&c5=%23568600&font=inter&size=medium&weight=medium&radius=subtle&spacing=medium'
    const restored = readStateFromUrl()
    expect(restored.color.variation).toBe(defaultAppState.color.variation)
    expect(restored.color.colors.master).toBe('#123456')
  })

  it('falls back to the default palette when c1-c5 are absent entirely', () => {
    const location = installFakeWindow()
    location.search = '?section=colors&mode=palette'
    const restored = readStateFromUrl()
    expect(restored.color.colors).toEqual(defaultAppState.color.colors)
  })
})

describe('writeStateToUrl', () => {
  it('no longer serializes a base param', () => {
    const location = installFakeWindow()
    const state: AppState = { ...defaultAppState, color: { mode: 'palette', colors: CUSTOM_PALETTE, variation: 3 } }
    writeStateToUrl(state, 'replace')
    expect(new URLSearchParams(location.search).has('base')).toBe(false)
  })

  it('writes seed unconditionally, in both modes', () => {
    for (const mode of ['palette', 'custom'] as const) {
      const location = installFakeWindow()
      const state: AppState = { ...defaultAppState, color: { mode, colors: CUSTOM_PALETTE, variation: 99 } }
      writeStateToUrl(state, 'replace')
      expect(new URLSearchParams(location.search).get('seed')).toBe('99')
    }
  })
})
