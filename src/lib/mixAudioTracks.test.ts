import { describe, it, expect, vi, afterEach } from 'vitest'
import { mixAudioTracks } from './mixAudioTracks'

function streamWithAudioTracks(...tracks: MediaStreamTrack[]): MediaStream {
  return { getAudioTracks: () => tracks } as unknown as MediaStream
}

describe('mixAudioTracks', () => {
  const originalAudioContext = globalThis.AudioContext

  afterEach(() => {
    globalThis.AudioContext = originalAudioContext
  })

  it('returns no track when no stream has audio', () => {
    const result = mixAudioTracks([streamWithAudioTracks()])

    expect(result.track).toBeNull()
    expect(() => result.close()).not.toThrow()
  })

  it('passes a single audio track straight through without mixing', () => {
    const track = { id: 'only-track' } as MediaStreamTrack
    const result = mixAudioTracks([streamWithAudioTracks(track), streamWithAudioTracks()])

    expect(result.track).toBe(track)
  })

  it('mixes multiple audio tracks into one via AudioContext', () => {
    const mixedTrack = { id: 'mixed' } as MediaStreamTrack
    const connect = vi.fn()
    const close = vi.fn()
    const createMediaStreamSource = vi.fn().mockReturnValue({ connect })
    const destination = { stream: { getAudioTracks: () => [mixedTrack] } }

    class FakeAudioContext {
      createMediaStreamSource = createMediaStreamSource
      createMediaStreamDestination = () => destination
      close = close
    }
    globalThis.AudioContext = FakeAudioContext as unknown as typeof AudioContext

    const displayTrack = { id: 'display' } as MediaStreamTrack
    const micTrack = { id: 'mic' } as MediaStreamTrack
    const result = mixAudioTracks([
      streamWithAudioTracks(displayTrack),
      streamWithAudioTracks(micTrack),
    ])

    expect(result.track).toBe(mixedTrack)
    expect(createMediaStreamSource).toHaveBeenCalledTimes(2)
    expect(connect).toHaveBeenCalledTimes(2)
    expect(connect).toHaveBeenCalledWith(destination)

    result.close()
    expect(close).toHaveBeenCalledOnce()
  })
})
