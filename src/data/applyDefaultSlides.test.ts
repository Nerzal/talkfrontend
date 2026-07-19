import { describe, it, expect } from 'vitest'
import { applyDefaultSlides } from './applyDefaultSlides'
import type { Talk, DefaultSlides } from './types'

const defaults: DefaultSlides = {
  intro: { id: '__intro__', layout: 'title', title: 'Intro' },
  end: { id: '__end__', layout: 'blank', heading: 'End' },
}

function makeTalk(slides: Talk['slides']): Talk {
  return { id: 't', title: 'Talk', year: 2026, month: 1, slides }
}

describe('applyDefaultSlides', () => {
  it('prepends the default intro slide and appends the default end slide', () => {
    const talk = makeTalk([{ id: 's1', layout: 'blank' }])

    const result = applyDefaultSlides(talk, defaults)

    expect(result.slides.map((s) => s.id)).toEqual(['__intro__', 's1', '__end__'])
  })

  it('keeps the rest of the talk unchanged', () => {
    const talk = makeTalk([{ id: 's1', layout: 'blank' }])

    const result = applyDefaultSlides(talk, defaults)

    expect(result.id).toBe(talk.id)
    expect(result.title).toBe(talk.title)
    expect(result.year).toBe(talk.year)
    expect(result.month).toBe(talk.month)
  })

  it('does not mutate the original talk', () => {
    const talk = makeTalk([{ id: 's1', layout: 'blank' }])

    applyDefaultSlides(talk, defaults)

    expect(talk.slides).toEqual([{ id: 's1', layout: 'blank' }])
  })
})
