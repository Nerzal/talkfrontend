export interface SlideChunk {
  layout: string
  id?: string
  body: string
}

const FENCE_PATTERN = /^```/
const SEPARATOR_PATTERN = /^---\s+(\S+)(?:\s+(\S+))?\s*$/

/**
 * Splits a talk/deck body into per-slide chunks. Each slide starts with a
 * line like "--- <layout>" (or "--- <layout> <id>" to set an explicit id —
 * only needed by default-slides.md's "intro"/"end" tagging). Everything up
 * to the next such line is that slide's content. A bare "---" (no layout
 * word after it) is never treated as a separator, and lines inside a fenced
 * code block never are either, so a code slide can safely contain "---" as
 * content (e.g. a diff or YAML example).
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
      chunks.push({ layout: layout!, id, body: body.join('\n').trim() })
    }
  }

  for (const line of lines) {
    if (FENCE_PATTERN.test(line.trim())) {
      inFence = !inFence
    }
    const match = !inFence ? SEPARATOR_PATTERN.exec(line) : null
    if (match) {
      flush()
      layout = match[1]
      id = match[2]
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
