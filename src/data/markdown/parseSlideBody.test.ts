import { describe, it, expect } from 'vitest'
import {
  parseTitleBody,
  parseContentBody,
  parseCodeBody,
  parseImageBody,
  parseBlankBody,
  parseMixedBody,
} from './parseSlideBody'

describe('parseTitleBody', () => {
  it('reads title, subtitle and author, converting literal \\n into line breaks', () => {
    const body = '# HILFE!\\nDer Wolf hat Großmutter deleted\n## A subtitle\nNerzal · Juli 2026\n'

    expect(parseTitleBody(body)).toEqual({
      title: 'HILFE!\nDer Wolf hat Großmutter deleted',
      subtitle: 'A subtitle',
      author: 'Nerzal · Juli 2026',
    })
  })

  it('tolerates missing subtitle/author', () => {
    expect(parseTitleBody('# Just a title\n')).toEqual({ title: 'Just a title' })
  })
})

describe('parseContentBody', () => {
  it('reads the title and bullet list', () => {
    const body = '# Agenda\n\n- Point 1\n- Point 2\n'

    expect(parseContentBody(body)).toEqual({
      title: 'Agenda',
      bullets: [{ text: 'Point 1' }, { text: 'Point 2' }],
    })
  })

  it('reads "-> " bullets as fragments', () => {
    const body = '# Agenda\n- Always visible\n-> Revealed on click\n-> Revealed next\n'

    expect(parseContentBody(body)).toEqual({
      title: 'Agenda',
      bullets: [
        { text: 'Always visible' },
        { text: 'Revealed on click', fragment: true },
        { text: 'Revealed next', fragment: true },
      ],
    })
  })
})

describe('parseCodeBody', () => {
  it('reads the optional title and the fenced code block', () => {
    const body = '# Example\n\n```go\nfunc main() {}\n```\n'

    expect(parseCodeBody(body)).toEqual({
      title: 'Example',
      language: 'go',
      code: 'func main() {}',
    })
  })

  it('defaults the language to "text" when the fence has none', () => {
    expect(parseCodeBody('```\nplain\n```')).toEqual({
      title: undefined,
      language: 'text',
      code: 'plain',
    })
  })

  it('reads further fenced blocks as steps, in order', () => {
    const body = '```js\nstep 1\n```\n```js\nstep 2\n```\n```js\nstep 3\n```'

    expect(parseCodeBody(body)).toEqual({
      title: undefined,
      language: 'js',
      code: 'step 1',
      steps: ['step 2', 'step 3'],
    })
  })
})

describe('parseMixedBody', () => {
  it('reads headings, bullets, paragraphs and code in document order', () => {
    const body = `# Big heading

Some intro text.

- Point 1
- Point 2

## Smaller heading

\`\`\`go
func main() {}
\`\`\`
`
    expect(parseMixedBody(body)).toEqual([
      { type: 'heading', level: 1, text: 'Big heading' },
      { type: 'paragraph', text: 'Some intro text.' },
      { type: 'bullets', items: [{ text: 'Point 1' }, { text: 'Point 2' }] },
      { type: 'heading', level: 2, text: 'Smaller heading' },
      { type: 'code', language: 'go', code: 'func main() {}' },
    ])
  })

  it('reads "-> " bullets in a bullet list as fragments', () => {
    const body = '- Always visible\n-> Revealed on click\n'

    expect(parseMixedBody(body)).toEqual([
      {
        type: 'bullets',
        items: [{ text: 'Always visible' }, { text: 'Revealed on click', fragment: true }],
      },
    ])
  })

  it('defaults an unlabeled fence language to "text"', () => {
    expect(parseMixedBody('```\nplain\n```')).toEqual([
      { type: 'code', language: 'text', code: 'plain' },
    ])
  })

  it('joins consecutive paragraph lines with a space', () => {
    expect(parseMixedBody('line one\nline two')).toEqual([
      { type: 'paragraph', text: 'line one line two' },
    ])
  })
})

describe('parseImageBody', () => {
  it('reads the title, image and caption', () => {
    const body = '# A photo\n\n![alt text](assets/photo.png)\n\n*A caption*\n'

    expect(parseImageBody(body)).toEqual({
      title: 'A photo',
      src: 'assets/photo.png',
      alt: 'alt text',
      caption: 'A caption',
    })
  })
})

describe('parseBlankBody', () => {
  it('reads the optional heading and joins remaining lines as the body', () => {
    const body = '# Großmutter lebt.\nDank Event Sourcing –\nund einem ordentlichen Jäger.\n'

    expect(parseBlankBody(body)).toEqual({
      heading: 'Großmutter lebt.',
      body: 'Dank Event Sourcing – und einem ordentlichen Jäger.',
    })
  })

  it('tolerates a missing heading and body', () => {
    expect(parseBlankBody('')).toEqual({ heading: undefined, body: undefined })
  })
})
