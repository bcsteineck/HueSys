import { SegmentedControl } from '../../huesys-ui/SegmentedControl'
import type { ColorMode, ColorState } from '../../state/appState'
import { switchColorMode } from '../../state/colorActions'
import { CustomColorControl } from './CustomColorControl'
import { PaletteControl } from './PaletteControl'
import './ColorControl.scss'

export interface ColorControlProps {
  color: ColorState
  onChange: (next: ColorState) => void
}

const MODE_OPTIONS: { value: ColorMode; label: string }[] = [
  { value: 'palette', label: 'Palette' },
  { value: 'custom', label: 'Custom' },
]

/**
 * Palette and Custom are two ways of operating on the same current Brand
 * Palette, not two independently persisted ones — switching modes only
 * changes which controls are visible, never the colors themselves.
 */
export function ColorControl({ color, onChange }: ColorControlProps) {
  return (
    <div className="color-control">
      <div className="color-control__mode">
        <span className="color-control__label">Color Mode</span>
        <SegmentedControl
          aria-label="Color mode"
          options={MODE_OPTIONS}
          value={color.mode}
          onChange={(mode) => onChange(switchColorMode(color, mode))}
        />
      </div>

      {color.mode === 'palette' ? (
        <PaletteControl colors={color.colors} onChange={(next) => onChange({ ...color, ...next })} />
      ) : (
        <CustomColorControl colors={color.colors} onChange={(colors) => onChange({ ...color, colors })} />
      )}
    </div>
  )
}
