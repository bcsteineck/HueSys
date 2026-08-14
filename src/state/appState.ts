/**
 * Application state, mirrored in the URL (?color=&theme=&font=).
 * Phase 1 only establishes the shape and the read/write pattern —
 * theme generation and controls that mutate this state arrive in later phases.
 */
export interface AppState {
  color: string
  themeIndex: number
  font: string
}

export const defaultAppState: AppState = {
  color: '4f46e5',
  themeIndex: 0,
  font: 'inter',
}
