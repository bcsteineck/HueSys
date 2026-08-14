export interface FontOption {
  id: string
  label: string
  fontFamily: string
}

/**
 * The curated font list. Every option is a system-installed stack (no
 * webfont loading), so switching fonts stays instant and dependency-free.
 * Typography stays otherwise simple: one family for the whole system.
 */
export const fontOptions: FontOption[] = [
  { id: 'inter', label: 'Inter', fontFamily: "'Inter', system-ui, sans-serif" },
  { id: 'system', label: 'System UI', fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
  { id: 'georgia', label: 'Georgia', fontFamily: "Georgia, 'Times New Roman', serif" },
  { id: 'mono', label: 'Monospace', fontFamily: "'SF Mono', 'Cascadia Code', Consolas, monospace" },
]

export const DEFAULT_FONT_ID = fontOptions[0].id

export function resolveFontFamily(fontId: string): string {
  return fontOptions.find((option) => option.id === fontId)?.fontFamily ?? fontOptions[0].fontFamily
}
