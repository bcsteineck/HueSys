import { COMPONENT_API } from './componentApi'
import { componentSources, sharedMixinsScssContent } from './componentSources'
import { serializeThemeCss } from './serializeTheme'
import type { ExportFile } from './types'
import type { Theme } from '../theme/types'

/**
 * The 10 generated components plus their one shared stylesheet dependency
 * and the resolved theme.css, rooted at `componentsDir` (e.g.
 * "src/components" for the Starter Project or "components" for
 * Components-Only) with styles at `stylesDir` (e.g. "src/styles" or
 * "styles"). Both export targets keep the same relative nesting depth
 * from a component folder to its styles sibling as the real repo does, so
 * the raw component source (which still says `@use '../../styles/mixins'`)
 * needs no import-path rewriting in either target.
 */
export function buildComponentAndStyleFiles(theme: Theme, componentsDir: string, stylesDir: string): ExportFile[] {
  const files: ExportFile[] = []
  for (const component of componentSources) {
    files.push({ path: `${componentsDir}/${component.name}/${component.tsxFileName}`, content: component.tsxContent })
    files.push({ path: `${componentsDir}/${component.name}/${component.scssFileName}`, content: component.scssContent })
  }
  files.push({ path: `${stylesDir}/_mixins.scss`, content: sharedMixinsScssContent })
  files.push({ path: `${stylesDir}/theme.css`, content: serializeThemeCss(theme) })
  return files
}

/** `export { Button } from './components/Button/Button'` etc., following the project's own named-export style. */
export function buildComponentsBarrel(): string {
  const lines: string[] = []
  for (const component of componentSources) {
    const api = COMPONENT_API[component.name]
    if (!api) {
      throw new Error(`Export Engine: no COMPONENT_API entry for "${component.name}"`)
    }
    lines.push(`export { ${api.values.join(', ')} } from './components/${component.name}/${component.name}'`)
    if (api.types.length > 0) {
      lines.push(`export type { ${api.types.join(', ')} } from './components/${component.name}/${component.name}'`)
    }
  }
  return lines.join('\n') + '\n'
}
