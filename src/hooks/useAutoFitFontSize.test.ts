import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAutoFitFontSize } from './useAutoFitFontSize'

describe('useAutoFitFontSize', () => {
  it('exposes refs and a font size within the allowed bounds', () => {
    const { result } = renderHook(() => useAutoFitFontSize(['some notes']))

    expect(result.current.containerRef.current).toBeNull()
    expect(result.current.contentRef.current).toBeNull()
    expect(result.current.fontSize).toBeGreaterThanOrEqual(16)
    expect(result.current.fontSize).toBeLessThanOrEqual(72)
  })

  it('does not throw when ResizeObserver is unavailable', () => {
    const original = globalThis.ResizeObserver
    // @ts-expect-error - simulating an environment without ResizeObserver
    delete globalThis.ResizeObserver
    expect(() => renderHook(() => useAutoFitFontSize(['some notes']))).not.toThrow()
    globalThis.ResizeObserver = original
  })
})
