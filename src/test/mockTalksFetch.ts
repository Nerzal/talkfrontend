import { vi } from 'vitest'
import talksIndex from '../../public/talks/index.json'
import wolfDeletedOma from '../../public/talks/wolf-deleted-oma-2026-07.json'

const TALKS_FILES: Record<string, unknown> = {
  'index.json': talksIndex,
  'wolf-deleted-oma-2026-07.json': wolfDeletedOma,
}

export function mockTalksFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const filename = url.split('/').pop() ?? ''
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(TALKS_FILES[filename]),
      } as Response)
    }),
  )
}
