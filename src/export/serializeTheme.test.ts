import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { serializeThemeCss } from './serializeTheme'
import { makeTestTheme } from './testHelpers'

const UNCONSUMED_VARIABLES = [
  '--color-accent:',
  '--color-accent-text:',
  '--color-success-strong:',
  '--color-success-strong-text:',
  '--color-warning-strong:',
  '--color-warning-strong-text:',
  '--color-danger-strong:',
  '--color-danger-strong-text:',
  '--font-size-lg:',
]

function everyRealVarUsage(): Set<string> {
  const componentsDir = join(import.meta.dirname, '../components')
  const mixinsPath = join(import.meta.dirname, '../styles/_mixins.scss')
  const used = new Set<string>()
  const pattern = /var\((--[a-z0-9-]+)/g

  function scan(text: string) {
    for (const match of text.matchAll(pattern)) used.add(match[1])
  }

  scan(readFileSync(mixinsPath, 'utf-8'))
  for (const componentDir of readdirSync(componentsDir)) {
    const scssPath = join(componentsDir, componentDir, `${componentDir}.scss`)
    try {
      scan(readFileSync(scssPath, 'utf-8'))
    } catch {
      // component has no .scss file — nothing to scan
    }
  }
  return used
}

describe('serializeThemeCss', () => {
  it('is deterministic for the same Theme', () => {
    const theme = makeTestTheme()
    expect(serializeThemeCss(theme)).toBe(serializeThemeCss(theme))
  })

  it('produces a valid :root block with a trailing newline', () => {
    const css = serializeThemeCss(makeTestTheme())
    expect(css.startsWith(':root {\n')).toBe(true)
    expect(css.endsWith('}\n')).toBe(true)
  })

  it('excludes variables no real component consumes', () => {
    const css = serializeThemeCss(makeTestTheme())
    for (const unconsumed of UNCONSUMED_VARIABLES) {
      expect(css).not.toContain(unconsumed)
    }
  })

  it('includes the current Theme values, not placeholders', () => {
    const theme = makeTestTheme()
    const css = serializeThemeCss(theme)
    expect(css).toContain(`--color-primary: ${theme.colors.primary};`)
    expect(css).toContain(`--font-family: ${theme.typography.fontFamily};`)
    expect(css).toContain(`--radius-md: ${theme.radius.md};`)
    expect(css).toContain(`--space-3: ${theme.spacing.space3};`)
  })

  it('is a superset of every CSS variable the real component library actually uses', () => {
    const css = serializeThemeCss(makeTestTheme())
    const realUsage = everyRealVarUsage()
    const missing = Array.from(realUsage).filter((name) => !css.includes(`${name}:`))
    expect(missing).toEqual([])
  })

  it('reflects a font family containing an apostrophe without throwing', () => {
    const theme = makeTestTheme({ typography: { font: 'inter' } })
    expect(() => serializeThemeCss(theme)).not.toThrow()
    expect(serializeThemeCss(theme)).toContain("--font-family: 'Inter', system-ui, sans-serif;")
  })
})
