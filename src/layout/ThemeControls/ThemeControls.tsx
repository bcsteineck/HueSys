import type { AppState } from '../../state/appState'
import type { UpdateStateOptions } from '../../state/useAppState'
import { FontControl } from './FontControl'
import { PaletteControl } from './PaletteControl'
import { StyleControl } from './StyleControl'
import './ThemeControls.scss'

export interface ThemeControlsProps {
  state: AppState
  updateState: (partial: Partial<AppState>, options?: UpdateStateOptions) => void
}

/**
 * Inputs only — "what would you like HueSys to generate?" Palette and
 * Style are deliberately independent controls: generating a palette never
 * touches the selected Style, and changing Style never touches the
 * palette. What HueSys actually generated lives in the Generated Palette
 * section below this, not here.
 */
export function ThemeControls({ state, updateState }: ThemeControlsProps) {
  return (
    <section className="theme-controls" aria-label="Theme controls">
      <h2 className="theme-controls__title">Theme Controls</h2>

      <div className="theme-controls__row">
        <div className="theme-controls__group">
          <h3 className="theme-controls__label">Palette</h3>
          <PaletteControl
            hasMasterColor={state.hasMasterColor}
            anchorColor={state.anchorColor}
            onGenerate={(request) => updateState(request)}
          />
        </div>

        <div className="theme-controls__group">
          <h3 className="theme-controls__label">Style</h3>
          <StyleControl styleIndex={state.styleIndex} onChange={(styleIndex) => updateState({ styleIndex })} />
        </div>

        <div className="theme-controls__group">
          <h3 className="theme-controls__label">Font</h3>
          <FontControl font={state.font} onChange={(font) => updateState({ font })} />
        </div>
      </div>
    </section>
  )
}
