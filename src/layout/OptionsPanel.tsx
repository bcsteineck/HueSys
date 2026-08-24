import type { Palette } from '../theme/color'
import type { ActiveSection, AppState } from '../state/appState'
import type { UpdateStateOptions } from '../state/useAppState'
import { ColorControl } from './ThemeControls/ColorControl'
import { StyleControl } from './ThemeControls/StyleControl'
import { TypographyControl } from './ThemeControls/TypographyControl'
import { GeneratedPalette } from './GeneratedPalette/GeneratedPalette'
import './OptionsPanel.scss'

export interface OptionsPanelProps {
  state: AppState
  palette: Palette
  updateState: (partial: Partial<AppState>, options?: UpdateStateOptions) => void
}

const SECTION_COPY: Record<ActiveSection, { title: string; description: string }> = {
  colors: { title: 'Colors', description: 'Manage your component color palette.' },
  typography: { title: 'Typography', description: 'Manage your component typography.' },
  style: { title: 'Style', description: 'Manage your component style.' },
}

/**
 * Fixed HueSys application chrome. Content swaps with `activeSection` —
 * the controls themselves are the same Stage A logic, minimally adapted
 * to the new shell; the final Colors/Typography/Style experiences belong
 * to Stages C and D.
 */
export function OptionsPanel({ state, palette, updateState }: OptionsPanelProps) {
  const copy = SECTION_COPY[state.activeSection]

  return (
    <section className="options-panel" aria-label="Options">
      <div className="options-panel__header">
        <h2 className="options-panel__title">{copy.title}</h2>
        <p className="options-panel__description">{copy.description}</p>
      </div>

      <div className="options-panel__content">
        {state.activeSection === 'colors' && (
          <>
            <ColorControl color={state.color} onChange={(color) => updateState({ color })} />
            <GeneratedPalette palette={palette} />
          </>
        )}
        {state.activeSection === 'typography' && (
          <TypographyControl typography={state.typography} onChange={(typography) => updateState({ typography })} />
        )}
        {state.activeSection === 'style' && (
          <StyleControl style={state.style} onChange={(style) => updateState({ style })} />
        )}
      </div>
    </section>
  )
}
