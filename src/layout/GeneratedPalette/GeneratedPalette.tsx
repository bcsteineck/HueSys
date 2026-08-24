import { useState } from 'react'
import type { Palette } from '../../theme/color'
import { BrandPalette } from './BrandPalette'
import { NeutralPalette } from './NeutralPalette'
import './GeneratedPalette.scss'

export interface GeneratedPaletteProps {
  palette: Palette
}

/**
 * The visual bridge between Theme Controls (input) and Live Preview
 * (output): here's the palette HueSys generated. Brand Palette shows the
 * five designer colors; Neutral Palette shows the structural colors this
 * same generation produced. Both come straight from the Palette Engine's
 * output — neither one is affected by which Style is currently selected.
 */
export function GeneratedPalette({ palette }: GeneratedPaletteProps) {
  const [announcement, setAnnouncement] = useState('')

  function handleCopy(hex: string) {
    setAnnouncement(`Copied ${hex.toUpperCase()} to clipboard`)
  }

  return (
    <section className="generated-palette" aria-label="Generated palette">
      <h2 className="generated-palette__title">Generated Palette</h2>
      <BrandPalette brand={palette.brand} onCopy={handleCopy} />
      <NeutralPalette neutrals={palette.neutrals} onCopy={handleCopy} />
      <span className="generated-palette__announcer" aria-live="polite">
        {announcement}
      </span>
    </section>
  )
}
