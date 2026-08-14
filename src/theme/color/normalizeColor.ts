const HEX_COLOR_PATTERN = /^#?([0-9a-fA-F]{6})$/

/** Fallback used whenever input can't be parsed as a six-digit hex color. */
export const DEFAULT_PRIMARY_COLOR = '#4f46e5'

/**
 * Normalizes a six-digit hex color to a consistent '#rrggbb' lowercase
 * form. Input that isn't a valid six-digit hex color falls back to the
 * default primary color rather than throwing — this is expected to run
 * against user-editable input (URL params, form fields).
 */
export function normalizeColor(input: string): string {
  const match = HEX_COLOR_PATTERN.exec(input.trim())
  if (!match) return DEFAULT_PRIMARY_COLOR
  return `#${match[1].toLowerCase()}`
}

/**
 * Checks whether input is already a valid six-digit hex color, without
 * falling back to a default. Used by live-typing UI that needs to know
 * "is this worth committing yet?" rather than "give me some color".
 */
export function isValidHexColor(input: string): boolean {
  return HEX_COLOR_PATTERN.test(input.trim())
}
