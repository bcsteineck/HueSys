import type { ChangeEvent } from 'react'
import { Select } from '../../components/Select/Select'
import { fontOptions } from '../../theme/fonts'
import type { FontSize, FontWeight, TypographyState } from '../../state/appState'

export interface TypographyControlProps {
  typography: TypographyState
  onChange: (next: TypographyState) => void
}

const SIZE_OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

const WEIGHT_OPTIONS: { value: FontWeight; label: string }[] = [
  { value: 'regular', label: 'Regular' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semibold' },
]

export function TypographyControl({ typography, onChange }: TypographyControlProps) {
  return (
    <div className="typography-control">
      <label className="typography-control__field">
        <span className="typography-control__field-label">Font</span>
        <Select
          aria-label="Font"
          value={typography.font}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange({ ...typography, font: event.target.value })}
        >
          {fontOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>

      <label className="typography-control__field">
        <span className="typography-control__field-label">Font Size</span>
        <Select
          aria-label="Font size"
          value={typography.size}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange({ ...typography, size: event.target.value as FontSize })}
        >
          {SIZE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>

      <label className="typography-control__field">
        <span className="typography-control__field-label">Font Weight</span>
        <Select
          aria-label="Font weight"
          value={typography.weight}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange({ ...typography, weight: event.target.value as FontWeight })}
        >
          {WEIGHT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>
    </div>
  )
}
