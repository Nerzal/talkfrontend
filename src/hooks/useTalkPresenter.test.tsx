import type { ReactNode } from 'react'
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useTalkPresenter } from './useTalkPresenter'
import type { Talk } from '../data/types'

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
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
})
