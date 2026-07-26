import { describe, it, expect } from 'vitest'
import { extractFrontmatter } from './frontmatter'

describe('extractFrontmatter', () => {
  it('parses the YAML block and returns the remaining source', () => {
    const source = `---
id: my-talk
title: My Talk
year: 2026
month: 1
---

rest of the document
`
    const { data, rest } = extractFrontmatter(source)

    expect(data).toEqual({ id: 'my-talk', title: 'My Talk', year: 2026, month: 1 })
    expect(rest).toBe('\nrest of the document\n')
  })

  it('throws when the source does not start with a frontmatter block', () => {
    expect(() => extractFrontmatter('# Just markdown\n')).toThrow(/frontmatter/)
  })
})
