import { vi } from 'vitest'
import talksIndex from '../../public/talks/index.json'
import defaultSlides from '../../public/talks/default-slides.json'
import wolfDeletedOma from '../../public/talks/wolf-deleted-oma-2026-07/talk.json'

const TALKS_FILES: Record<string, unknown> = {
  'index.json': talksIndex,
  'default-slides.json': defaultSlides,
  'wolf-deleted-oma-2026-07/talk.json': wolfDeletedOma,
}

export function mockTalksFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const path = url.replace(/^.*\/talks\//, '')
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(TALKS_FILES[path]),
      } as Response)
    }),
  )
}
