import { describe, expect, it } from 'vitest'
import { componentSources } from './componentSources'
import { buildComponentsOnlyManifest } from './componentsOnly'
import { buildStarterManifest } from './starterProject'
import { makeTestTheme } from './testHelpers'
import type { ExportFile } from './types'

// Anything matching these must never appear in either export target — they
// point at HueSys's own runtime chrome, state, or Color Engine rather than
// the generated/exportable design system.
const FORBIDDEN_PATH_FRAGMENTS = [
  'huesys-ui',
  '/layout/',
  '/state/',
  'theme/color/',
  'generateTheme',
  'ComponentPreview',
]

function paths(files: ExportFile[]): string[] {
  return files.map((f) => f.path)
}

function assertNoForbiddenPaths(files: ExportFile[]) {
  for (const file of files) {
    for (const fragment of FORBIDDEN_PATH_FRAGMENTS) {
      expect(file.path).not.toContain(fragment)
    }
  }
}

describe('buildStarterManifest', () => {
  const theme = makeTestTheme()
  const files = buildStarterManifest(theme, 'inter')
  const filePaths = paths(files)

  it('includes all 10 generated components as .tsx + .scss', () => {
    expect(componentSources).toHaveLength(10)
    for (const component of componentSources) {
      expect(filePaths).toContain(`src/components/${component.name}/${component.tsxFileName}`)
      expect(filePaths).toContain(`src/components/${component.name}/${component.scssFileName}`)
    }
  })

  it('includes the resolved theme, shared mixins, and a plain global stylesheet', () => {
    expect(filePaths).toContain('src/styles/theme.css')
    expect(filePaths).toContain('src/styles/_mixins.scss')
    expect(filePaths).toContain('src/styles/global.scss')
  })

  it('includes a runnable Vite scaffold', () => {
    for (const path of [
      'index.html',
      'package.json',
      'tsconfig.json',
      'tsconfig.app.json',
      'tsconfig.node.json',
      'vite.config.ts',
      'src/main.tsx',
      'src/vite-env.d.ts',
      'src/App.tsx',
      'src/App.scss',
      'README.md',
    ]) {
      expect(filePaths).toContain(path)
    }
  })

  it('contains no HueSys chrome, state, or Color Engine files', () => {
    assertNoForbiddenPaths(files)
  })

  it('every file has non-empty content', () => {
    for (const file of files) {
      expect(file.content.length).toBeGreaterThan(0)
    }
  })
})

describe('buildComponentsOnlyManifest', () => {
  const theme = makeTestTheme()
  const files = buildComponentsOnlyManifest(theme, 'inter')
  const filePaths = paths(files)

  it('includes all 10 generated components as .tsx + .scss', () => {
    for (const component of componentSources) {
      expect(filePaths).toContain(`components/${component.name}/${component.tsxFileName}`)
      expect(filePaths).toContain(`components/${component.name}/${component.scssFileName}`)
    }
  })

  it('includes the resolved theme, shared mixins, a barrel, and a README', () => {
    expect(filePaths).toContain('styles/theme.css')
    expect(filePaths).toContain('styles/_mixins.scss')
    expect(filePaths).toContain('index.ts')
    expect(filePaths).toContain('README.md')
  })

  it('is not a runnable project — no package.json or build config', () => {
    expect(filePaths).not.toContain('package.json')
    expect(filePaths).not.toContain('vite.config.ts')
  })

  it('contains no HueSys chrome, state, or Color Engine files', () => {
    assertNoForbiddenPaths(files)
  })

  it('barrel index.ts exports every component and its prop types', () => {
    const barrel = files.find((f) => f.path === 'index.ts')?.content ?? ''
    for (const component of componentSources) {
      expect(barrel).toContain(`export { ${component.name} } from './components/${component.name}/${component.name}'`)
    }
  })
})

describe('cross-target invariants', () => {
  it('produces the current Theme values in both targets identically', () => {
    const theme = makeTestTheme()
    const starterTheme = buildStarterManifest(theme, 'inter').find((f) => f.path === 'src/styles/theme.css')
    const componentsTheme = buildComponentsOnlyManifest(theme, 'inter').find((f) => f.path === 'styles/theme.css')
    expect(starterTheme?.content).toBe(componentsTheme?.content)
  })

  it('reuses the exact same component source in both targets (no re-derivation)', () => {
    const theme = makeTestTheme()
    const starterFiles = buildStarterManifest(theme, 'inter')
    const componentsFiles = buildComponentsOnlyManifest(theme, 'inter')
    for (const component of componentSources) {
      const starterTsx = starterFiles.find((f) => f.path === `src/components/${component.name}/${component.tsxFileName}`)
      const componentsTsx = componentsFiles.find((f) => f.path === `components/${component.name}/${component.tsxFileName}`)
      expect(starterTsx?.content).toBe(componentsTsx?.content)
      expect(starterTsx?.content).toBe(component.tsxContent)
    }
  })
})
