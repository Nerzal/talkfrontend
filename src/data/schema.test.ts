import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import talkSchema from '../../schemas/talk.schema.json'
import defaultSlidesSchema from '../../schemas/default-slides.schema.json'
import defaultSlides from '../../public/talks/default-slides.json'

const talkModules = import.meta.glob<{ default: unknown }>('../../public/talks/*/talk.json', {
  eager: true,
})

const ajv = new Ajv()

describe('generated JSON schemas', () => {
  it('validates public/talks/default-slides.json against default-slides.schema.json', () => {
    const validate = ajv.compile(defaultSlidesSchema)

    expect(validate(defaultSlides), JSON.stringify(validate.errors)).toBe(true)
  })

  it('validates every public/talks/<id>/talk.json against talk.schema.json', () => {
    const validate = ajv.compile(talkSchema)
    const talkFiles = Object.keys(talkModules)

    expect(talkFiles.length).toBeGreaterThan(0)

    for (const path of talkFiles) {
      const talk = talkModules[path].default
      expect(validate(talk), `${path}: ${JSON.stringify(validate.errors)}`).toBe(true)
    }
  })
})
