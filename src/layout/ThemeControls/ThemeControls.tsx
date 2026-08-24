import type { AppState } from '../../state/appState'
import type { UpdateStateOptions } from '../../state/useAppState'
import { ColorControl } from './ColorControl'
import { StyleControl } from './StyleControl'
import { TypographyControl } from './TypographyControl'
import './ThemeControls.scss'

export interface ThemeControlsProps {
  state: AppState
  updateState: (partial: Partial<AppState>, options?: UpdateStateOptions) => void
}

/**
 * Inputs only — "what would you like HueSys to generate?" Colors,
 * Typography, and Style are deliberately independent controls: changing
 * one never touches the others. What HueSys actually generated lives in
 * the Generated Palette section below this, not here. A temporary,
 * single-column layout for Stage A verification — the real Colors /
 * Typography / Style dashboard sections belong to Stage B.
 */
export function ThemeControls({ state, updateState }: ThemeControlsProps) {
  return (
    <section className="theme-controls" aria-label="Theme controls">
      <h2 className="theme-controls__title">Theme Controls</h2>

      <div className="theme-controls__row">
        <div className="theme-controls__group">
          <h3 className="theme-controls__label">Colors</h3>
          <ColorControl color={state.color} onChange={(color) => updateState({ color })} />
        </div>

        <div className="theme-controls__group">
          <h3 className="theme-controls__label">Typography</h3>
          <TypographyControl typography={state.typography} onChange={(typography) => updateState({ typography })} />
        </div>

        <div className="theme-controls__group">
          <h3 className="theme-controls__label">Style</h3>
          <StyleControl style={state.style} onChange={(style) => updateState({ style })} />
        </div>
      </div>
    </section>
  )
}
