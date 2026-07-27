import { describe, it, expect, vi, afterEach } from 'vitest'
import { isSaveFilePickerSupported, pickSaveLocation } from './pickSaveLocation'

describe('pickSaveLocation', () => {
  const originalShowSaveFilePicker = window.showSaveFilePicker

  afterEach(() => {
    window.showSaveFilePicker = originalShowSaveFilePicker
  })

  it('reports unsupported when showSaveFilePicker is missing', async () => {
    delete window.showSaveFilePicker

    expect(isSaveFilePickerSupported()).toBe(false)
    expect(await pickSaveLocation('recording.webm')).toBeNull()
  })

  it('returns the chosen file handle', async () => {
    const handle = { name: 'recording.webm' } as FileSystemFileHandle
    window.showSaveFilePicker = vi.fn().mockResolvedValue(handle)

    expect(isSaveFilePickerSupported()).toBe(true)
    const result = await pickSaveLocation('recording.webm')

    expect(result).toBe(handle)
    expect(window.showSaveFilePicker).toHaveBeenCalledWith(
      expect.objectContaining({ suggestedName: 'recording.webm' }),
    )
  })

  it('returns null when the user cancels the picker', async () => {
    window.showSaveFilePicker = vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError'))

    expect(await pickSaveLocation('recording.webm')).toBeNull()
  })
})
