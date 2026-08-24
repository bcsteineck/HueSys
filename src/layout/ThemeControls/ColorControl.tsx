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
 * Palette and Custom are independent: switching modes never discards
 * either one's state, it only changes which is active. Custom seeds its
 * five colors from the current Palette the first time it's opened
 * (handled by switchColorMode) and is left alone after that.
 */
export function ColorControl({ color, onChange }: ColorControlProps) {
  return (
    <div className="color-control">
      <SegmentedControl
        aria-label="Color mode"
        options={MODE_OPTIONS}
        value={color.mode}
        onChange={(mode) => onChange(switchColorMode(color, mode))}
      />

      {color.mode === 'palette' ? (
        <PaletteControl palette={color.palette} onChange={(palette) => onChange({ ...color, palette })} />
      ) : (
        <CustomColorControl colors={color.custom.colors} onChange={(colors) => onChange({ ...color, custom: { colors } })} />
      )}
    </div>
  )
}
