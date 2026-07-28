import { describe, it, expect } from 'vitest'
import { parseTalkMarkdown } from './parseTalkMarkdown'

describe('parseTalkMarkdown', () => {
  it('parses frontmatter metadata and every "--- <layout>" slide', () => {
    const source = `---
id: my-talk-2026-01
title: My Talk
description: A short talk
year: 2026
month: 1
tags: [example, demo]
---

--- title
# My Talk
## Subtitle

--- content
# Agenda

- Point 1
- Point 2
`
    const talk = parseTalkMarkdown(source)

    expect(talk).toEqual({
      id: 'my-talk-2026-01',
      title: 'My Talk',
      description: 'A short talk',
      year: 2026,
      month: 1,
      tags: ['example', 'demo'],
      slides: [
        { layout: 'title', id: 's01', title: 'My Talk', subtitle: 'Subtitle', author: undefined },
        {
          layout: 'content',
          id: 's02',
          title: 'Agenda',
          bullets: [{ text: 'Point 1' }, { text: 'Point 2' }],
        },
      ],
    })
  })

  it('omits optional metadata fields when absent', () => {
    const source = `---
id: minimal
title: Minimal Talk
year: 2026
month: 1
---

--- blank
`
    const talk = parseTalkMarkdown(source)

    expect(talk.description).toBeUndefined()
    expect(talk.tags).toBeUndefined()
    expect(talk.clippy).toBeUndefined()
  })

  it('parses "clippy: true" to enable the Karl Klammer easter egg', () => {
    const source = `---
id: fun-talk
title: Fun Talk
year: 2026
month: 1
clippy: true
---

--- blank
`
    const talk = parseTalkMarkdown(source)

    expect(talk.clippy).toBe(true)
  })
})
