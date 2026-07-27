import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCameraOverlay, isCameraSupported } from './useCameraOverlay'

function createFakeStream() {
  const trackStop = vi.fn()
  const stream = { getTracks: () => [{ stop: trackStop }] } as unknown as MediaStream
  return { stream, trackStop }
}

describe('useCameraOverlay', () => {
  const originalMediaDevicesDescriptor = Object.getOwnPropertyDescriptor(navigator, 'mediaDevices')

  afterEach(() => {
    vi.restoreAllMocks()
    if (originalMediaDevicesDescriptor) {
      Object.defineProperty(navigator, 'mediaDevices', originalMediaDevicesDescriptor)
    }
  })

  it('reports unsupported when getUserMedia is missing', () => {
    Object.defineProperty(navigator, 'mediaDevices', { value: {}, configurable: true })
    expect(isCameraSupported()).toBe(false)
  })

  it('starts inactive and toggles the camera stream on/off', async () => {
    const { stream, trackStop } = createFakeStream()
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia },
      configurable: true,
    })

    const { result } = renderHook(() => useCameraOverlay())
    expect(result.current.active).toBe(false)

    act(() => {
      result.current.toggle()
    })

    await waitFor(() => expect(result.current.active).toBe(true))
    expect(getUserMedia).toHaveBeenCalledWith({ video: true })

    act(() => {
      result.current.toggle()
    })

    expect(result.current.active).toBe(false)
    expect(trackStop).toHaveBeenCalled()
  })

  it('stays inactive without throwing when camera permission is denied', async () => {
    const getUserMedia = vi
      .fn()
      .mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'))
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia },
      configurable: true,
    })

    const { result } = renderHook(() => useCameraOverlay())

    await act(async () => {
      result.current.toggle()
      await Promise.resolve()
    })

    expect(result.current.active).toBe(false)
  })
})
