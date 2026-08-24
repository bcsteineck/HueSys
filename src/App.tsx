import type { CSSProperties } from 'react'
import { Header } from './layout/Header'
import { ThemeControls } from './layout/ThemeControls/ThemeControls'
import { GeneratedPalette } from './layout/GeneratedPalette/GeneratedPalette'
import { ComponentPreview } from './layout/ComponentPreview'
import { ExportControls } from './layout/ExportControls'
import { buildPalette } from './theme/color'
import { generateTheme } from './theme/generateTheme'
import { themeToCssVariables } from './theme/cssVariables'
import { huesysThemeStyle } from './theme/huesysTheme'
import { useAppState } from './state/useAppState'
import { activeBrandPalette } from './state/colorActions'
import './App.scss'

function App() {
  const { state, updateState, undo, redo, canUndo, canRedo } = useAppState()

  const brand = activeBrandPalette(state.color)
  const palette = buildPalette(brand)
  const masterColor = state.color.mode === 'palette' ? state.color.palette.baseColor : undefined
  const theme = generateTheme(palette, state.typography, state.style, masterColor)
  // Only the Live Preview subtree should see the generated Theme — every
  // CSS variable name it sets here shadows the fixed HueSys chrome
  // variables declared on .app, for descendants of this element only.
  const previewStyle = themeToCssVariables(theme) as CSSProperties

  return (
    <div className="app" style={huesysThemeStyle as CSSProperties}>
      <Header canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} />
      <div className="app__body">
        <ThemeControls state={state} updateState={updateState} />
        <GeneratedPalette palette={palette} />
        <div className="app__preview" style={previewStyle}>
          <ComponentPreview />
        </div>
        <ExportControls />
      </div>
    </div>
  )
}

export default App
