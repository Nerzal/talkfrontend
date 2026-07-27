const FENCE_PATTERN = /^```/

/** Whether a line toggles fenced-code-block state — shared by splitSlides.ts and extractNotes.ts so both stay in sync on what counts as a fence. */
export function isFenceBoundary(line: string): boolean {
  return FENCE_PATTERN.test(line.trim())
}
