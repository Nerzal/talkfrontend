import { describe, it, expect } from 'vitest'
import {
  parseTitleBody,
  parseContentBody,
  parseCodeBody,
  parseImageBody,
  parseBlankBody,
  parseMixedBody,
  parseTableBody,
  parseSpeakerBody,
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

  it('reads a standalone image line with no position as "under"', () => {
    expect(parseMixedBody('![a wolf](assets/wolf.png)')).toEqual([
      { type: 'image', src: 'assets/wolf.png', alt: 'a wolf', position: 'under' },
    ])
  })

  it('reads an explicit "under"/"left"/"right" position from an image line', () => {
    expect(parseMixedBody('![alt](a.png) under')).toEqual([
      { type: 'image', src: 'a.png', alt: 'alt', position: 'under' },
    ])
    expect(parseMixedBody('![alt](a.png) left')).toEqual([
      { type: 'image', src: 'a.png', alt: 'alt', position: 'left' },
    ])
    expect(parseMixedBody('![alt](a.png) right')).toEqual([
      { type: 'image', src: 'a.png', alt: 'alt', position: 'right' },
    ])
  })

  it('is case-insensitive on the image position keyword', () => {
    expect(parseMixedBody('![alt](a.png) LEFT')).toEqual([
      { type: 'image', src: 'a.png', alt: 'alt', position: 'left' },
    ])
  })

  it('keeps an image in document order alongside other block types', () => {
    const body = '# Heading\n![alt](a.png) right\n- a bullet'

    expect(parseMixedBody(body)).toEqual([
      { type: 'heading', level: 1, text: 'Heading' },
      { type: 'image', src: 'a.png', alt: 'alt', position: 'right' },
      { type: 'bullets', items: [{ text: 'a bullet' }] },
    ])
  })

  it('does not swallow a standalone image line into a preceding paragraph', () => {
    const body = 'Some prose.\n![alt](a.png)\nMore prose.'

    expect(parseMixedBody(body)).toEqual([
      { type: 'paragraph', text: 'Some prose.' },
      { type: 'image', src: 'a.png', alt: 'alt', position: 'under' },
      { type: 'paragraph', text: 'More prose.' },
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

  it('tolerates a trailing position keyword on the image line without leaking it into the caption', () => {
    const body = '![alt text](assets/photo.png) left\nA caption'

    expect(parseImageBody(body)).toEqual({
      title: undefined,
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

describe('parseTableBody', () => {
  it('reads title, statement, columns/rows and caption from a GFM table', () => {
    const body = `# CREATE
\`\`\`sql
INSERT INTO personen VALUES (1, 'Oma', 'gesund')
\`\`\`
| id | name | status |
|---|---|---|
| 1 | Oma | gesund |
Eine neue Zeile wird eingefügt.`

    expect(parseTableBody(body)).toEqual({
      title: 'CREATE',
      statement: "INSERT INTO personen VALUES (1, 'Oma', 'gesund')",
      columns: ['id', 'name', 'status'],
      rows: [{ cells: ['1', 'Oma', 'gesund'], variant: undefined }],
      empty: false,
      caption: 'Eine neue Zeile wird eingefügt.',
      ascii: undefined,
      image: undefined,
      imageAlt: undefined,
    })
  })

  it('reads a row variant from a trailing extra cell', () => {
    const body = `| id | name |
|---|---|
| 1 | Oma | highlight |`

    const result = parseTableBody(body)
    expect(result.rows).toEqual([{ cells: ['1', 'Oma'], variant: 'highlight' }])
  })

  it('treats zero data rows as empty', () => {
    const body = `| id | name |
|---|---|`

    expect(parseTableBody(body).empty).toBe(true)
  })

  it('reads an image after the table as the illustration', () => {
    const body = `| id |
|---|
| 1 |
![A wolf](assets/wolf.png)`

    const result = parseTableBody(body)
    expect(result.image).toBe('assets/wolf.png')
    expect(result.imageAlt).toBe('A wolf')
    expect(result.ascii).toBeUndefined()
  })

  it('reads a fenced block after the table as ascii art', () => {
    const body = `| id |
|---|
| 1 |
\`\`\`
o/
\`\`\``

    const result = parseTableBody(body)
    expect(result.ascii).toBe('o/')
    expect(result.image).toBeUndefined()
  })

  it('tolerates a trailing position keyword on the illustration image', () => {
    const body = `| id |
|---|
| 1 |
![A wolf](assets/wolf.png) left`

    const result = parseTableBody(body)
    expect(result.image).toBe('assets/wolf.png')
    expect(result.imageAlt).toBe('A wolf')
  })
})

describe('parseSpeakerBody', () => {
  it('reads heading, photo, facts and labeled social links', () => {
    const body = `# Tobi | Nerzal
![](assets/profile2.jpg)
- Software Engineer
- Speaker
[website](https://blog.noobygames.de)
[github](https://github.com/nerzal)`

    expect(parseSpeakerBody(body)).toEqual({
      heading: 'Tobi | Nerzal',
      photo: 'assets/profile2.jpg',
      facts: ['Software Engineer', 'Speaker'],
      website: 'https://blog.noobygames.de',
      github: 'https://github.com/nerzal',
    })
  })

  it('treats "x" as an alias for the twitter field', () => {
    const body = '[x](https://x.com/nerzal)'

    expect(parseSpeakerBody(body).twitter).toBe('https://x.com/nerzal')
  })

  it('tolerates a body with no heading, photo, facts or links', () => {
    expect(parseSpeakerBody('')).toEqual({ heading: undefined, photo: undefined })
  })

  it('tolerates a trailing position keyword on the photo image', () => {
    const body = '![](assets/profile2.jpg) right'

    expect(parseSpeakerBody(body).photo).toBe('assets/profile2.jpg')
  })
})
