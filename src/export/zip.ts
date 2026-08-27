import { strToU8, zipSync } from 'fflate'
import type { ExportFile } from './types'

export function filesToZipBlob(files: ExportFile[]): Blob {
  const input: Record<string, Uint8Array> = {}
  for (const file of files) {
    input[file.path] = strToU8(file.content)
  }
  const zipped = zipSync(input, { level: 6 })
  return new Blob([zipped], { type: 'application/zip' })
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
