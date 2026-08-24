import { useEffect, useState } from 'react'

export interface PaletteSwatchProps {
  hex: string
  /** Permanent caption below the swatch (e.g. "Background") — omitted for Brand Palette swatches, which stay unlabeled. */
  label?: string
  onCopy: (hex: string) => void
}

const COPIED_FEEDBACK_DURATION_MS = 1000

/**
 * A single interactive palette swatch: hover/focus reveals its hex value,
 * clicking (or Enter/Space) copies it and shows "Copied!" feedback for
 * ~1s, scoped to that swatch alone. Shared by the Brand and Neutral
 * palettes so the copy interaction only exists once.
 */
export function PaletteSwatch({ hex, label, onCopy }: PaletteSwatchProps) {
  const [copied, setCopied] = useState(false)

  // Cancel any pending "Copied!" feedback if the color itself changes
  // underneath this swatch (e.g. a new primary color was picked) rather
  // than let stale feedback linger over what's now a different color.
  // Adjusted during render, per React's own guidance for resetting local
  // state when a prop changes — not an effect, which would fire a
  // redundant extra render.
  const [syncedHex, setSyncedHex] = useState(hex)
  if (hex !== syncedHex) {
    setSyncedHex(hex)
    setCopied(false)
  }

  useEffect(() => {
    if (!copied) return
    const timeoutId = window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_DURATION_MS)
    return () => window.clearTimeout(timeoutId)
  }, [copied])

  function handleClick() {
    navigator.clipboard?.writeText(hex).catch(() => {})
    setCopied(true)
    onCopy(hex)
  }

  const value = hex.toUpperCase()
  const accessibleName = label ? `Copy ${label}, ${value}` : `Copy ${value}`
  const classes = ['palette-swatch__button', copied && 'palette-swatch__button--copied'].filter(Boolean).join(' ')

  return (
    <div className="palette-swatch">
      <button
        type="button"
        className={classes}
        style={{ backgroundColor: hex }}
        onClick={handleClick}
        aria-label={copied ? `Copied ${value}` : accessibleName}
      >
        <span className="palette-swatch__overlay">{copied ? '✓ Copied!' : value}</span>
      </button>
    </div>
  )
}
