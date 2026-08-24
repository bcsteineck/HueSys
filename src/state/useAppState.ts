import { useEffect, useState } from 'react'
import { isValidHexColor } from '../theme/color'
import { fontOptions } from '../theme/fonts'
import { type AppState, defaultAppState } from './appState'

function parseColor(value: string | null): string {
  if (value !== null && isValidHexColor(value)) {
    return value.replace('#', '').toLowerCase()
  }
  return defaultAppState.anchorColor
}

function parseInteger(value: string | null, fallback: number): number {
  const parsed = Number(value)
  return value === null || Number.isNaN(parsed) ? fallback : parsed
}

function parseFont(value: string | null): string {
  return value !== null && fontOptions.some((option) => option.id === value) ? value : defaultAppState.font
}

function readStateFromUrl(): AppState {
  const params = new URLSearchParams(window.location.search)
  // A completely bare URL (first visit, no shared link) gets the full
  // default state, including its pinned default master color — a
  // partially-specified URL (e.g. only ?style=2) still falls back field
  // by field, since that's a deliberate shared/edited link.
  if ([...params.keys()].length === 0) return defaultAppState

  return {
    anchorColor: parseColor(params.get('color')),
    hasMasterColor: params.get('master') === '1',
    paletteSeed: parseInteger(params.get('seed'), defaultAppState.paletteSeed),
    styleIndex: parseInteger(params.get('style'), defaultAppState.styleIndex),
    font: parseFont(params.get('font')),
  }
}

function writeStateToUrl(state: AppState, mode: 'push' | 'replace') {
  const params = new URLSearchParams({
    color: state.anchorColor,
    seed: String(state.paletteSeed),
    style: String(state.styleIndex),
    font: state.font,
  })
  if (state.hasMasterColor) params.set('master', '1')

  const url = `?${params.toString()}`
  if (mode === 'push') {
    window.history.pushState(null, '', url)
  } else {
    window.history.replaceState(null, '', url)
  }
}

export interface UpdateStateOptions {
  /** Use replaceState instead of pushState — for continuous edits (e.g. typing a hex value) that shouldn't spam history with one entry per keystroke. */
  replace?: boolean
}

/**
 * The URL is the source of truth for app state: read on load, written on
 * every change (pushState by default, so each control interaction is a
 * navigable history entry; replaceState for continuous edits), and
 * re-read whenever the user navigates Back/Forward.
 */
export function useAppState() {
  const [state, setState] = useState<AppState>(readStateFromUrl)

  // Deliberately not a setState updater function: writeStateToUrl is a
  // side effect (history.pushState), and updater functions must stay pure
  // — React (in StrictMode) invokes them twice in dev specifically to
  // catch impurities like this, which would otherwise double-push history
  // on every single call.
  function updateState(partial: Partial<AppState>, options?: UpdateStateOptions) {
    const next = { ...state, ...partial }
    writeStateToUrl(next, options?.replace ? 'replace' : 'push')
    setState(next)
  }

  useEffect(() => {
    function handlePopState() {
      setState(readStateFromUrl())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return { state, updateState }
}
