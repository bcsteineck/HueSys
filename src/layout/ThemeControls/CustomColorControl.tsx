import { Input } from '../../components/Input/Input'
import { isValidHexColor, normalizeColor } from '../../theme/color'
import type { BrandPalette } from '../../theme/color'

export interface CustomColorControlProps {
  colors: BrandPalette
  onChange: (next: BrandPalette) => void
}

const FIELDS: { key: keyof BrandPalette; label: string }[] = [
  { key: 'master', label: 'Base' },
  { key: 'deep', label: 'Deep' },
  { key: 'muted', label: 'Muted' },
  { key: 'accentA', label: 'Accent A' },
  { key: 'accentB', label: 'Accent B' },
]

/**
 * Direct editing of all five Brand Palette colors. A temporary,
 * unstyled-for-Figma control for Stage A verification — the real Custom
 * editing experience belongs to Stage C.
 */
export function CustomColorControl({ colors, onChange }: CustomColorControlProps) {
  function handleFieldChange(key: keyof BrandPalette, value: string) {
    if (!isValidHexColor(value)) return
    onChange({ ...colors, [key]: normalizeColor(value) })
  }

  return (
    <div className="custom-color-control">
      {FIELDS.map(({ key, label }) => (
        <div className="custom-color-control__field" key={key}>
          <input
            type="color"
            value={colors[key]}
            onChange={(event) => handleFieldChange(key, event.target.value)}
            aria-label={`${label} color picker`}
          />
          <Input
            value={colors[key]}
            onChange={(event) => handleFieldChange(key, event.target.value)}
            spellCheck={false}
            aria-label={`${label} hex value`}
            placeholder={label}
          />
        </div>
      ))}
    </div>
  )
}
