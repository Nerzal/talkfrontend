import { vi } from 'vitest'
import talksIndex from '../../public/talks/index.json'
import defaultSlidesMarkdown from '../../public/talks/default-slides.md?raw'
import featureTourMarkdown from '../../public/talks/feature-tour-2026-07/talk.md?raw'
import wolfDeletedOmaMarkdown from '../../public/talks/wolf-deleted-oma-2026-07/talk.md?raw'

const JSON_FILES: Record<string, unknown> = {
  'index.json': talksIndex,
}
const TEXT_FILES: Record<string, string> = {
  'default-slides.md': defaultSlidesMarkdown,
  'feature-tour-2026-07/talk.md': featureTourMarkdown,
  'wolf-deleted-oma-2026-07/talk.md': wolfDeletedOmaMarkdown,
}

export function mockTalksFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const path = url.replace(/^.*\/talks\//, '')
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(JSON_FILES[path]),
        text: () => Promise.resolve(TEXT_FILES[path]),
      } as Response)
    }),
  )
}
