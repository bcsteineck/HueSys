/**
 * Phase 2B keeps typography simple: one font family for the whole design
 * system, selected by a font id. Real font choice/switching UI is Phase 4.
 */
const FONT_STACKS: Record<string, string> = {
  inter: "'Inter', system-ui, sans-serif",
}

export const DEFAULT_FONT_ID = 'inter'

export function resolveFontFamily(fontId: string): string {
  return FONT_STACKS[fontId] ?? FONT_STACKS[DEFAULT_FONT_ID]
}
