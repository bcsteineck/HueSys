/**
 * Application state, mirrored in the URL (?color=&master=&seed=&style=&font=).
 * Palette and Style are deliberately independent: regenerating the
 * palette never touches styleIndex, and changing styleIndex never touches
 * the palette fields.
 */
export interface AppState {
  /** The color currently anchoring the palette — always present, whether it was typed by the user or generated randomly. */
  anchorColor: string
  /** Whether anchorColor was explicitly supplied by the user (Workflow B) rather than picked randomly by HueSys (Workflow A). Purely a UI/provenance concern — the Palette Engine treats anchorColor the same either way. */
  hasMasterColor: boolean
  /** Varies the palette's non-anchor roles across repeated generations from the same anchorColor. Not user-facing; regenerated whenever the user asks for a new palette. */
  paletteSeed: number
  styleIndex: number
  font: string
}

export const defaultAppState: AppState = {
  anchorColor: '4f46e5',
  hasMasterColor: true,
  paletteSeed: 0,
  styleIndex: 0,
  font: 'inter',
}
