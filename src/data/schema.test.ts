import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import talkSchema from '../../schemas/talk.schema.json'
import defaultSlidesSchema from '../../schemas/default-slides.schema.json'
import { parseTalkMarkdown } from './markdown/parseTalkMarkdown'
import { parseDefaultSlidesMarkdown } from './markdown/parseDefaultSlidesMarkdown'

const talkModules = import.meta.glob<string>('../../public/talks/*/talk.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const defaultSlidesSource = await import('../../public/talks/default-slides.md?raw')

const ajv = new Ajv()

describe('generated JSON schemas', () => {
  it('validates public/talks/default-slides.md (parsed) against default-slides.schema.json', () => {
    const validate = ajv.compile(defaultSlidesSchema)
    const defaultSlides = parseDefaultSlidesMarkdown(defaultSlidesSource.default)

    expect(validate(defaultSlides), JSON.stringify(validate.errors)).toBe(true)
  })

  it('validates every public/talks/<id>/talk.md (parsed) against talk.schema.json', () => {
    const validate = ajv.compile(talkSchema)
    const talkFiles = Object.keys(talkModules)

    expect(talkFiles.length).toBeGreaterThan(0)

    for (const path of talkFiles) {
      const talk = parseTalkMarkdown(talkModules[path])
      expect(validate(talk), `${path}: ${JSON.stringify(validate.errors)}`).toBe(true)
    }
  })
})
