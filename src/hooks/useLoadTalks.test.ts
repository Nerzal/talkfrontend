import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useLoadTalks } from './useLoadTalks'
import type { DefaultSlides, Talk } from '../data/types'

const talk: Talk = {
  id: 'a',
  title: 'Talk A',
  year: 2026,
  month: 1,
  slides: [{ id: 's1', layout: 'blank' }],
}
const defaultSlides: DefaultSlides = {
  intro: { id: '__intro__', layout: 'title', title: 'Intro' },
  end: { id: '__end__', layout: 'blank', heading: 'End' },
}

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: () => Promise.resolve(body) } as Response
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useLoadTalks', () => {
  it('starts in loading status and switches to success on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url.endsWith('/index.json')) return Promise.resolve(jsonResponse(['a']))
        if (url.endsWith('/default-slides.json'))
          return Promise.resolve(jsonResponse(defaultSlides))
        return Promise.resolve(jsonResponse(talk))
      }),
    )

    const { result } = renderHook(() => useLoadTalks())

    expect(result.current.status).toBe('loading')

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toEqual({
      status: 'success',
      talks: [{ ...talk, slides: [defaultSlides.intro, ...talk.slides, defaultSlides.end] }],
    })
  })

  it('switches to error status on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(jsonResponse(null, false, 500))),
    )

    const { result } = renderHook(() => useLoadTalks())

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.status === 'error' && result.current.message).toMatch(/index\.json/)
  })
})
