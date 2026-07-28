import { describe, it, expect } from 'vitest'
import { buildSlide } from './buildSlide'
import type { SlideChunk } from './splitSlides'

describe('buildSlide', () => {
  it('builds a title slide from markdown, auto-assigning an id from the index', () => {
    const chunk: SlideChunk = { layout: 'title', body: '# Title\n## Subtitle\nAuthor Name' }

    expect(buildSlide(chunk, 0)).toEqual({
      layout: 'title',
      id: 's01',
      title: 'Title',
      subtitle: 'Subtitle',
      author: 'Author Name',
    })
  })

  it('lets an explicit id on the chunk override the auto-generated one', () => {
    const chunk: SlideChunk = { layout: 'blank', id: '__end__', body: '# Bye' }

    expect(buildSlide(chunk, 4).id).toBe('__end__')
  })

  it('builds a content slide', () => {
    const chunk: SlideChunk = { layout: 'content', body: '# Agenda\n- One\n- Two' }

    expect(buildSlide(chunk, 1)).toEqual({
      layout: 'content',
      id: 's02',
      title: 'Agenda',
      bullets: [{ text: 'One' }, { text: 'Two' }],
    })
  })

  it('builds a code slide', () => {
    const chunk: SlideChunk = { layout: 'code', body: '# Example\n```go\nfunc main() {}\n```' }

    expect(buildSlide(chunk, 2)).toEqual({
      layout: 'code',
      id: 's03',
      title: 'Example',
      language: 'go',
      code: 'func main() {}',
    })
  })

  it('builds a code slide with steps for magic-move, from further fenced blocks', () => {
    const chunk: SlideChunk = {
      layout: 'code',
      body: '```js\nstep 1\n```\n```js\nstep 2\n```',
    }

    expect(buildSlide(chunk, 2)).toEqual({
      layout: 'code',
      id: 's03',
      title: undefined,
      language: 'js',
      code: 'step 1',
      steps: ['step 2'],
    })
  })

  it('builds a mixed slide from free-form markdown blocks', () => {
    const chunk: SlideChunk = {
      layout: 'mixed',
      body: '# Heading\n- One\n- Two\n```go\nfunc main() {}\n```',
    }

    expect(buildSlide(chunk, 0)).toEqual({
      layout: 'mixed',
      id: 's01',
      blocks: [
        { type: 'heading', level: 1, text: 'Heading' },
        { type: 'bullets', items: [{ text: 'One' }, { text: 'Two' }] },
        { type: 'code', language: 'go', code: 'func main() {}' },
      ],
    })
  })

  it('builds an image slide', () => {
    const chunk: SlideChunk = { layout: 'image', body: '![alt](assets/a.png)\n*caption*' }

    expect(buildSlide(chunk, 0)).toEqual({
      layout: 'image',
      id: 's01',
      title: undefined,
      src: 'assets/a.png',
      alt: 'alt',
      caption: 'caption',
    })
  })

  it('builds a blank slide', () => {
    const chunk: SlideChunk = { layout: 'blank', body: '# Thanks\nSee you next time.' }

    expect(buildSlide(chunk, 0)).toEqual({
      layout: 'blank',
      id: 's01',
      heading: 'Thanks',
      body: 'See you next time.',
    })
  })

  it('builds a table slide from a plain YAML body', () => {
    const chunk: SlideChunk = {
      layout: 'table',
      body: `title: CREATE
statement: "INSERT INTO x VALUES (1)"
columns: [id, name]
rows:
  - cells: ["1", "Oma"]
    variant: highlight
caption: A caption
ascii: |
  o/`,
    }

    expect(buildSlide(chunk, 0)).toEqual({
      layout: 'table',
      id: 's01',
      title: 'CREATE',
      statement: 'INSERT INTO x VALUES (1)',
      columns: ['id', 'name'],
      rows: [{ cells: ['1', 'Oma'], variant: 'highlight' }],
      empty: undefined,
      caption: 'A caption',
      ascii: 'o/\n',
    })
  })

  it('builds a table slide with an image replacing the ascii-art slot', () => {
    const chunk: SlideChunk = {
      layout: 'table',
      body: `title: READ
columns: [id]
rows:
  - cells: ["1"]
image: assets/wolf.png
imageAlt: A wolf`,
    }

    const slide = buildSlide(chunk, 0)
    expect(slide).toMatchObject({
      layout: 'table',
      image: 'assets/wolf.png',
      imageAlt: 'A wolf',
      ascii: undefined,
    })
  })

  it('builds a speaker slide from a plain YAML body', () => {
    const chunk: SlideChunk = {
      layout: 'speaker',
      body: `heading: Tobi
facts: [Software Engineer, Speaker]
github: https://github.com/nerzal`,
    }

    expect(buildSlide(chunk, 0)).toEqual({
      layout: 'speaker',
      id: 's01',
      heading: 'Tobi',
      photo: undefined,
      facts: ['Software Engineer', 'Speaker'],
      website: undefined,
      linkedin: undefined,
      github: 'https://github.com/nerzal',
      twitter: undefined,
      bluesky: undefined,
      mastodon: undefined,
    })
  })

  it('splits off speaker notes from a prose-layout body', () => {
    const chunk: SlideChunk = {
      layout: 'content',
      body: '# Agenda\n- One\n- Two\n+++ notes\nMention the Q3 numbers here.',
    }

    expect(buildSlide(chunk, 1)).toEqual({
      layout: 'content',
      id: 's02',
      title: 'Agenda',
      bullets: [{ text: 'One' }, { text: 'Two' }],
      notes: 'Mention the Q3 numbers here.',
    })
  })

  it('splits off speaker notes from a YAML-body layout', () => {
    const chunk: SlideChunk = {
      layout: 'speaker',
      body: 'heading: Tobi\n+++ notes\nSlow down, big finish.',
    }

    const slide = buildSlide(chunk, 0)
    expect(slide.notes).toBe('Slow down, big finish.')
  })

  it('splits off a background image from a prose-layout body', () => {
    const chunk: SlideChunk = {
      layout: 'title',
      body: '# Title\n+++ background assets/bg.jpg',
    }

    expect(buildSlide(chunk, 0)).toEqual({
      layout: 'title',
      id: 's01',
      title: 'Title',
      background: 'assets/bg.jpg',
    })
  })

  it('splits off a background image from a YAML-body layout', () => {
    const chunk: SlideChunk = {
      layout: 'speaker',
      body: 'heading: Tobi\n+++ background assets/bg.jpg',
    }

    const slide = buildSlide(chunk, 0)
    expect(slide.background).toBe('assets/bg.jpg')
  })

  it('infers the layout from the body when the chunk has no explicit layout', () => {
    const chunk: SlideChunk = { body: '# Agenda\n- One\n- Two' }

    expect(buildSlide(chunk, 1)).toEqual({
      layout: 'content',
      id: 's02',
      title: 'Agenda',
      bullets: [{ text: 'One' }, { text: 'Two' }],
    })
  })

  it('infers a title slide from the body when the chunk has no explicit layout', () => {
    const chunk: SlideChunk = { body: '# Title\n## Subtitle\nAuthor Name' }

    expect(buildSlide(chunk, 0)).toEqual({
      layout: 'title',
      id: 's01',
      title: 'Title',
      subtitle: 'Subtitle',
      author: 'Author Name',
    })
  })

  it('infers a speaker slide from a YAML body when the chunk has no explicit layout', () => {
    const chunk: SlideChunk = {
      id: 'intro',
      body: 'heading: Tobi\ngithub: https://github.com/nerzal',
    }

    expect(buildSlide(chunk, 0)).toMatchObject({
      layout: 'speaker',
      id: 'intro',
      heading: 'Tobi',
      github: 'https://github.com/nerzal',
    })
  })

  it('builds a table slide from a Markdown body (GFM table)', () => {
    const chunk: SlideChunk = {
      body: `# CREATE
| id | name |
|---|---|
| 1 | Oma | highlight |
Eine neue Zeile.`,
    }

    expect(buildSlide(chunk, 0)).toEqual({
      layout: 'table',
      id: 's01',
      title: 'CREATE',
      statement: undefined,
      columns: ['id', 'name'],
      rows: [{ cells: ['1', 'Oma'], variant: 'highlight' }],
      empty: false,
      caption: 'Eine neue Zeile.',
      ascii: undefined,
      image: undefined,
      imageAlt: undefined,
    })
  })

  it('builds a speaker slide from a Markdown body (labeled links)', () => {
    const chunk: SlideChunk = {
      body: '# Tobi\n- Software Engineer\n[github](https://github.com/nerzal)',
    }

    expect(buildSlide(chunk, 0)).toEqual({
      layout: 'speaker',
      id: 's01',
      heading: 'Tobi',
      photo: undefined,
      facts: ['Software Engineer'],
      website: undefined,
      linkedin: undefined,
      github: 'https://github.com/nerzal',
      twitter: undefined,
      bluesky: undefined,
      mastodon: undefined,
    })
  })

  it('lets an explicit layout override what would otherwise be inferred', () => {
    const chunk: SlideChunk = { layout: 'mixed', body: '# Agenda\n- One\n- Two' }

    expect(buildSlide(chunk, 0).layout).toBe('mixed')
  })

  it('throws a descriptive error for an unknown layout', () => {
    const chunk: SlideChunk = { layout: 'nonsense', body: 'body' }

    expect(() => buildSlide(chunk, 3)).toThrow(/Slide 4/)
  })
})
