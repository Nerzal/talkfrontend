import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScreenRecording, isScreenRecordingSupported } from './useScreenRecording'
import { downloadBlob } from '../lib/downloadBlob'
import { pickSaveLocation } from '../lib/pickSaveLocation'
import { mixAudioTracks } from '../lib/mixAudioTracks'
import { FakeMediaStream, FakeMediaRecorder, createFakeStream } from '../test/fakeMediaRecording'

vi.mock('../lib/downloadBlob', () => ({ downloadBlob: vi.fn() }))
vi.mock('../lib/pickSaveLocation', () => ({ pickSaveLocation: vi.fn().mockResolvedValue(null) }))
vi.mock('../lib/mixAudioTracks', () => ({
  mixAudioTracks: vi.fn().mockReturnValue({ track: null, close: vi.fn() }),
}))

describe('useScreenRecording', () => {
  const originalMediaRecorder = globalThis.MediaRecorder
  const originalMediaDevicesDescriptor = Object.getOwnPropertyDescriptor(navigator, 'mediaDevices')

  // jsdom has no MediaStream constructor; the hook builds a combined stream from
  // the display + mixed-audio tracks, so tests need a stand-in constructor.
  globalThis.MediaStream = FakeMediaStream as unknown as typeof MediaStream

  afterEach(() => {
    vi.restoreAllMocks()
    vi.mocked(pickSaveLocation).mockResolvedValue(null)
    vi.mocked(mixAudioTracks).mockReturnValue({ track: null, close: vi.fn() })
    globalThis.MediaRecorder = originalMediaRecorder
    if (originalMediaDevicesDescriptor) {
      Object.defineProperty(navigator, 'mediaDevices', originalMediaDevicesDescriptor)
    }
  })

  it('reports unsupported when getDisplayMedia/MediaRecorder are missing', () => {
    // @ts-expect-error simulating a browser without MediaRecorder
    delete globalThis.MediaRecorder
    Object.defineProperty(navigator, 'mediaDevices', { value: {}, configurable: true })

    expect(isScreenRecordingSupported()).toBe(false)
    const { result } = renderHook(() => useScreenRecording('talk'))
    expect(result.current.state).toBe('unsupported')
  })

  it('starts recording, then stops and downloads the captured file', async () => {
    globalThis.MediaRecorder = FakeMediaRecorder as unknown as typeof MediaRecorder
    const getDisplayMedia = vi.fn().mockResolvedValue(createFakeStream())
    const getUserMedia = vi.fn().mockResolvedValue(createFakeStream())
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getDisplayMedia, getUserMedia },
      configurable: true,
    })

    const { result } = renderHook(() => useScreenRecording('my-talk'))
    expect(result.current.state).toBe('idle')

    await act(async () => {
      await result.current.start()
    })
    expect(result.current.state).toBe('recording')
    expect(getDisplayMedia).toHaveBeenCalledOnce()
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true })

    await act(async () => {
      result.current.stop()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(result.current.state).toBe('idle')
    expect(downloadBlob).toHaveBeenCalledOnce()
    expect(vi.mocked(downloadBlob).mock.calls[0][1]).toBe('my-talk-recording.webm')
  })

  it('stays idle without throwing when the user cancels the screen-share picker', async () => {
    globalThis.MediaRecorder = FakeMediaRecorder as unknown as typeof MediaRecorder
    const getDisplayMedia = vi
      .fn()
      .mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'))
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getDisplayMedia },
      configurable: true,
    })

    const { result } = renderHook(() => useScreenRecording('my-talk'))

    await act(async () => {
      await expect(result.current.start()).resolves.toBeUndefined()
    })

    expect(result.current.state).toBe('idle')
  })

  it('continues recording without microphone audio when mic permission is denied', async () => {
    globalThis.MediaRecorder = FakeMediaRecorder as unknown as typeof MediaRecorder
    const getDisplayMedia = vi.fn().mockResolvedValue(createFakeStream())
    const getUserMedia = vi
      .fn()
      .mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'))
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getDisplayMedia, getUserMedia },
      configurable: true,
    })

    const { result } = renderHook(() => useScreenRecording('my-talk'))

    await act(async () => {
      await result.current.start()
    })

    expect(result.current.state).toBe('recording')
    expect(mixAudioTracks).toHaveBeenCalledWith([expect.anything()])
  })

  it('writes to the chosen file handle instead of downloading when a save location is picked', async () => {
    globalThis.MediaRecorder = FakeMediaRecorder as unknown as typeof MediaRecorder
    const getDisplayMedia = vi.fn().mockResolvedValue(createFakeStream())
    const getUserMedia = vi.fn().mockResolvedValue(createFakeStream())
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getDisplayMedia, getUserMedia },
      configurable: true,
    })

    const write = vi.fn()
    const close = vi.fn().mockResolvedValue(undefined)
    const createWritable = vi.fn().mockResolvedValue({ write, close })
    vi.mocked(pickSaveLocation).mockResolvedValue({
      createWritable,
    } as unknown as FileSystemFileHandle)

    const { result } = renderHook(() => useScreenRecording('my-talk'))

    await act(async () => {
      await result.current.start()
    })

    await act(async () => {
      result.current.stop()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(createWritable).toHaveBeenCalledOnce()
    expect(write).toHaveBeenCalledOnce()
    expect(close).toHaveBeenCalledOnce()
    expect(downloadBlob).not.toHaveBeenCalled()
  })
})
