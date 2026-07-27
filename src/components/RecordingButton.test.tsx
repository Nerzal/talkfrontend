import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RecordingButton } from './RecordingButton'
import { FakeMediaStream, FakeMediaRecorder, createFakeStream } from '../test/fakeMediaRecording'

vi.mock('../lib/downloadBlob', () => ({ downloadBlob: vi.fn() }))

describe('RecordingButton', () => {
  const originalMediaRecorder = globalThis.MediaRecorder
  const originalMediaDevicesDescriptor = Object.getOwnPropertyDescriptor(navigator, 'mediaDevices')

  // jsdom has no MediaStream constructor; the hook builds a combined stream
  // from the display + mixed-audio tracks, so tests need a stand-in.
  globalThis.MediaStream = FakeMediaStream as unknown as typeof MediaStream

  afterEach(() => {
    vi.restoreAllMocks()
    globalThis.MediaRecorder = originalMediaRecorder
    if (originalMediaDevicesDescriptor) {
      Object.defineProperty(navigator, 'mediaDevices', originalMediaDevicesDescriptor)
    }
  })

  it('renders nothing when the browser does not support screen recording', () => {
    // @ts-expect-error simulating a browser without MediaRecorder
    delete globalThis.MediaRecorder
    Object.defineProperty(navigator, 'mediaDevices', { value: {}, configurable: true })

    const { container } = render(<RecordingButton fileNamePrefix="talk" />)
    expect(container.firstChild).toBeNull()
  })

  it('toggles between record and stop-recording labels when clicked', async () => {
    globalThis.MediaRecorder = FakeMediaRecorder as unknown as typeof MediaRecorder
    const getDisplayMedia = vi.fn().mockResolvedValue(createFakeStream())
    const getUserMedia = vi.fn().mockResolvedValue(createFakeStream())
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getDisplayMedia, getUserMedia },
      configurable: true,
    })

    render(<RecordingButton fileNamePrefix="talk" />)
    fireEvent.click(screen.getByLabelText('Start recording'))

    await waitFor(() => expect(screen.getByLabelText('Stop recording')).toBeDefined())

    fireEvent.click(screen.getByLabelText('Stop recording'))
    await waitFor(() => expect(screen.getByLabelText('Start recording')).toBeDefined())
  })
})
