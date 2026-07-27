import { describe, it, expect } from 'vitest'
import { containReferenceRect, REFERENCE_ASPECT } from './referenceCanvas'

describe('containReferenceRect', () => {
  it('returns the full container when it already matches the reference aspect ratio', () => {
    expect(containReferenceRect(1280, 720)).toEqual({ left: 0, top: 0, width: 1280, height: 720 })
    expect(containReferenceRect(640, 360)).toEqual({ left: 0, top: 0, width: 640, height: 360 })
  })

  it('letterboxes left/right on a wider-than-reference container', () => {
    const rect = containReferenceRect(2000, 720)
    expect(rect.height).toBe(720)
    expect(rect.width).toBeCloseTo(720 * REFERENCE_ASPECT)
    expect(rect.top).toBe(0)
    expect(rect.left).toBeCloseTo((2000 - rect.width) / 2)
  })

  it('letterboxes top/bottom on a taller-than-reference container', () => {
    const rect = containReferenceRect(800, 1000)
    expect(rect.width).toBe(800)
    expect(rect.height).toBeCloseTo(800 / REFERENCE_ASPECT)
    expect(rect.left).toBe(0)
    expect(rect.top).toBeCloseTo((1000 - rect.height) / 2)
  })

  it('falls back to the raw container size when it has no area yet', () => {
    expect(containReferenceRect(0, 0)).toEqual({ left: 0, top: 0, width: 0, height: 0 })
  })
})
