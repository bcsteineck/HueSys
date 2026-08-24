import { Button } from '../../components/Button/Button'
import type { ColorState } from '../../state/appState'
import { switchColorMode } from '../../state/colorActions'
import { CustomColorControl } from './CustomColorControl'
import { PaletteControl } from './PaletteControl'

export interface ColorControlProps {
  color: ColorState
  onChange: (next: ColorState) => void
}

/**
 * Palette and Custom are independent: switching modes never discards
 * either one's state, it only changes which is active. Custom seeds its
 * five colors from the current Palette the first time it's opened
 * (handled by switchColorMode) and is left alone after that.
 */
export function ColorControl({ color, onChange }: ColorControlProps) {
  return (
    <div className="color-control">
      <div className="color-control__mode" role="group" aria-label="Color mode">
        <Button
          variant={color.mode === 'palette' ? 'primary' : 'secondary'}
          aria-pressed={color.mode === 'palette'}
          onClick={() => onChange(switchColorMode(color, 'palette'))}
        >
          Palette
        </Button>
        <Button
          variant={color.mode === 'custom' ? 'primary' : 'secondary'}
          aria-pressed={color.mode === 'custom'}
          onClick={() => onChange(switchColorMode(color, 'custom'))}
        >
          Custom
        </Button>
      </div>

      {color.mode === 'palette' ? (
        <PaletteControl palette={color.palette} onChange={(palette) => onChange({ ...color, palette })} />
      ) : (
        <CustomColorControl colors={color.custom.colors} onChange={(colors) => onChange({ ...color, custom: { colors } })} />
      )}
    </div>
  )
}
