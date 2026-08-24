import { useEffect, useState } from 'react'
import type { AppState, ColorState, StyleState, TypographyState } from './appState'
import { readStateFromUrl, writeStateToUrl } from './urlState'

export interface UpdateStateOptions {
  /** This is a dashboard navigation change (e.g. switching Colors/Typography/Style), not a design edit — it gets its own pushState entry so browser Back/Forward can step through it. Design edits default to replaceState instead, so they don't spam browser history; Undo/Redo is the mechanism for stepping back through those. */
  navigation?: boolean
  /** Skip recording this change in design-state history — used by undo()/redo() themselves so restoring a snapshot doesn't push a new one. */
  skipHistory?: boolean
}

interface DesignSnapshot {
  color: ColorState
  typography: TypographyState
  style: StyleState
}

function toSnapshot(state: AppState): DesignSnapshot {
  return { color: state.color, typography: state.typography, style: state.style }
}

const EMPTY_HISTORY = { past: [] as DesignSnapshot[], future: [] as DesignSnapshot[] }

/**
 * The URL is the source of truth for app state: read on load, written on
 * every change (replaceState by default, so continuous design edits don't
 * spam browser history; pushState for dashboard navigation), and re-read
 * whenever the user navigates Back/Forward.
 *
 * Design-state Undo/Redo is a separate history stack, restoring complete
 * Colors/Typography/Style snapshots. It's deliberately not the same thing
 * as browser history — navigating sections, scrolling, or copying a color
 * never enters it, only changes to `color`, `typography`, or `style` do.
 */
export function useAppState() {
  const [state, setState] = useState<AppState>(readStateFromUrl)
  const [history, setHistory] = useState(EMPTY_HISTORY)

  // Deliberately not setState updater functions: writeStateToUrl is a side
  // effect (history.pushState/replaceState), and updater functions must
  // stay pure — React (in StrictMode) invokes them twice in dev
  // specifically to catch impurities like this, which would otherwise
  // double-push history on every single call. Everything below reads from
  // the closure's `state`/`history` instead.
  function updateState(partial: Partial<AppState>, options?: UpdateStateOptions) {
    const next = { ...state, ...partial }
    const isDesignChange = 'color' in partial || 'typography' in partial || 'style' in partial
    writeStateToUrl(next, options?.navigation ? 'push' : 'replace')
    setState(next)
    if (isDesignChange && !options?.skipHistory) {
      setHistory({ past: [...history.past, toSnapshot(state)], future: [] })
    }
  }

  function undo() {
    if (history.past.length === 0) return
    const snapshot = history.past[history.past.length - 1]
    const next = { ...state, ...snapshot }
    writeStateToUrl(next, 'replace')
    setState(next)
    setHistory({ past: history.past.slice(0, -1), future: [toSnapshot(state), ...history.future] })
  }

  function redo() {
    if (history.future.length === 0) return
    const snapshot = history.future[0]
    const next = { ...state, ...snapshot }
    writeStateToUrl(next, 'replace')
    setState(next)
    setHistory({ past: [...history.past, toSnapshot(state)], future: history.future.slice(1) })
  }

  useEffect(() => {
    function handlePopState() {
      // Design history is meaningful relative to the state it was recorded
      // against — a real Back/Forward navigation can land on an unrelated
      // design entirely, so it starts a fresh Undo/Redo stack rather than
      // risk restoring a snapshot that no longer makes sense.
      setState(readStateFromUrl())
      setHistory(EMPTY_HISTORY)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return {
    state,
    updateState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  }
}
