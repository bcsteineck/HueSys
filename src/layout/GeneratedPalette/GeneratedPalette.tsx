import { useState } from 'react'
import type { Palette } from '../../theme/color'
import { BrandPalette } from './BrandPalette'
import { NeutralPalette } from './NeutralPalette'
import { SemanticPalette } from './SemanticPalette'
import './GeneratedPalette.scss'

export interface GeneratedPaletteProps {
  palette: Palette
  /**
   * In Custom mode, the Custom color editor already occupies the Brand
   * Palette's visual footprint — showing this read-only copy alongside it
   * would just duplicate the same five colors. Neutral Palette remains
   * useful either way, since it's always derived/read-only.
   */
  showBrandPalette?: boolean
}

/**
 * The visual bridge between Theme Controls (input) and Live Preview
 * (output): here's the palette HueSys generated. Brand Palette shows the
 * five designer colors; Neutral Palette shows the structural colors this
 * same generation produced; Semantic Palette shows the derived colors with
 * UI meaning (Info/Success/Warning/Danger — not Accent, which already
 * appears in Brand Palette). All three come straight from the Palette
 * Engine's output — none is affected by which Style is currently
 * selected, and Semantic Palette stays visible in both Palette and Custom
 * mode since it's always derived/read-only, same as Neutral Palette.
 */
export function GeneratedPalette({ palette, showBrandPalette = true }: GeneratedPaletteProps) {
  const [announcement, setAnnouncement] = useState('')

  function handleCopy(hex: string) {
    setAnnouncement(`Copied ${hex.toUpperCase()} to clipboard`)
  }

  return (
    <section className="generated-palette" aria-label="Generated palette">
      <h2 className="generated-palette__title">Generated Palette</h2>
      {showBrandPalette && <BrandPalette brand={palette.brand} onCopy={handleCopy} />}
      <NeutralPalette neutrals={palette.neutrals} onCopy={handleCopy} />
      <SemanticPalette semantic={palette.semantic} onCopy={handleCopy} />
      <span className="generated-palette__announcer" aria-live="polite">
        {announcement}
      </span>
    </section>
  )
}
