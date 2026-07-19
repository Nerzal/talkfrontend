import { describe, it, expect, vi, afterEach } from 'vitest'
import { loadTalks } from './loadTalks'
import type { Talk } from './types'

const talkA: Talk = { id: 'a', title: 'Talk A', year: 2026, month: 1, slides: [{ id: 's1', layout: 'blank' }] }
const talkB: Talk = { id: 'b', title: 'Talk B', year: 2026, month: 2, slides: [{ id: 's1', layout: 'blank' }] }

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadTalks', () => {
  it('lädt index.json und anschließend jeden Talk aus dem konfigurierten Ordner', async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === '/talks/index.json') return Promise.resolve(jsonResponse(['a', 'b']))
      if (url === '/talks/a.json') return Promise.resolve(jsonResponse(talkA))
      if (url === '/talks/b.json') return Promise.resolve(jsonResponse(talkB))
      throw new Error(`unerwartete URL: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const talks = await loadTalks('/talks')

    expect(talks).toEqual([talkA, talkB])
  })

  it('respektiert einen anderen konfigurierten Ordner', async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === 'https://example.com/data/index.json') return Promise.resolve(jsonResponse(['a']))
      if (url === 'https://example.com/data/a.json') return Promise.resolve(jsonResponse(talkA))
      throw new Error(`unerwartete URL: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const talks = await loadTalks('https://example.com/data')

    expect(talks).toEqual([talkA])
  })

  it('wirft einen Fehler, wenn index.json nicht geladen werden kann', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(jsonResponse(null, false, 404))))

    await expect(loadTalks('/talks')).rejects.toThrow(/index\.json/)
  })

  it('wirft einen Fehler, wenn ein einzelner Talk nicht geladen werden kann', async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === '/talks/index.json') return Promise.resolve(jsonResponse(['a']))
      return Promise.resolve(jsonResponse(null, false, 500))
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(loadTalks('/talks')).rejects.toThrow(/a\.json/)
  })
})
