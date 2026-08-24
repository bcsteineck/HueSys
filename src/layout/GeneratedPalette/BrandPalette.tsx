import type { Palette } from '../../theme/color'
import { PaletteSwatch } from './PaletteSwatch'

export interface BrandPaletteProps {
  brand: Palette['brand']
  onCopy: (hex: string) => void
}

export function BrandPalette({ brand, onCopy }: BrandPaletteProps) {
  const swatches = [brand.master, brand.deep, brand.muted, brand.accentA, brand.accentB]

  return (
    <div className="generated-palette__group">
      <h3 className="generated-palette__label">Brand Palette</h3>
      <div className="generated-palette__row">
        {swatches.map((hex, index) => (
          <PaletteSwatch key={index} hex={hex} onCopy={onCopy} />
        ))}
      </div>
    </div>
  )
}
