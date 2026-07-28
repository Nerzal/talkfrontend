import { describe, it, expect } from 'vitest'
import { splitSlides } from './splitSlides'

describe('splitSlides', () => {
  it('splits on "--- <layout>" lines and captures the layout', () => {
    const chunks = splitSlides('--- title\nslide one\n\n--- content\nslide two')

    expect(chunks).toEqual([
      { layout: 'title', id: undefined, body: 'slide one' },
      { layout: 'content', id: undefined, body: 'slide two' },
    ])
  })

  it('captures an optional explicit id as the second token', () => {
    const chunks = splitSlides('--- speaker intro\nheading: Hi')

    expect(chunks).toEqual([{ layout: 'speaker', id: 'intro', body: 'heading: Hi' }])
  })

  it('splits on a bare "---" line, with no explicit layout or id', () => {
    const chunks = splitSlides('---\nslide one\n---\nslide two')

    expect(chunks).toEqual([
      { layout: undefined, id: undefined, body: 'slide one' },
      { layout: undefined, id: undefined, body: 'slide two' },
    ])
  })

  it('treats a word after "---" that is not a known layout as a bare id', () => {
    const chunks = splitSlides('--- intro\nheading: Hi')

    expect(chunks).toEqual([{ layout: undefined, id: 'intro', body: 'heading: Hi' }])
  })

  it('ignores "--- <layout>"-looking lines inside fenced code blocks', () => {
    const source = [
      '--- code',
      '```diff',
      '--- a/file.go',
      '+++ b/file.go',
      '```',
      '--- blank',
      'next slide',
    ].join('\n')

    const chunks = splitSlides(source)

    expect(chunks).toHaveLength(2)
    expect(chunks[0].body).toContain('--- a/file.go')
    expect(chunks[1]).toEqual({ layout: 'blank', id: undefined, body: 'next slide' })
  })

  it('ignores content before the first separator', () => {
    expect(splitSlides('\nstray text\n--- blank\nreal content')).toEqual([
      { layout: 'blank', id: undefined, body: 'real content' },
    ])
  })
})
