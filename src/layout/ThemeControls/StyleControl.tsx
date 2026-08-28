import type { ChangeEvent } from 'react'
import { HueSysSelect } from '../../huesys-ui/HueSysSelect'
import type { BorderRadius, Spacing, StyleState } from '../../state/appState'
import './StyleControl.scss'

export interface StyleControlProps {
  style: StyleState
  onChange: (next: StyleState) => void
}

const RADIUS_OPTIONS: { value: BorderRadius; label: string }[] = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'soft', label: 'Soft' },
  { value: 'rounded', label: 'Rounded' },
]

const SPACING_OPTIONS: { value: Spacing; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'medium', label: 'Medium' },
  { value: 'spacious', label: 'Spacious' },
]

export function StyleControl({ style, onChange }: StyleControlProps) {
  return (
    <div className="style-control">
      <label className="style-control__field">
        <span className="style-control__field-label">Border Radius</span>
        <HueSysSelect
          aria-label="Border radius"
          value={style.radius}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange({ ...style, radius: event.target.value as BorderRadius })}
        >
          {RADIUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </HueSysSelect>
      </label>

      <label className="style-control__field">
        <span className="style-control__field-label">Spacing</span>
        <HueSysSelect
          aria-label="Spacing"
          value={style.spacing}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange({ ...style, spacing: event.target.value as Spacing })}
        >
          {SPACING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </HueSysSelect>
      </label>
    </div>
  )
}
