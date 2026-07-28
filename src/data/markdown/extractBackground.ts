import { isFenceBoundary } from './fence'

const BACKGROUND_SEPARATOR = /^\+\+\+\s+background\s+(.+)$/i

export interface ExtractedBackground {
  body: string
  background?: string
}

/**
 * Strips a standalone "+++ background <path>" line (fence-aware, anywhere in
 * the slide body) and returns its path as `background` — an optional image
 * shown behind the slide's own content, available on every layout. Mirrors
 * "+++ notes" syntax (see extractNotes.ts); run before it so a background
 * line placed after "+++ notes" is stripped before notes are split off,
 * rather than ending up as part of the notes text.
 */
export function extractBackground(body: string): ExtractedBackground {
  const lines = body.split('\n')
  let inFence = false
  const kept: string[] = []
  let background: string | undefined

  for (const line of lines) {
    if (isFenceBoundary(line)) {
      inFence = !inFence
      kept.push(line)
      continue
    }
    const match = !inFence ? BACKGROUND_SEPARATOR.exec(line) : null
    if (match) {
      background = match[1].trim()
      continue
    }
    kept.push(line)
  }

  return { body: kept.join('\n').trim(), background }
}
