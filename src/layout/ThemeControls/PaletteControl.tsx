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
 * Three independent ways to get a palette: entering a Base Color anchors
 * generation to it (committed the moment it becomes a valid six-digit
 * hex — incomplete values like "#6E5C" never touch design state);
 * Refresh keeps the current Base Color and explores another palette
 * around it; Randomize picks an entirely new Base Color and direction.
 * All three only ever touch Palette color state — never Typography or
 * Style.
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

  function handleDraftChange(value: string) {
    setDraft(value)
    if (isValidHexColor(value)) {
      onChange(setBaseColor(value))
    }
  }

  const draftIsValid = isValidHexColor(draft)

  return (
    <div className="palette-control">
      <div className="palette-control__base">
        <span className="palette-control__label">Base Color</span>
        <div className="palette-control__base-row">
          <input
            type="color"
            className="palette-control__swatch"
            value={draftIsValid ? normalizeColor(draft) : '#000000'}
            onChange={(event) => handleDraftChange(event.target.value)}
            aria-label="Base color picker"
          />
          <HueSysInput
            className="palette-control__hex"
            value={draft}
            onChange={(event) => handleDraftChange(event.target.value)}
            placeholder="#4F46E5"
            spellCheck={false}
            aria-label="Base color hex value"
          />
          <HueSysButton
            variant="outline"
            iconOnly
            onClick={() => onChange(refreshPalette(palette.baseColor))}
            aria-label="Generate another palette"
            title="Generate another palette"
          >
            <RefreshIcon />
          </HueSysButton>
        </div>
      </div>

      <HueSysButton variant="soft" onClick={() => onChange(randomizePalette())}>
        <RandomizeIcon />
        Randomize
      </HueSysButton>
    </div>
  )
}
