import { useEffect, useRef, useState, type FocusEvent } from 'react'

export interface PaletteSwatchProps {
  hex: string
  /**
   * Used to build the accessible name (e.g. "Copy Background, #F4F5F8")
   * regardless of `showLabel`. Omitted for Brand Palette swatches, which
   * stay unlabeled even accessibly — they're presented as a set, not
   * individually named roles.
   */
  label?: string
  /**
   * Also renders `label` as a visible caption below the swatch — for
   * palettes like Semantic where the role name itself (Success/Warning/
   * Danger) is the meaningful part, not just the color. Off by default so
   * Brand/Neutral's existing unlabeled presentation is unaffected.
   */
  showLabel?: boolean
  onCopy: (hex: string) => void
}

const COPIED_FEEDBACK_DURATION_MS = 1000

// Anchors the centered tooltip at least this far from the viewport edge
// without needing to measure the tooltip's own (variable) width first.
const TOOLTIP_EDGE_MARGIN_PX = 48

interface TooltipPosition {
  top: number
  left: number
}

/**
 * A single interactive palette swatch: hover/focus reveals a hex tooltip,
 * clicking (or Enter/Space) copies it and shows "Copied!" feedback for
 * ~1s. Shared by the Brand, Semantic, and Neutral palettes so the copy
 * interaction only exists once. The tooltip is `position: fixed` (computed
 * from the button's own bounding box) specifically so it's never clipped
 * by the Options Panel's scrollable container.
 */
export function PaletteSwatch({ hex, label, showLabel, onCopy }: PaletteSwatchProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [copied, setCopied] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [keyboardFocused, setKeyboardFocused] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null)

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

  const tooltipVisible = hovering || keyboardFocused || copied

  useEffect(() => {
    if (!tooltipVisible) return

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const idealLeft = rect.left + rect.width / 2
      const left = Math.min(Math.max(idealLeft, TOOLTIP_EDGE_MARGIN_PX), window.innerWidth - TOOLTIP_EDGE_MARGIN_PX)
      setTooltipPos({ top: rect.top, left })
    }

    updatePosition()
    // Capture phase so this also catches scrolling inside the Options
    // Panel's own scroll container, not just window-level scrolling.
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [tooltipVisible])

  function handleClick() {
    navigator.clipboard?.writeText(hex).catch(() => {})
    setCopied(true)
    onCopy(hex)
  }

  function handleFocus(event: FocusEvent<HTMLButtonElement>) {
    if (event.currentTarget.matches(':focus-visible')) setKeyboardFocused(true)
  }

  const value = hex.toUpperCase()
  const accessibleName = label ? `Copy ${label}, ${value}` : `Copy ${value}`

  return (
    <div className="palette-swatch">
      <button
        ref={buttonRef}
        type="button"
        className="palette-swatch__button"
        style={{ backgroundColor: hex }}
        onClick={handleClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={handleFocus}
        onBlur={() => setKeyboardFocused(false)}
        aria-label={copied ? `Copied ${value}` : accessibleName}
      />
      {tooltipVisible && tooltipPos && (
        <span
          className="palette-swatch__tooltip"
          style={{ top: tooltipPos.top, left: tooltipPos.left }}
          aria-hidden="true"
        >
          {copied ? 'Copied!' : value}
        </span>
      )}
      {showLabel && label && <span className="palette-swatch__label">{label}</span>}
    </div>
  )
}
