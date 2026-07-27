import { describe, it, expect, vi } from 'vitest'
import { stopStream } from './stopStream'

describe('stopStream', () => {
  it('stops every track on the stream', () => {
    const trackA = { stop: vi.fn() }
    const trackB = { stop: vi.fn() }
    const stream = { getTracks: () => [trackA, trackB] } as unknown as MediaStream

    stopStream(stream)

    expect(trackA.stop).toHaveBeenCalledOnce()
    expect(trackB.stop).toHaveBeenCalledOnce()
  })

  it('does nothing when the stream is null or undefined', () => {
    expect(() => stopStream(null)).not.toThrow()
    expect(() => stopStream(undefined)).not.toThrow()
  })
})
