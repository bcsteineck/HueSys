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

/**
 * Direct editing of all five Brand Palette colors — kept at roughly the
 * same visual footprint as the read-only Brand Palette swatches so
 * switching modes doesn't reshuffle the panel.
 */
export function CustomColorControl({ colors, onChange }: CustomColorControlProps) {
  function handleFieldChange(key: keyof BrandPalette, value: string) {
    if (!isValidHexColor(value)) return
    onChange({ ...colors, [key]: normalizeColor(value) })
  }

  return (
    <div className="custom-color-control" role="group" aria-label="Custom brand colors">
      {FIELDS.map((key, index) => (
        <div className="custom-color-control__field" key={key}>
          <input
            type="color"
            className="custom-color-control__swatch"
            value={colors[key]}
            onChange={(event) => handleFieldChange(key, event.target.value)}
            aria-label={`Color ${index + 1} picker`}
          />
          <HueSysInput
            className="custom-color-control__hex"
            value={colors[key]}
            onChange={(event) => handleFieldChange(key, event.target.value)}
            spellCheck={false}
            aria-label={`Color ${index + 1} hex value`}
          />
        </div>
      ))}
    </div>
  )
}
