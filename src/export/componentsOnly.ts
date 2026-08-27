import { buildComponentAndStyleFiles, buildComponentsBarrel } from './manifestHelpers'
import { buildComponentsOnlyReadme } from './readme'
import type { ExportFile } from './types'
import type { Theme } from '../theme/types'

/**
 * huesys-components/
 * ├── components/<Name>/<Name>.tsx + .scss   (real source, unmodified)
 * ├── styles/_mixins.scss + theme.css
 * ├── index.ts                                (barrel)
 * └── README.md
 */
export function buildComponentsOnlyManifest(theme: Theme, fontId: string): ExportFile[] {
  const files = buildComponentAndStyleFiles(theme, 'components', 'styles')
  files.push({ path: 'index.ts', content: buildComponentsBarrel() })
  files.push({ path: 'README.md', content: buildComponentsOnlyReadme(theme, fontId) })
  return files
}
