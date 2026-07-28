import { describe, it, expect } from 'vitest'
import { extractBackground } from './extractBackground'

describe('extractBackground', () => {
  it('returns the body unchanged when there is no background separator', () => {
    expect(extractBackground('# Title\nsome content')).toEqual({ body: '# Title\nsome content' })
  })

  it('strips a standalone "+++ background <path>" line and returns its path', () => {
    expect(extractBackground('# Title\nbody text\n+++ background assets/bg.jpg')).toEqual({
      body: '# Title\nbody text',
      background: 'assets/bg.jpg',
    })
  })

  it('trims whitespace around the extracted path', () => {
    expect(extractBackground('# Title\n+++ background   assets/bg.jpg  ')).toEqual({
      body: '# Title',
      background: 'assets/bg.jpg',
    })
  })

  it('is case-insensitive on the "background" keyword', () => {
    expect(extractBackground('# Title\n+++ BACKGROUND assets/bg.jpg')).toEqual({
      body: '# Title',
      background: 'assets/bg.jpg',
    })
  })

  it('does not treat a bare "+++" or unrelated "+++ notes" line as a background separator', () => {
    const body = '# Title\n+++ notes\nSome speaker notes.'
    expect(extractBackground(body)).toEqual({ body })
  })

  it('ignores "+++ background"-looking lines inside fenced code blocks', () => {
    const body = ['```text', '+++ background assets/bg.jpg', '```', 'caption text'].join('\n')

    expect(extractBackground(body)).toEqual({ body })
  })

  it('still finds the background separator after a fenced code block', () => {
    const body = ['```js', 'console.log(1)', '```', '+++ background assets/bg.jpg'].join('\n')

    expect(extractBackground(body)).toEqual({
      body: '```js\nconsole.log(1)\n```',
      background: 'assets/bg.jpg',
    })
  })
})
