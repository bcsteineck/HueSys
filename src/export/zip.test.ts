import { strFromU8, unzipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import { filesToZipBlob } from './zip'
import type { ExportFile } from './types'

async function blobToUint8(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer())
}

describe('filesToZipBlob', () => {
  it('round-trips file paths and content exactly', async () => {
    const files: ExportFile[] = [
      { path: 'README.md', content: '# Hello\n' },
      { path: 'src/components/Button/Button.tsx', content: 'export function Button() {}\n' },
    ]
    const blob = filesToZipBlob(files)
    const unzipped = unzipSync(await blobToUint8(blob))

    expect(Object.keys(unzipped).sort()).toEqual(files.map((f) => f.path).sort())
    for (const file of files) {
      expect(strFromU8(unzipped[file.path])).toBe(file.content)
    }
  })

  it('produces a Blob with the application/zip type', () => {
    const blob = filesToZipBlob([{ path: 'a.txt', content: 'a' }])
    expect(blob.type).toBe('application/zip')
  })
})
