import { load } from 'js-yaml'
import type { Slide, TableRow } from '../types'
import type { SlideChunk } from './splitSlides'
import {
  parseTitleBody,
  parseContentBody,
  parseCodeBody,
  parseImageBody,
  parseBlankBody,
  parseMixedBody,
} from './parseSlideBody'

function str(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function bool(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function strArray(value: unknown): string[] | undefined {
  return Array.isArray(value) ? value.map((v) => String(v)) : undefined
}

function tableRows(value: unknown): TableRow[] {
  if (!Array.isArray(value)) return []
  return value.map((row) => {
    const r = row as { cells?: unknown; variant?: unknown }
    return {
      cells: Array.isArray(r.cells) ? r.cells.map(String) : [],
      variant: typeof r.variant === 'string' ? (r.variant as TableRow['variant']) : undefined,
    }
  })
}

/**
 * Turns one "--- <layout>\n<content>" slide chunk into a typed Slide.
 * Prose layouts (title/content/code/image/blank) parse their content as
 * Markdown; structured layouts (table/speaker) treat the whole chunk body
 * as plain YAML, since their data (row variants, ascii art, social links)
 * doesn't map onto Markdown prose.
 */
export function buildSlide(chunk: SlideChunk, index: number): Slide {
  const id = chunk.id ?? `s${String(index + 1).padStart(2, '0')}`

  switch (chunk.layout) {
    case 'title': {
      const parsed = parseTitleBody(chunk.body)
      return {
        layout: 'title',
        id,
        title: parsed.title ?? '',
        subtitle: parsed.subtitle,
        author: parsed.author,
      }
    }
    case 'content': {
      const parsed = parseContentBody(chunk.body)
      return { layout: 'content', id, title: parsed.title ?? '', bullets: parsed.bullets }
    }
    case 'code': {
      const parsed = parseCodeBody(chunk.body)
      return {
        layout: 'code',
        id,
        title: parsed.title,
        language: parsed.language ?? 'text',
        code: parsed.code ?? '',
        steps: parsed.steps,
      }
    }
    case 'mixed': {
      return { layout: 'mixed', id, blocks: parseMixedBody(chunk.body) }
    }
    case 'image': {
      const parsed = parseImageBody(chunk.body)
      return {
        layout: 'image',
        id,
        title: parsed.title,
        src: parsed.src ?? '',
        alt: parsed.alt ?? '',
        caption: parsed.caption,
      }
    }
    case 'blank': {
      const parsed = parseBlankBody(chunk.body)
      return { layout: 'blank', id, heading: parsed.heading, body: parsed.body }
    }
    case 'table': {
      const config = (load(chunk.body) ?? {}) as Record<string, unknown>
      return {
        layout: 'table',
        id,
        title: str(config.title),
        statement: str(config.statement),
        columns: strArray(config.columns) ?? [],
        rows: tableRows(config.rows),
        empty: bool(config.empty),
        caption: str(config.caption),
        ascii: str(config.ascii),
      }
    }
    case 'speaker': {
      const config = (load(chunk.body) ?? {}) as Record<string, unknown>
      return {
        layout: 'speaker',
        id,
        heading: str(config.heading),
        photo: str(config.photo),
        facts: strArray(config.facts),
        website: str(config.website),
        linkedin: str(config.linkedin),
        github: str(config.github),
        twitter: str(config.twitter),
        bluesky: str(config.bluesky),
        mastodon: str(config.mastodon),
      }
    }
    default:
      throw new Error(
        `Slide ${index + 1}: unknown layout "${chunk.layout}" (expected one of title, content, code, image, blank, table, speaker, mixed)`,
      )
  }
}
