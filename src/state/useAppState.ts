import { useEffect, useState } from 'react'
import { isValidHexColor } from '../theme/color'
import { fontOptions } from '../theme/fonts'
import { type AppState, defaultAppState } from './appState'

function parseColor(value: string | null): string {
  if (value !== null && isValidHexColor(value)) {
    return value.replace('#', '').toLowerCase()
  }
  return defaultAppState.color
}

function parseThemeIndex(value: string | null): number {
  const parsed = Number(value)
  return value === null || Number.isNaN(parsed) ? defaultAppState.themeIndex : parsed
}

function parseFont(value: string | null): string {
  return value !== null && fontOptions.some((option) => option.id === value) ? value : defaultAppState.font
}

function readStateFromUrl(): AppState {
  const params = new URLSearchParams(window.location.search)
  return {
    color: parseColor(params.get('color')),
    themeIndex: parseThemeIndex(params.get('theme')),
    font: parseFont(params.get('font')),
  }
}

function writeStateToUrl(state: AppState, mode: 'push' | 'replace') {
  const params = new URLSearchParams({
    color: state.color,
    theme: String(state.themeIndex),
    font: state.font,
  })
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
