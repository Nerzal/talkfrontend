import { isFenceBoundary } from './fence'

const NOTES_SEPARATOR = /^\+\+\+\s+notes\s*$/i

export interface ExtractedNotes {
  body: string
  notes?: string
}

/**
 * Splits a slide chunk body on a standalone "+++ notes" line into the
 * slide's main content and its speaker notes (shown only in the presenter
 * view, never to the audience). The "notes" keyword (mirroring the
 * "--- <layout>" separator's own keyword) keeps this from colliding with a
 * bare "+++" that might legitimately appear in prose (e.g. a unified diff's
 * "+++ b/file" header shown outside a fenced block). Fence-aware like
 * splitSlides.ts, so a "+++"-looking line inside a fenced block is never
 * mistaken for the notes separator either.
 */
export function extractNotes(body: string): ExtractedNotes {
  const lines = body.split('\n')
  let inFence = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (isFenceBoundary(line)) {
      inFence = !inFence
      continue
    }
    if (!inFence && NOTES_SEPARATOR.test(line)) {
      const notes = lines
        .slice(i + 1)
        .join('\n')
        .trim()
      return {
        body: lines.slice(0, i).join('\n').trim(),
        notes: notes || undefined,
      }
    }
  }

  return { body: body.trim() }
}
