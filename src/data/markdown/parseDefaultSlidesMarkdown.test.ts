import { describe, it, expect } from 'vitest'
import { parseDefaultSlidesMarkdown } from './parseDefaultSlidesMarkdown'

describe('parseDefaultSlidesMarkdown', () => {
  it('builds the intro and end slides from the id on their separator line, order-independent', () => {
    const source = `--- blank end
# Thank you!

--- speaker intro
heading: Tobi | Nerzal
`
    const defaults = parseDefaultSlidesMarkdown(source)

    expect(defaults.intro).toEqual({
      layout: 'speaker',
      id: 'intro',
      heading: 'Tobi | Nerzal',
      photo: undefined,
      facts: undefined,
      website: undefined,
      linkedin: undefined,
      github: undefined,
      twitter: undefined,
      bluesky: undefined,
      mastodon: undefined,
    })
    expect(defaults.end).toEqual({
      layout: 'blank',
      id: 'end',
      heading: 'Thank you!',
      body: undefined,
    })
  })

  it('throws when a slide is missing its "intro"/"end" id tag', () => {
    const source = '--- blank\n# No id\n'

    expect(() => parseDefaultSlidesMarkdown(source)).toThrow(/intro.*end/)
  })

  it('throws when only intro is present', () => {
    const source = '--- blank intro\n# Only intro\n'

    expect(() => parseDefaultSlidesMarkdown(source)).toThrow(/intro.*end/)
  })
})
