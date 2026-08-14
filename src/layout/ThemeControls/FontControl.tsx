import type { ChangeEvent } from 'react'
import { Select } from '../../components/Select/Select'
import { fontOptions } from '../../theme/fonts'

export interface FontControlProps {
  font: string
  onChange: (font: string) => void
}

export function FontControl({ font, onChange }: FontControlProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value)
  }

  return (
    <Select aria-label="Font" value={font} onChange={handleChange}>
      {fontOptions.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
