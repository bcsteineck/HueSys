import { describe, expect, it } from 'vitest'
import { getGoogleFontsLinkTags, getRequiredWeights, isHostedFont } from './fontExport'
import { makeTestTheme } from './testHelpers'

describe('fontExport', () => {
  it('treats system and georgia as needing no external request', () => {
    expect(isHostedFont('system')).toBe(false)
    expect(isHostedFont('georgia')).toBe(false)
    expect(isHostedFont('inter')).toBe(true)
  })

  it('returns null link tags for system fonts', () => {
    const theme = makeTestTheme({ typography: { font: 'system' } })
    expect(getGoogleFontsLinkTags('system', theme)).toBeNull()
  })

  it('returns preconnect + stylesheet links for a hosted font', () => {
    const theme = makeTestTheme({ typography: { font: 'inter' } })
    const tags = getGoogleFontsLinkTags('inter', theme)
    expect(tags).not.toBeNull()
    expect(tags).toHaveLength(3)
    expect(tags?.[0]).toContain('fonts.googleapis.com')
    expect(tags?.[2]).toContain('family=Inter:wght@')
  })

  it('requests only the weights the current Theme actually uses, deduplicated', () => {
    const theme = makeTestTheme({ typography: { font: 'inter', weight: 'regular' } })
    const weights = getRequiredWeights(theme)
    expect(weights).toEqual(Array.from(new Set(weights)).sort((a, b) => a - b))
    expect(weights.length).toBeLessThanOrEqual(2)

    const tags = getGoogleFontsLinkTags('inter', theme)
    const stylesheetLink = tags?.[2] ?? ''
    for (const weight of weights) {
      expect(stylesheetLink).toContain(String(weight))
    }
  })

  it('encodes multi-word font labels with + for the Google Fonts URL', () => {
    const theme = makeTestTheme({ typography: { font: 'work-sans' } })
    const tags = getGoogleFontsLinkTags('work-sans', theme)
    expect(tags?.[2]).toContain('family=Work+Sans')
  })
})
