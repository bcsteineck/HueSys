import { useState } from 'react'
import { HueSysButton } from '../../huesys-ui/HueSysButton'
import { HueSysInput } from '../../huesys-ui/HueSysInput'
import { RandomizeIcon, RefreshIcon } from '../../huesys-ui/icons'
import { isValidHexColor, normalizeColor } from '../../theme/color'
import type { PaletteColorState } from '../../state/appState'
import { randomizePalette, refreshPalette, setBaseColor } from '../../state/colorActions'
import './PaletteControl.scss'

export interface PaletteControlProps {
  palette: PaletteColorState
  onChange: (next: PaletteColorState) => void
}

/**
 * Three independent ways to get a palette: Randomize picks an entirely new
 * Base Color and direction; entering a Base Color anchors generation to
 * it; Refresh keeps the current Base Color and explores another palette
 * around it. All three only ever touch Palette color state — never
 * Typography or Style.
 */
export function PaletteControl({ palette, onChange }: PaletteControlProps) {
  const [draft, setDraft] = useState(`#${palette.baseColor.replace('#', '')}`)

  // Keep the draft in sync whenever the committed Base Color changes from
  // elsewhere (Randomize, Refresh, browser navigation). Adjusted during
  // render, per React's own guidance for resetting local state when a
  // prop changes.
  const [syncedBaseColor, setSyncedBaseColor] = useState(palette.baseColor)
  if (palette.baseColor !== syncedBaseColor) {
    setSyncedBaseColor(palette.baseColor)
    setDraft(`#${palette.baseColor.replace('#', '')}`)
  }

  const draftIsValid = isValidHexColor(draft)

  return (
    <div className="palette-control">
      <HueSysButton variant="soft" onClick={() => onChange(randomizePalette())}>
        <RandomizeIcon />
        Randomize
      </HueSysButton>

      <div className="palette-control__master">
        <span className="palette-control__master-label">Base Color</span>
        <div className="palette-control__master-row">
          <input
            type="color"
            className="palette-control__swatch"
            value={draftIsValid ? normalizeColor(draft) : '#000000'}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Base color picker"
          />
          <HueSysInput
            className="palette-control__hex"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="#4F46E5"
            spellCheck={false}
            aria-label="Base color hex value"
          />
        </div>
        <HueSysButton variant="outline" onClick={() => onChange(setBaseColor(draft))} disabled={!draftIsValid}>
          Generate From Color
        </HueSysButton>
      </div>

      <HueSysButton variant="outline" onClick={() => onChange(refreshPalette(palette.baseColor))}>
        <RefreshIcon />
        Refresh
      </HueSysButton>
    </div>
  )
}
