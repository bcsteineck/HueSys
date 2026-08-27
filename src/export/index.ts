import { buildComponentsOnlyManifest } from './componentsOnly'
import { buildStarterManifest } from './starterProject'
import type { ExportFile } from './types'
import { filesToZipBlob, triggerDownload } from './zip'
import type { Theme } from '../theme/types'

export type ExportResult = { success: true } | { success: false; error: string }

function runExport(buildFiles: () => ExportFile[], filename: string): ExportResult {
  try {
    const blob = filesToZipBlob(buildFiles())
    triggerDownload(blob, filename)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Export failed. Please try again.' }
  }
}

/** Builds and downloads huesys-starter.zip — a complete runnable Vite + React + TypeScript project. */
export function exportStarterProject(theme: Theme, fontId: string): ExportResult {
  return runExport(() => buildStarterManifest(theme, fontId), 'huesys-starter.zip')
}

/** Builds and downloads huesys-components.zip — portable component source for an existing app. */
export function exportComponentsOnly(theme: Theme, fontId: string): ExportResult {
  return runExport(() => buildComponentsOnlyManifest(theme, fontId), 'huesys-components.zip')
}
