import type { DefaultSlides } from '../types'
import { splitSlides } from './splitSlides'
import { buildSlide } from './buildSlide'

/**
 * Parses default-slides.md: exactly two slides, tagged with the id on their
 * separator line — "--- <layout> intro" and "--- <layout> end" (order in
 * the file doesn't matter, only the id does). No talk frontmatter here.
 */
export function parseDefaultSlidesMarkdown(source: string): DefaultSlides {
  const chunks = splitSlides(source)
  const introIndex = chunks.findIndex((chunk) => chunk.id === 'intro')
  const endIndex = chunks.findIndex((chunk) => chunk.id === 'end')

  if (introIndex === -1 || endIndex === -1) {
    throw new Error(
      'default-slides.md must define exactly two slides, tagged "--- <layout> intro" and "--- <layout> end"',
    )
  }

  return {
    intro: buildSlide(chunks[introIndex], introIndex),
    end: buildSlide(chunks[endIndex], endIndex),
  }
}
