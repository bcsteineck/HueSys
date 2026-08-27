import { useState, type CSSProperties } from 'react'
import { Header } from './layout/Header'
import { MobileHeader } from './layout/MobileHeader'
import { Sidebar } from './layout/Sidebar'
import { TopNav } from './layout/TopNav'
import { OptionsPanel } from './layout/OptionsPanel'
import { LivePreview } from './layout/LivePreview'
import { ExportDialog } from './huesys-ui/ExportDialog'
import { buildPalette } from './theme/color'
import { generateTheme } from './theme/generateTheme'
import { themeToCssVariables } from './theme/cssVariables'
import { useAppState } from './state/useAppState'
import { activeBrandPalette } from './state/colorActions'
import type { ActiveSection } from './state/appState'
import './App.scss'

function App() {
  const { state, updateState, undo, redo, canUndo, canRedo } = useAppState()
  const [exportOpen, setExportOpen] = useState(false)

  const brand = activeBrandPalette(state.color)
  const palette = buildPalette(brand)
  const masterColor = state.color.mode === 'palette' ? state.color.palette.baseColor : undefined
  const theme = generateTheme(palette, state.typography, state.style, masterColor)
  // Scoped to the Live Preview scroll region only — every CSS variable
  // name here shadows nothing at the HueSys chrome level, since HueSys UI
  // reads exclusively from its own fixed --huesys-* tokens.
  const previewStyle = themeToCssVariables(theme) as CSSProperties

  function handleNavigate(section: ActiveSection) {
    // A real dashboard navigation, not a design edit: gets its own
    // browser-history entry and never enters Undo/Redo.
    updateState({ activeSection: section }, { navigation: true })
  }

  return (
    <div className="app">
      <a className="skip-link" href="#options-panel">
        Skip to options
      </a>
      <Sidebar activeSection={state.activeSection} onNavigate={handleNavigate} />
      <div className="workspace">
        <MobileHeader />
        <Header canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} onOpenExport={() => setExportOpen(true)} />
        <TopNav activeSection={state.activeSection} onNavigate={handleNavigate} />
        <div className="workspace__content">
          <OptionsPanel state={state} palette={palette} updateState={updateState} />
          <LivePreview previewStyle={previewStyle} />
        </div>
      </div>
      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} theme={theme} fontId={state.typography.font} />
    </div>
  )
}

export default App
