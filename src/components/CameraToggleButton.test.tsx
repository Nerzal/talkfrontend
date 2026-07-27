import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CameraToggleButton } from './CameraToggleButton'

function createFakeStream(): MediaStream {
  const track = { stop: vi.fn() }
  return { getTracks: () => [track] } as unknown as MediaStream
}

describe('CameraToggleButton', () => {
  const originalMediaDevicesDescriptor = Object.getOwnPropertyDescriptor(navigator, 'mediaDevices')

  afterEach(() => {
    vi.restoreAllMocks()
    if (originalMediaDevicesDescriptor) {
      Object.defineProperty(navigator, 'mediaDevices', originalMediaDevicesDescriptor)
    }
  })

  it('renders nothing when the browser has no camera support', () => {
    Object.defineProperty(navigator, 'mediaDevices', { value: {}, configurable: true })
    const { container } = render(<CameraToggleButton />)
    expect(container.firstChild).toBeNull()
  })

  it('shows a video preview after toggling the camera on', async () => {
    const getUserMedia = vi.fn().mockResolvedValue(createFakeStream())
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia },
      configurable: true,
    })

    render(<CameraToggleButton />)
    expect(screen.queryByRole('button')?.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(screen.getByLabelText('Show camera'))

    await waitFor(() => expect(screen.getByLabelText('Hide camera')).toBeDefined())
    expect(document.querySelector('video')).not.toBeNull()
  })
})
