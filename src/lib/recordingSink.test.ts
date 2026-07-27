import { describe, it, expect, vi, afterEach } from 'vitest'
import { createRecordingSink } from './recordingSink'
import { downloadBlob } from './downloadBlob'

vi.mock('./downloadBlob', () => ({ downloadBlob: vi.fn() }))

describe('createRecordingSink', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('buffers chunks and downloads a blob when there is no file handle', async () => {
    const sink = await createRecordingSink(null, 'recording.webm')

    sink.write(new Blob(['a']))
    sink.write(new Blob(['b']))
    await sink.finish('video/webm')

    expect(downloadBlob).toHaveBeenCalledOnce()
    const [blob, fileName] = vi.mocked(downloadBlob).mock.calls[0]
    expect(fileName).toBe('recording.webm')
    expect(blob.type).toBe('video/webm')
  })

  it('writes chunks to the file handle and closes it on finish', async () => {
    const write = vi.fn()
    const close = vi.fn().mockResolvedValue(undefined)
    const createWritable = vi.fn().mockResolvedValue({ write, close })
    const fileHandle = { createWritable } as unknown as FileSystemFileHandle

    const sink = await createRecordingSink(fileHandle, 'recording.webm')
    const chunk = new Blob(['a'])
    sink.write(chunk)
    await sink.finish('video/webm')

    expect(write).toHaveBeenCalledWith(chunk)
    expect(close).toHaveBeenCalledOnce()
    expect(downloadBlob).not.toHaveBeenCalled()
  })

  it('falls back to downloading when createWritable rejects', async () => {
    const createWritable = vi.fn().mockRejectedValue(new Error('permission revoked'))
    const fileHandle = { createWritable } as unknown as FileSystemFileHandle

    const sink = await createRecordingSink(fileHandle, 'recording.webm')
    sink.write(new Blob(['a']))
    await sink.finish('video/webm')

    expect(downloadBlob).toHaveBeenCalledOnce()
  })
})
