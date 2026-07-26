import { describe, it, expect } from 'vitest'
import { highlightCode } from './highlightCode'

describe('highlightCode', () => {
  it('wraps recognized tokens in Prism spans for a known language', () => {
    const html = highlightCode('func main() {}', 'go')

    expect(html).toContain('<span class="token')
    expect(html).toContain('func')
  })

  it('resolves common language aliases', () => {
    expect(highlightCode('const x = 1', 'js')).toContain('<span class="token')
  })

  it('falls back to escaped plain text for an unknown language', () => {
    expect(highlightCode('<a> & b', 'not-a-real-language')).toBe('&lt;a&gt; &amp; b')
  })
})
