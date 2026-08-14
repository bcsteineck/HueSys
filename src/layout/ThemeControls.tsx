import type { AppState } from '../state/appState'
import './ThemeControls.scss'

export interface ThemeControlsProps {
  state: AppState
}

export function ThemeControls({ state }: ThemeControlsProps) {
  return (
    <aside className="theme-controls" aria-label="Theme controls">
      <h2 className="theme-controls__title">Theme Controls</h2>
      <p>Color, recipe, and font controls will live here.</p>
      <dl className="theme-controls__state">
        <dt>Color</dt>
        <dd>#{state.color}</dd>
        <dt>Theme</dt>
        <dd>{state.themeIndex}</dd>
        <dt>Font</dt>
        <dd>{state.font}</dd>
      </dl>
    </aside>
  )
}
