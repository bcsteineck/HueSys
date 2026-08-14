import type { CSSProperties } from 'react'
import { Header } from './layout/Header'
import { ThemeControls } from './layout/ThemeControls'
import { ComponentPreview } from './layout/ComponentPreview'
import { ExportControls } from './layout/ExportControls'
import { defaultTheme } from './theme/defaultTheme'
import { themeToCssVariables } from './theme/cssVariables'
import { useAppState } from './state/useAppState'
import './App.scss'

function App() {
  const themeStyle = themeToCssVariables(defaultTheme) as CSSProperties
  const { state } = useAppState()

  return (
    <div className="app" style={themeStyle}>
      <div className="app__header">
        <Header />
      </div>
      <div className="app__theme-controls">
        <ThemeControls state={state} />
      </div>
      <div className="app__preview">
        <ComponentPreview />
      </div>
      <div className="app__export-controls">
        <ExportControls />
      </div>
    </div>
  )
}

export default App
