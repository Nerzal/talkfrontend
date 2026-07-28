import { load } from 'js-yaml'
import type { Slide, TableRow } from '../types'
import type { SlideChunk } from './splitSlides'
import { extractNotes } from './extractNotes'
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
  const { body, notes } = extractNotes(chunk.body)

  switch (chunk.layout) {
    case 'title': {
      const parsed = parseTitleBody(body)
      return {
        layout: 'title',
        id,
        title: parsed.title ?? '',
        subtitle: parsed.subtitle,
        author: parsed.author,
        notes,
      }
    }
    case 'content': {
      const parsed = parseContentBody(body)
      return { layout: 'content', id, title: parsed.title ?? '', bullets: parsed.bullets, notes }
    }
    case 'code': {
      const parsed = parseCodeBody(body)
      return {
        layout: 'code',
        id,
        title: parsed.title,
        language: parsed.language ?? 'text',
        code: parsed.code ?? '',
        steps: parsed.steps,
        notes,
      }
    }
    case 'mixed': {
      return { layout: 'mixed', id, blocks: parseMixedBody(body), notes }
    }
    case 'image': {
      const parsed = parseImageBody(body)
      return {
        layout: 'image',
        id,
        title: parsed.title,
        src: parsed.src ?? '',
        alt: parsed.alt ?? '',
        caption: parsed.caption,
        notes,
      }
    }
    case 'blank': {
      const parsed = parseBlankBody(body)
      return { layout: 'blank', id, heading: parsed.heading, body: parsed.body, notes }
    }
    case 'table': {
      const config = (load(body) ?? {}) as Record<string, unknown>
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
        image: str(config.image),
        imageAlt: str(config.imageAlt),
        notes,
      }
    }
    case 'speaker': {
      const config = (load(body) ?? {}) as Record<string, unknown>
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
        notes,
      }
    }
    default:
      throw new Error(
        `Slide ${index + 1}: unknown layout "${chunk.layout}" (expected one of title, content, code, image, blank, table, speaker, mixed)`,
      )
  }
}
