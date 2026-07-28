import type { ReactNode } from 'react'
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter, useSearchParams } from 'react-router-dom'
import { useTalkPresenter } from './useTalkPresenter'
import type { Talk } from '../data/types'

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

function makeWrapper(initialEntries: string[], onSearchChange: (params: URLSearchParams) => void) {
  function SearchCapture() {
    const [params] = useSearchParams()
    onSearchChange(params)
    return null
  }
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <SearchCapture />
        {children}
      </MemoryRouter>
    )
  }
}

const talk: Talk = {
  id: 't',
  title: 'T',
  year: 2026,
  month: 1,
  slides: [
    { id: 's1', layout: 'blank' },
    { id: 's2', layout: 'code', language: 'go', code: 'a', steps: ['b', 'c'] },
    { id: 's3', layout: 'blank' },
  ],
}

describe('useTalkPresenter', () => {
  it('starts at the first slide and step', () => {
    const { result } = renderHook(() => useTalkPresenter(talk), { wrapper })

    expect(result.current.slideIndex).toBe(0)
    expect(result.current.stepIndex).toBe(0)
    expect(result.current.isFirst).toBe(true)
    expect(result.current.isLast).toBe(false)
  })

  it('advances the slide index normally through a slide with no steps', () => {
    const { result } = renderHook(() => useTalkPresenter(talk), { wrapper })

    act(() => result.current.goNext())

    expect(result.current.slideIndex).toBe(1)
    expect(result.current.stepIndex).toBe(0)
  })

  it('steps through a code slide with steps before advancing to the next slide', () => {
    const { result } = renderHook(() => useTalkPresenter(talk), { wrapper })

    act(() => result.current.goNext()) // slide 1, step 0
    act(() => result.current.goNext()) // slide 1, step 1
    expect(result.current.slideIndex).toBe(1)
    expect(result.current.stepIndex).toBe(1)

    act(() => result.current.goNext()) // slide 1, step 2 (last step)
    expect(result.current.slideIndex).toBe(1)
    expect(result.current.stepIndex).toBe(2)

    act(() => result.current.goNext()) // slide 2, step 0
    expect(result.current.slideIndex).toBe(2)
    expect(result.current.stepIndex).toBe(0)
  })

  it('steps backwards through a code slide before moving to the previous slide', () => {
    const { result } = renderHook(() => useTalkPresenter(talk), { wrapper })

    act(() => result.current.goNext()) // slide 1, step 0
    act(() => result.current.goNext()) // slide 1, step 1
    act(() => result.current.goNext()) // slide 1, step 2

    act(() => result.current.goPrev()) // slide 1, step 1
    expect(result.current.slideIndex).toBe(1)
    expect(result.current.stepIndex).toBe(1)

    act(() => result.current.goPrev()) // slide 1, step 0
    act(() => result.current.goPrev()) // slide 0
    expect(result.current.slideIndex).toBe(0)
    expect(result.current.stepIndex).toBe(0)
  })

  it('does not advance past the last slide/step', () => {
    const { result } = renderHook(() => useTalkPresenter(talk), { wrapper })

    for (let i = 0; i < 10; i++) act(() => result.current.goNext())

    expect(result.current.slideIndex).toBe(2)
    expect(result.current.stepIndex).toBe(0)
    expect(result.current.isLast).toBe(true)
  })

  it('does not go before the first slide/step', () => {
    const { result } = renderHook(() => useTalkPresenter(talk), { wrapper })

    act(() => result.current.goPrev())

    expect(result.current.slideIndex).toBe(0)
    expect(result.current.stepIndex).toBe(0)
    expect(result.current.isFirst).toBe(true)
  })

  it('reads the initial slide index from the "slide" URL param', () => {
    const { result } = renderHook(() => useTalkPresenter(talk), {
      wrapper: makeWrapper(['/talk/t?slide=2'], () => {}),
    })

    expect(result.current.slideIndex).toBe(2)
  })

  it('clamps an out-of-range "slide" URL param to the last slide', () => {
    const { result } = renderHook(() => useTalkPresenter(talk), {
      wrapper: makeWrapper(['/talk/t?slide=99'], () => {}),
    })

    expect(result.current.slideIndex).toBe(2)
  })

  it('falls back to the first slide for a missing or invalid "slide" URL param', () => {
    const { result } = renderHook(() => useTalkPresenter(talk), {
      wrapper: makeWrapper(['/talk/t?slide=not-a-number'], () => {}),
    })

    expect(result.current.slideIndex).toBe(0)
  })

  it('keeps the "slide" URL param in sync when navigating, without pushing new history entries', () => {
    let latest: URLSearchParams | undefined
    const { result } = renderHook(() => useTalkPresenter(talk), {
      wrapper: makeWrapper(['/talk/t'], (params) => {
        latest = params
      }),
    })

    expect(latest?.get('slide')).toBe('0')

    act(() => result.current.goNext())
    expect(latest?.get('slide')).toBe('1')

    act(() => result.current.goPrev())
    expect(latest?.get('slide')).toBe('0')
  })
})

describe('useTalkPresenter with fragment bullets', () => {
  const fragmentTalk: Talk = {
    id: 'f',
    title: 'F',
    year: 2026,
    month: 1,
    slides: [
      {
        id: 's1',
        layout: 'content',
        title: 'Agenda',
        bullets: [
          { text: 'Always visible' },
          { text: 'First fragment', fragment: true },
          { text: 'Second fragment', fragment: true },
        ],
      },
      { id: 's2', layout: 'blank' },
    ],
  }

  it('steps through fragment bullets one at a time before advancing to the next slide', () => {
    const { result } = renderHook(() => useTalkPresenter(fragmentTalk), { wrapper })

    expect(result.current.stepIndex).toBe(0)

    act(() => result.current.goNext())
    expect(result.current.slideIndex).toBe(0)
    expect(result.current.stepIndex).toBe(1)

    act(() => result.current.goNext())
    expect(result.current.slideIndex).toBe(0)
    expect(result.current.stepIndex).toBe(2)

    act(() => result.current.goNext())
    expect(result.current.slideIndex).toBe(1)
    expect(result.current.stepIndex).toBe(0)
  })
})
