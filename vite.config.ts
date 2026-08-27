import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Off by default, Vitest mocks every CSS/SCSS import as an empty
    // string — including `?raw` imports, which the Export Engine relies
    // on to read real component .scss source (src/export/componentSources.ts).
    // Without this, raw-imported stylesheets silently come back empty
    // under `vitest run` even though the real Vite build handles them
    // correctly.
    css: true,
  },
})
