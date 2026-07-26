import type { Talk } from '../types'
import { extractFrontmatter } from './frontmatter'
import { splitSlides } from './splitSlides'
import { buildSlide } from './buildSlide'

/**
 * Parses a talk.md file: a YAML frontmatter block with talk metadata,
 * followed by "--- <layout>"-separated slide chunks (see buildSlide.ts).
 */
export function parseTalkMarkdown(source: string): Talk {
  const { data, rest } = extractFrontmatter(source)
  const slides = splitSlides(rest).map((chunk, index) => buildSlide(chunk, index))

  return {
    id: String(data.id),
    title: String(data.title),
    description: typeof data.description === 'string' ? data.description : undefined,
    year: Number(data.year),
    month: Number(data.month),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    slides,
  }
}
