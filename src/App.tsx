import type { CSSProperties } from 'react'
import { Header } from './layout/Header'
import { ThemeControls } from './layout/ThemeControls'
import { ComponentPreview } from './layout/ComponentPreview'
import { ExportControls } from './layout/ExportControls'
import { generateColorFoundation } from './theme/color'
import { generateTheme } from './theme/generateTheme'
import { getThemeRecipe } from './theme/recipes'
import { themeToCssVariables } from './theme/cssVariables'
import { useAppState } from './state/useAppState'
import './App.scss'

function App() {
  const { state } = useAppState()

  const colorFoundation = generateColorFoundation(state.color)
  const recipe = getThemeRecipe(state.themeIndex)
  const theme = generateTheme(colorFoundation, recipe, state.font)
  const themeStyle = themeToCssVariables(theme) as CSSProperties

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
