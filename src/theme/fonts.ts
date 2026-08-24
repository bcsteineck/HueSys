export interface FontDefinition {
  id: string
  label: string
  family: string
  /** Numeric weights this font actually ships. Used to resolve a requested weight to the nearest one the font supports, rather than relying on browser synthesis. */
  supportedWeights: number[]
}

/**
 * The curated font collection — versatile, high-quality options spanning
 * the categories a generated design system needs, not an exhaustive font
 * browser. Hosted fonts (everything but System UI and Georgia) are loaded
 * once, centrally, in index.html; nothing here triggers its own font
 * request. An exported project can freely swap any `family` value for its
 * own font later — this is the whole reason it stays a single flat value
 * rather than something more elaborate.
 */
export const fontOptions: FontDefinition[] = [
  // Modern sans-serif
  { id: 'inter', label: 'Inter', family: "'Inter', system-ui, sans-serif", supportedWeights: [400, 500, 600, 700] },
  { id: 'work-sans', label: 'Work Sans', family: "'Work Sans', system-ui, sans-serif", supportedWeights: [400, 500, 600, 700] },
  // Geometric sans-serif
  { id: 'sora', label: 'Sora', family: "'Sora', system-ui, sans-serif", supportedWeights: [400, 500, 600, 700] },
  { id: 'space-grotesk', label: 'Space Grotesk', family: "'Space Grotesk', system-ui, sans-serif", supportedWeights: [400, 500, 600, 700] },
  // Humanist sans-serif
  { id: 'nunito', label: 'Nunito', family: "'Nunito', system-ui, sans-serif", supportedWeights: [400, 500, 600, 700, 800] },
  { id: 'system', label: 'System UI', family: "system-ui, -apple-system, 'Segoe UI', sans-serif", supportedWeights: [400, 500, 600, 700] },
  // Serif
  { id: 'merriweather', label: 'Merriweather', family: "'Merriweather', Georgia, serif", supportedWeights: [300, 400, 700, 900] },
  { id: 'georgia', label: 'Georgia', family: "Georgia, 'Times New Roman', serif", supportedWeights: [400, 700] },
  // Display-oriented but UI-usable
  { id: 'playfair-display', label: 'Playfair Display', family: "'Playfair Display', Georgia, serif", supportedWeights: [400, 500, 600, 700, 800, 900] },
  // Monospace
  { id: 'jetbrains-mono', label: 'JetBrains Mono', family: "'JetBrains Mono', 'SF Mono', Consolas, monospace", supportedWeights: [400, 500, 600, 700, 800] },
]

export const DEFAULT_FONT_ID = fontOptions[0].id

export function getFont(fontId: string): FontDefinition {
  return fontOptions.find((option) => option.id === fontId) ?? fontOptions[0]
}

export function resolveFontFamily(fontId: string): string {
  return getFont(fontId).family
}

/** The requested weight if the font ships it, otherwise the nearest weight it does ship. */
export function resolveFontWeight(fontId: string, requestedWeight: number): number {
  const { supportedWeights } = getFont(fontId)
  return supportedWeights.reduce((closest, weight) =>
    Math.abs(weight - requestedWeight) < Math.abs(closest - requestedWeight) ? weight : closest,
  )
}
