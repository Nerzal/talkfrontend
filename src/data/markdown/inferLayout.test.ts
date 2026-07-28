import { describe, it, expect } from 'vitest'
import { inferLayout } from './inferLayout'

describe('inferLayout', () => {
  it('infers "blank" for an empty body', () => {
    expect(inferLayout('')).toBe('blank')
    expect(inferLayout('   \n  ')).toBe('blank')
  })

  it('infers "blank" for a heading with plain prose and no other markers', () => {
    expect(inferLayout('# Fragen?\nNutze diese Folie fuer Q&A.')).toBe('blank')
  })

  it('infers "title" for a heading, subheading and author line', () => {
    expect(inferLayout('# My Talk\n## Subtitle\nAuthor Name')).toBe('title')
  })

  it('infers "content" for a heading followed by a bullet list', () => {
    expect(inferLayout('# Agenda\n- One\n- Two')).toBe('content')
  })

  it('infers "content" for a fragment bullet list ("-> ")', () => {
    expect(inferLayout('# Agenda\n-> One\n-> Two')).toBe('content')
  })

  it('infers "code" for a heading followed by a fenced code block', () => {
    expect(inferLayout('# Example\n```go\nfunc main() {}\n```')).toBe('code')
  })

  it('infers "code" for multiple fenced blocks (magic-move steps)', () => {
    expect(inferLayout('```js\nstep 1\n```\n```js\nstep 2\n```')).toBe('code')
  })

  it('infers "image" for a heading followed by a markdown image', () => {
    expect(inferLayout('# Photo\n![alt text](assets/a.png)\nA caption')).toBe('image')
  })

  it('infers "image" for an image tagged with a position keyword', () => {
    expect(inferLayout('# Photo\n![alt text](assets/a.png) left\nA caption')).toBe('image')
  })

  it('infers "mixed" when bullets and a code block are combined', () => {
    const body = '# Heading\n- One\n```go\nfunc main() {}\n```'
    expect(inferLayout(body)).toBe('mixed')
  })

  it('infers "mixed" when an image and bullets are combined', () => {
    const body = '# Heading\n![alt](a.png)\n- One'
    expect(inferLayout(body)).toBe('mixed')
  })

  it('infers "table" from a YAML body starting with a known table field', () => {
    const body = `title: CREATE
columns: [id, name]
rows:
  - cells: ['1', 'Oma']
    variant: highlight`
    expect(inferLayout(body)).toBe('table')
  })

  it('infers "table" from a YAML body starting with "columns"', () => {
    const body = 'columns: [id]\nrows:\n  - cells: ["1"]'
    expect(inferLayout(body)).toBe('table')
  })

  it('infers "speaker" from a YAML body starting with a known speaker field', () => {
    const body = 'heading: Tobi\nfacts: [Software Engineer]\ngithub: https://github.com/nerzal'
    expect(inferLayout(body)).toBe('speaker')
  })

  it('does not misread a bullet-list nested under a table\'s "rows" key as Markdown content', () => {
    const body = `columns: [id, name]
rows:
  - cells: ["1", "Oma"]
  - cells: ["2", "Opa"]`
    expect(inferLayout(body)).toBe('table')
  })

  it('does not misread ordinary prose containing a colon as a YAML structured body', () => {
    expect(inferLayout('Note: this is just a plain sentence with a colon in it.')).toBe('blank')
  })

  it('falls back to Markdown inference when the first line looks like a known key but the body is not valid YAML', () => {
    const body = 'title: [unterminated'
    expect(() => inferLayout(body)).not.toThrow()
  })

  it('infers "table" from a Markdown GFM table', () => {
    const body = '# CREATE\n| id | name |\n|---|---|\n| 1 | Oma |'
    expect(inferLayout(body)).toBe('table')
  })

  it('infers "table" from a Markdown table with no data rows', () => {
    const body = '| id | name |\n|---|---|'
    expect(inferLayout(body)).toBe('table')
  })

  it('infers "speaker" from a standalone labeled link', () => {
    const body = '# Tobi\n- Software Engineer\n[github](https://github.com/nerzal)'
    expect(inferLayout(body)).toBe('speaker')
  })

  it('does not misread an inline link mention inside a bullet as a speaker slide', () => {
    const body =
      '# Agenda\n- Check out [github](https://github.com/nerzal) for the code\n- Another point'
    expect(inferLayout(body)).toBe('content')
  })

  it('does not misread a shell-pipe example inside prose as a Markdown table', () => {
    const body = '# Tip\nRun `foo | bar` to pipe output.'
    expect(inferLayout(body)).toBe('blank')
  })
})
