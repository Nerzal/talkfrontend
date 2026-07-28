import { isFenceBoundary } from './fence'

export interface SlideChunk {
  /** Explicit layout override from the separator line; undefined means it should be inferred from the body (see inferLayout.ts). */
  layout?: string
  id?: string
  body: string
}

/** Layout keywords recognized as an explicit override on the separator line — anything else there is treated as an id instead (see splitSlides below). */
export const KNOWN_LAYOUTS = new Set([
  'title',
  'content',
  'code',
  'image',
  'blank',
  'table',
  'speaker',
  'mixed',
])

const SEPARATOR_PATTERN = /^---(?:\s+(\S+))?(?:\s+(\S+))?\s*$/

/**
 * Splits a talk/deck body into per-slide chunks. Each slide starts with a
 * standalone "---" line — optionally followed by a layout keyword (e.g.
 * "--- content") to override the layout that would otherwise be inferred
 * from the slide's own content (see inferLayout.ts), optionally followed by
 * an explicit id ("--- speaker intro"). A word after "---" that isn't a
 * recognized layout keyword is treated as a bare id instead ("--- intro"),
 * leaving the layout to be inferred. Everything up to the next such line is
 * that slide's content. Lines inside a fenced code block are never read as
 * a separator, so a code slide can safely contain "---" as content (e.g. a
 * diff or YAML example).
 */
export function splitSlides(source: string): SlideChunk[] {
  const lines = source.split('\n')
  const chunks: SlideChunk[] = []
  let layout: string | undefined
  let id: string | undefined
  let body: string[] = []
  let inFence = false
  let started = false

  const flush = () => {
    if (started) {
      chunks.push({ layout, id, body: body.join('\n').trim() })
    }
  }

  for (const line of lines) {
    if (isFenceBoundary(line)) {
      inFence = !inFence
    }
    const match = !inFence ? SEPARATOR_PATTERN.exec(line) : null
    if (match) {
      flush()
      const [, token1, token2] = match
      if (token1 && KNOWN_LAYOUTS.has(token1)) {
        layout = token1
        id = token2
      } else {
        layout = undefined
        id = token1
      }
      body = []
      started = true
      continue
    }
    if (started) {
      body.push(line)
    }
  }
  flush()

  return chunks
}
