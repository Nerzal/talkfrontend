import type { Slide, TableRow } from '../types'
import type { SlideChunk } from './splitSlides'
import { KNOWN_LAYOUTS } from './splitSlides'
import { extractNotes } from './extractNotes'
import { extractBackground } from './extractBackground'
import { inferLayout } from './inferLayout'
import { parseStructuredYaml } from './structuredYaml'
import {
  parseTitleBody,
  parseContentBody,
  parseCodeBody,
  parseImageBody,
  parseBlankBody,
  parseMixedBody,
  parseTableBody,
  parseSpeakerBody,
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
 * Turns one "---"-separated slide chunk into a typed Slide. Prose layouts
 * (title/content/code/image/blank/mixed) parse their content as Markdown;
 * structured layouts (table/speaker) treat the whole chunk body as plain
 * YAML, since their data (row variants, ascii art, social links) doesn't
 * map onto Markdown prose. When the chunk has no explicit layout (no
 * recognized keyword on its "---" separator line), it's inferred from the
 * body instead — see inferLayout.ts.
 */
export function buildSlide(chunk: SlideChunk, index: number): Slide {
  const id = chunk.id ?? `s${String(index + 1).padStart(2, '0')}`
  const { body: bodyWithNotes, background } = extractBackground(chunk.body)
  const { body, notes } = extractNotes(bodyWithNotes)
  const layout = chunk.layout ?? inferLayout(body)

  switch (layout) {
    case 'title': {
      const parsed = parseTitleBody(body)
      return {
        layout: 'title',
        id,
        title: parsed.title ?? '',
        subtitle: parsed.subtitle,
        author: parsed.author,
        notes,
        background,
      }
    }
    case 'content': {
      const parsed = parseContentBody(body)
      return {
        layout: 'content',
        id,
        title: parsed.title ?? '',
        bullets: parsed.bullets,
        notes,
        background,
      }
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
        background,
      }
    }
    case 'mixed': {
      return { layout: 'mixed', id, blocks: parseMixedBody(body), notes, background }
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
        maxHeight: parsed.maxHeight,
        maxWidth: parsed.maxWidth,
        notes,
        background,
      }
    }
    case 'blank': {
      const parsed = parseBlankBody(body)
      return {
        layout: 'blank',
        id,
        heading: parsed.heading,
        body: parsed.body,
        notes,
        background,
      }
    }
    case 'table': {
      const structured = parseStructuredYaml(body)
      if (structured) {
        const config = structured.config
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
          maxHeight: str(config.maxHeight),
          maxWidth: str(config.maxWidth),
          notes,
          background,
        }
      }
      const parsed = parseTableBody(body)
      return {
        layout: 'table',
        id,
        title: parsed.title,
        statement: parsed.statement,
        columns: parsed.columns,
        rows: parsed.rows,
        empty: parsed.empty,
        caption: parsed.caption,
        ascii: parsed.ascii,
        image: parsed.image,
        imageAlt: parsed.imageAlt,
        maxHeight: parsed.maxHeight,
        maxWidth: parsed.maxWidth,
        notes,
        background,
      }
    }
    case 'speaker': {
      const structured = parseStructuredYaml(body)
      if (structured) {
        const config = structured.config
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
          background,
        }
      }
      const parsed = parseSpeakerBody(body)
      return {
        layout: 'speaker',
        id,
        heading: parsed.heading,
        photo: parsed.photo,
        facts: parsed.facts,
        website: parsed.website,
        linkedin: parsed.linkedin,
        github: parsed.github,
        twitter: parsed.twitter,
        bluesky: parsed.bluesky,
        mastodon: parsed.mastodon,
        notes,
        background,
      }
    }
    default:
      throw new Error(
        `Slide ${index + 1}: unknown layout "${String(layout)}" (expected one of ${[...KNOWN_LAYOUTS].join(', ')})`,
      )
  }
}
