import { vi } from 'vitest'

export class FakeMediaStream {
  constructor(private tracks: MediaStreamTrack[] = []) {}
  getTracks = () => this.tracks
  getVideoTracks = () => this.tracks
  getAudioTracks = () => []
}

export class FakeMediaRecorder {
  static isTypeSupported = () => true
  ondataavailable: ((e: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  mimeType = 'video/webm'
  constructor(public stream: MediaStream) {}
  start = vi.fn()
  stop = vi.fn(() => {
    this.ondataavailable?.({ data: new Blob(['chunk'], { type: 'video/webm' }) })
    this.onstop?.()
  })
}

export function createFakeStream(): MediaStream {
  const track = { stop: vi.fn(), addEventListener: vi.fn() }
  return {
    getTracks: () => [track],
    getVideoTracks: () => [track],
    getAudioTracks: () => [],
  } as unknown as MediaStream
}
