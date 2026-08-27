// Reads the literal, current source of every generated component and its
// one shared stylesheet dependency at build time, via Vite's `?raw` import
// query. This is the Export Engine's only "reuse the real implementation"
// mechanism — nothing here re-derives or hand-copies component markup or
// styles (see docs/02-architecture.md's "one implementation per component"
// rule). `import.meta.glob` (rather than 20 individual imports) means a
// future 11th generated component is picked up automatically.
import sharedMixinsScss from '../styles/_mixins.scss?raw'

export interface ComponentSource {
  /** Folder/component name, e.g. "Button". */
  name: string
  tsxFileName: string
  tsxContent: string
  scssFileName: string
  scssContent: string
}

const tsxModules = import.meta.glob('../components/*/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const scssModules = import.meta.glob('../components/*/*.scss', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function splitPath(path: string): { folder: string; fileName: string } {
  const parts = path.split('/')
  return { folder: parts[parts.length - 2], fileName: parts[parts.length - 1] }
}

function byComponentFolder(modules: Record<string, string>): Map<string, { fileName: string; content: string }> {
  const map = new Map<string, { fileName: string; content: string }>()
  for (const [path, content] of Object.entries(modules)) {
    const { folder, fileName } = splitPath(path)
    map.set(folder, { fileName, content })
  }
  return map
}

const tsxByComponent = byComponentFolder(tsxModules)
const scssByComponent = byComponentFolder(scssModules)

/** Every generated/exportable component's real source, sorted by name for deterministic output. */
export const componentSources: ComponentSource[] = Array.from(tsxByComponent.keys())
  .sort()
  .map((name) => {
    const tsx = tsxByComponent.get(name)
    const scss = scssByComponent.get(name)
    if (!tsx || !scss) {
      throw new Error(`Export Engine: component "${name}" is missing its .tsx or .scss file`)
    }
    return { name, tsxFileName: tsx.fileName, tsxContent: tsx.content, scssFileName: scss.fileName, scssContent: scss.content }
  })

/** The one shared stylesheet dependency generated components use (focus-ring, field-base) — already export-safe, no --huesys-* tokens. */
export const sharedMixinsScssContent = sharedMixinsScss
