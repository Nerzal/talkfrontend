import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useElapsedTimer } from './useElapsedTimer'

describe('useElapsedTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at zero and running', () => {
    const { result } = renderHook(() => useElapsedTimer())
    expect(result.current.elapsedMs).toBe(0)
    expect(result.current.running).toBe(true)
  })

  it('counts up while running', () => {
    const { result } = renderHook(() => useElapsedTimer())

    void act(() => vi.advanceTimersByTime(2000))

    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(2000)
  })

  it('stops counting once paused', () => {
    const { result } = renderHook(() => useElapsedTimer())

    void act(() => vi.advanceTimersByTime(1000))
    void act(() => result.current.pause())
    const pausedAt = result.current.elapsedMs

    void act(() => vi.advanceTimersByTime(3000))

    expect(result.current.elapsedMs).toBe(pausedAt)
    expect(result.current.running).toBe(false)
  })

  it('resumes counting from where it paused', () => {
    const { result } = renderHook(() => useElapsedTimer())

    void act(() => vi.advanceTimersByTime(1000))
    void act(() => result.current.pause())
    void act(() => result.current.resume())
    void act(() => vi.advanceTimersByTime(1000))

    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(2000)
  })

  it('resets back to zero', () => {
    const { result } = renderHook(() => useElapsedTimer())

    void act(() => vi.advanceTimersByTime(5000))
    void act(() => result.current.reset())

    expect(result.current.elapsedMs).toBe(0)
  })
})
