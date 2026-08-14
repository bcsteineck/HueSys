import { useCallback, useState } from 'react'
import { type AppState, defaultAppState } from './appState'

function parseThemeIndex(value: string | null): number {
  const parsed = Number(value)
  return value === null || Number.isNaN(parsed) ? defaultAppState.themeIndex : parsed
}

function readStateFromUrl(): AppState {
  const params = new URLSearchParams(window.location.search)
  return {
    color: params.get('color') ?? defaultAppState.color,
    themeIndex: parseThemeIndex(params.get('theme')),
    font: params.get('font') ?? defaultAppState.font,
  }
}

function writeStateToUrl(state: AppState) {
  const params = new URLSearchParams({
    color: state.color,
    theme: String(state.themeIndex),
    font: state.font,
  })
  window.history.replaceState(null, '', `?${params.toString()}`)
}

/**
 * Establishes the URL-as-state pattern: state is read from the URL on load,
 * and every update is written back. Nothing calls updateState yet — that
 * arrives with the real theme controls in a later phase.
 */
export function useAppState() {
  const [state, setState] = useState<AppState>(readStateFromUrl)

  const updateState = useCallback((partial: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial }
      writeStateToUrl(next)
      return next
    })
  }, [])

  return { state, updateState }
}
