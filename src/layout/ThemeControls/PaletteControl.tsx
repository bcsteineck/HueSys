import { useState } from 'react'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'
import { isValidHexColor, normalizeColor } from '../../theme/color'

export interface PaletteGenerationRequest {
  anchorColor: string
  hasMasterColor: boolean
  paletteSeed: number
}

export interface PaletteControlProps {
  hasMasterColor: boolean
  anchorColor: string
  onGenerate: (request: PaletteGenerationRequest) => void
}

function randomHexColor(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(3))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function randomSeed(): number {
  return crypto.getRandomValues(new Uint16Array(1))[0] % 1000
}

/**
 * Two independent ways to get a palette: a one-click random generation
 * that needs no input, or an explicit master color the palette gets
 * anchored to. Both only ever touch the palette fields of AppState —
 * neither one ever changes Style.
 */
export function PaletteControl({ hasMasterColor, anchorColor, onGenerate }: PaletteControlProps) {
  const [draft, setDraft] = useState(hasMasterColor ? `#${anchorColor}` : '')

  // Keep the draft in sync whenever the committed master state changes
  // from elsewhere (Generate Palette clearing it, browser navigation).
  // Adjusted during render, per React's own guidance for resetting local
  // state when a prop changes.
  const [synced, setSynced] = useState({ hasMasterColor, anchorColor })
  if (hasMasterColor !== synced.hasMasterColor || anchorColor !== synced.anchorColor) {
    setSynced({ hasMasterColor, anchorColor })
    setDraft(hasMasterColor ? `#${anchorColor}` : '')
  }

  function handleGenerateRandom() {
    onGenerate({ anchorColor: randomHexColor(), hasMasterColor: false, paletteSeed: randomSeed() })
  }

  function handleGenerateFromColor() {
    onGenerate({
      anchorColor: normalizeColor(draft).replace('#', ''),
      hasMasterColor: true,
      paletteSeed: randomSeed(),
    })
  }

  const draftIsValid = isValidHexColor(draft)

  return (
    <div className="palette-control">
      <Button variant="primary" onClick={handleGenerateRandom}>
        Generate Palette
      </Button>

      <div className="palette-control__master">
        <span className="palette-control__master-label">Brand color (optional)</span>
        <div className="palette-control__master-row">
          <input
            type="color"
            className="palette-control__swatch"
            value={draftIsValid ? normalizeColor(draft) : '#000000'}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Brand color picker"
          />
          <Input
            className="palette-control__hex"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="#4F46E5"
            spellCheck={false}
            aria-label="Brand color hex value"
          />
          <Button variant="secondary" onClick={handleGenerateFromColor} disabled={!draftIsValid}>
            Generate From Color
          </Button>
        </div>
      </div>
    </div>
  )
}
