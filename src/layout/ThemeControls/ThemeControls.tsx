import type { AppState } from '../../state/appState'
import type { UpdateStateOptions } from '../../state/useAppState'
import { ColorControl } from './ColorControl'
import { FontControl } from './FontControl'
import { RecipeControl } from './RecipeControl'
import './ThemeControls.scss'

export interface ThemeControlsProps {
  state: AppState
  updateState: (partial: Partial<AppState>, options?: UpdateStateOptions) => void
}

export function ThemeControls({ state, updateState }: ThemeControlsProps) {
  return (
    <aside className="theme-controls" aria-label="Theme controls">
      <h2 className="theme-controls__title">Theme</h2>

      <div className="theme-controls__group">
        <h3 className="theme-controls__label">Primary color</h3>
        <ColorControl color={state.color} onChange={(color, options) => updateState({ color }, options)} />
      </div>

      <div className="theme-controls__group">
        <h3 className="theme-controls__label">Recipe</h3>
        <RecipeControl themeIndex={state.themeIndex} onChange={(themeIndex) => updateState({ themeIndex })} />
      </div>

      <div className="theme-controls__group">
        <h3 className="theme-controls__label">Font</h3>
        <FontControl font={state.font} onChange={(font) => updateState({ font })} />
      </div>
    </aside>
  )
}
