import { describe, it, expect } from 'vitest'
import { extractNotes } from './extractNotes'

describe('extractNotes', () => {
  it('returns the body unchanged when there is no notes separator', () => {
    expect(extractNotes('# Title\nsome content')).toEqual({ body: '# Title\nsome content' })
  })

  it('splits off everything after a standalone "+++ notes" line as notes', () => {
    expect(extractNotes('# Title\nbody text\n+++ notes\nRemember to mention the demo.')).toEqual({
      body: '# Title\nbody text',
      notes: 'Remember to mention the demo.',
    })
  })

  it('trims whitespace on both sides of the split', () => {
    expect(extractNotes('# Title\n\n+++ notes\n\nSpeaker notes here.\n')).toEqual({
      body: '# Title',
      notes: 'Speaker notes here.',
    })
  })

  it('treats an empty notes section as no notes', () => {
    expect(extractNotes('# Title\n+++ notes\n')).toEqual({ body: '# Title' })
  })

  it('is case-insensitive on the "notes" keyword', () => {
    expect(extractNotes('# Title\n+++ NOTES\nSaid loudly.')).toEqual({
      body: '# Title',
      notes: 'Said loudly.',
    })
  })

  it('does not treat a bare "+++" (no "notes" keyword) as a separator', () => {
    const body = '# Title\nSome prose with a +++ divider line in it.\n+++\nMore prose after that.'
    expect(extractNotes(body)).toEqual({ body })
  })

  it('does not treat a unified-diff "+++ b/file" header as a separator', () => {
    const body = 'Some intro text.\n+++ b/file.go\nMore text after that.'
    expect(extractNotes(body)).toEqual({ body })
  })

  it('ignores "+++ notes"-looking lines inside fenced code blocks', () => {
    const body = ['```diff', '--- a/file.go', '+++ b/file.go', '```', 'caption text'].join('\n')

    expect(extractNotes(body)).toEqual({ body })
  })

  it('still finds the notes separator after a fenced code block', () => {
    const body = ['```js', 'console.log(1)', '```', '+++ notes', 'Talk slowly here.'].join('\n')

    expect(extractNotes(body)).toEqual({
      body: '```js\nconsole.log(1)\n```',
      notes: 'Talk slowly here.',
    })
  })
})
