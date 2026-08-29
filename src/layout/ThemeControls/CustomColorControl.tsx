import { useState } from 'react'
import { HueSysInput } from '../../huesys-ui/HueSysInput'
import { isValidHexColor, normalizeColor } from '../../theme/color'
import type { BrandPalette } from '../../theme/color'
import './CustomColorControl.scss'

export interface CustomColorControlProps {
  colors: BrandPalette
  onChange: (next: BrandPalette) => void
}

// Ordinal only — Custom mode has no special "Base Color" concept, and the
// internal master/deep/muted/accentA/accentB field names are an
// implementation detail that doesn't need to be exposed in the UI.
const FIELDS: (keyof BrandPalette)[] = ['master', 'deep', 'muted', 'accentA', 'accentB']

interface CustomColorFieldProps {
  label: string
  value: string
  onCommit: (hex: string) => void
}

/**
 * Same draft/commit split as Base Color (PaletteControl): the input is
 * controlled by a local draft, not the canonical hex, so an incomplete
 * value like "#12" can exist on screen without React snapping it back to
 * the last valid color on every keystroke. ColorState/Theme/URL/Undo only
 * ever see a commit once the draft is a genuine six-digit hex. Unlike Base
 * Color, an invalid draft reverts to the canonical value on blur rather
 * than being left on screen — Custom's own explicit spec, not something
 * Base Color currently does.
 */
function CustomColorField({ label, value, onCommit }: CustomColorFieldProps) {
  const [draft, setDraft] = useState(`#${value.replace('#', '')}`)

  // Keep the draft in sync whenever the committed color changes from
  // elsewhere (switching away and back to Custom, Undo/Redo, browser
  // navigation). Adjusted during render, per React's own guidance for
  // resetting local state when a prop changes.
  const [syncedValue, setSyncedValue] = useState(value)
  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(`#${value.replace('#', '')}`)
  }

  function handleDraftChange(next: string) {
    setDraft(next)
    if (isValidHexColor(next)) {
      onCommit(normalizeColor(next))
    }
  }

  function handleBlur() {
    if (!isValidHexColor(draft)) {
      setDraft(`#${value.replace('#', '')}`)
    }
  }

  const draftIsValid = isValidHexColor(draft)

  return (
    <div className="custom-color-control__field">
      <input
        type="color"
        className="custom-color-control__swatch"
        value={draftIsValid ? normalizeColor(draft) : value}
        onChange={(event) => handleDraftChange(event.target.value)}
        aria-label={`${label} picker`}
      />
      <HueSysInput
        className="custom-color-control__hex"
        value={draft}
        onChange={(event) => handleDraftChange(event.target.value)}
        onBlur={handleBlur}
        spellCheck={false}
        aria-label={`${label} hex value`}
      />
    </div>
  )
}

/**
 * Direct editing of all five Brand Palette colors — kept at roughly the
 * same visual footprint as the read-only Brand Palette swatches so
 * switching modes doesn't reshuffle the panel.
 */
export function CustomColorControl({ colors, onChange }: CustomColorControlProps) {
  return (
    <div className="custom-color-control" role="group" aria-label="Custom brand colors">
      {FIELDS.map((key, index) => (
        <CustomColorField
          key={key}
          label={`Color ${index + 1}`}
          value={colors[key]}
          onCommit={(hex) => onChange({ ...colors, [key]: hex })}
        />
      ))}
    </div>
  )
}
