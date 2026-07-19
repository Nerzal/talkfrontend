import { describe, it, expect, vi, afterEach } from 'vitest'
import { loadTalks } from './loadTalks'
import type { DefaultSlides, Talk } from './types'

const talkA: Talk = {
  id: 'a',
  title: 'Talk A',
  year: 2026,
  month: 1,
  slides: [{ id: 's1', layout: 'blank' }],
}
const talkB: Talk = {
  id: 'b',
  title: 'Talk B',
  year: 2026,
  month: 2,
  slides: [{ id: 's1', layout: 'blank' }],
}
const defaultSlides: DefaultSlides = {
  intro: { id: '__intro__', layout: 'title', title: 'Intro' },
  end: { id: '__end__', layout: 'blank', heading: 'End' },
}

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: () => Promise.resolve(body) } as Response
}

function withDefaultSlides(talk: Talk): Talk {
  return { ...talk, slides: [defaultSlides.intro, ...talk.slides, defaultSlides.end] }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadTalks', () => {
  it('loads index.json, default-slides.json and then every talk from the configured directory', async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === '/talks/index.json') return Promise.resolve(jsonResponse(['a', 'b']))
      if (url === '/talks/default-slides.json') return Promise.resolve(jsonResponse(defaultSlides))
      if (url === '/talks/a/talk.json') return Promise.resolve(jsonResponse(talkA))
      if (url === '/talks/b/talk.json') return Promise.resolve(jsonResponse(talkB))
      throw new Error(`unexpected URL: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const talks = await loadTalks('/talks')

    expect(talks).toEqual([withDefaultSlides(talkA), withDefaultSlides(talkB)])
  })

  it('respects a different configured directory', async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === 'https://example.com/data/index.json') return Promise.resolve(jsonResponse(['a']))
      if (url === 'https://example.com/data/default-slides.json')
        return Promise.resolve(jsonResponse(defaultSlides))
      if (url === 'https://example.com/data/a/talk.json')
        return Promise.resolve(jsonResponse(talkA))
      throw new Error(`unexpected URL: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const talks = await loadTalks('https://example.com/data')

    expect(talks).toEqual([withDefaultSlides(talkA)])
  })

  it('prepends the default intro slide and appends the default end slide to every talk', async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === '/talks/index.json') return Promise.resolve(jsonResponse(['a']))
      if (url === '/talks/default-slides.json') return Promise.resolve(jsonResponse(defaultSlides))
      if (url === '/talks/a/talk.json') return Promise.resolve(jsonResponse(talkA))
      throw new Error(`unexpected URL: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const [talk] = await loadTalks('/talks')

    expect(talk.slides.map((s) => s.id)).toEqual(['__intro__', 's1', '__end__'])
  })

  it('throws an error when index.json cannot be loaded', async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === '/talks/index.json') return Promise.resolve(jsonResponse(null, false, 404))
      if (url === '/talks/default-slides.json') return Promise.resolve(jsonResponse(defaultSlides))
      throw new Error(`unexpected URL: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadTalks('/talks')).rejects.toThrow(/index\.json/)
  })

  it('throws an error when default-slides.json cannot be loaded', async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === '/talks/index.json') return Promise.resolve(jsonResponse(['a']))
      if (url === '/talks/default-slides.json')
        return Promise.resolve(jsonResponse(null, false, 404))
      throw new Error(`unexpected URL: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadTalks('/talks')).rejects.toThrow(/default-slides\.json/)
  })

  it('throws an error when a single talk cannot be loaded', async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === '/talks/index.json') return Promise.resolve(jsonResponse(['a']))
      if (url === '/talks/default-slides.json') return Promise.resolve(jsonResponse(defaultSlides))
      return Promise.resolve(jsonResponse(null, false, 500))
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadTalks('/talks')).rejects.toThrow(/a\/talk\.json/)
  })
})
