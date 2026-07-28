import { describe, it, expect } from 'vitest'
import { parseStructuredYaml } from './structuredYaml'

describe('parseStructuredYaml', () => {
  it('recognizes a table body from its "columns" key', () => {
    const body = 'title: CREATE\ncolumns: [id, name]\nrows:\n  - cells: ["1"]'

    const result = parseStructuredYaml(body)
    expect(result?.kind).toBe('table')
    expect(result?.config.title).toBe('CREATE')
  })

  it('recognizes a speaker body from a known field with no "columns" key', () => {
    const body = 'heading: Tobi\ngithub: https://github.com/nerzal'

    const result = parseStructuredYaml(body)
    expect(result?.kind).toBe('speaker')
    expect(result?.config.heading).toBe('Tobi')
  })

  it('returns undefined for a Markdown body', () => {
    expect(parseStructuredYaml('# Title\n- bullet')).toBeUndefined()
  })

  it('returns undefined for ordinary prose containing a colon', () => {
    expect(parseStructuredYaml('Note: this is just a sentence.')).toBeUndefined()
  })

  it('returns undefined when the first line looks like a known key but the body is not valid YAML', () => {
    expect(parseStructuredYaml('title: [unterminated')).toBeUndefined()
  })
})
