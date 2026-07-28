import { isFenceBoundary } from './fence'

const BACKGROUND_SEPARATOR = /^\+\+\+\s+background\s+(.+)$/i
const IMAGE_BACKGROUND_LINE = /^!\[([^\]]*)]\(([^)]+)\)\s+background$/i

export interface ExtractedBackground {
  body: string
  background?: string
}

/**
 * Strips a standalone "+++ background <path>" line, or a standalone Markdown
 * image line tagged with the "background" position (e.g.
 * "![alt](assets/bg.jpg) background" — see the position suffix on inline
 * images in parseMixedBody), from the slide body (fence-aware, anywhere in
 * the body) and returns its path as `background` — an optional image shown
 * behind the slide's own content, available on every layout. Mirrors
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
    if (!inFence) {
      const trimmed = line.trim()
      const separatorMatch = BACKGROUND_SEPARATOR.exec(trimmed)
      if (separatorMatch) {
        background = separatorMatch[1].trim()
        continue
      }
      const imageMatch = IMAGE_BACKGROUND_LINE.exec(trimmed)
      if (imageMatch) {
        background = imageMatch[2].trim()
        continue
      }
    }
    kept.push(line)
  }

  return { body: kept.join('\n').trim(), background }
}
