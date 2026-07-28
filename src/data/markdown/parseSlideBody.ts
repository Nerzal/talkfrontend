import type { Bullet, ContentBlock, ImageBlockPosition, TableRow, TableRowVariant } from '../types'
import { isFenceBoundary } from './fence'

const H1_PATTERN = /^#\s+(.+)$/m
/** Trailing "background"/"left"/"right"/"under" position keyword is consumed but ignored here — only parseMixedBody's own image handling acts on it (background is already stripped by extractBackground before any layout parser runs). */
const IMAGE_PATTERN = /!\[([^\]]*)\]\(([^)]+)\)(?:\s+(?:background|left|right|under))?/i
/** A standalone image line in a "mixed" slide, e.g. "![alt](path) left" — the whole line must be just the image (+ optional position), so it isn't confused with an image mentioned mid-paragraph. */
const MIXED_IMAGE_PATTERN = /^!\[([^\]]*)]\(([^)]+)\)(?:\s+(left|right|under))?$/i

export interface TitleBody {
  title?: string
  subtitle?: string
  author?: string
}

/**
 * "# Title" (literal "\n" becomes a real line break, for multi-line titles),
 * then "## Subtitle", then the first remaining line becomes the author.
 */
export function parseTitleBody(body: string): TitleBody {
  const result: TitleBody = {}
  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (result.title === undefined && line.startsWith('# ')) {
      result.title = line.slice(2).trim().replace(/\\n/g, '\n')
      continue
    }
    if (result.subtitle === undefined && line.startsWith('## ')) {
      result.subtitle = line.slice(3).trim()
      continue
    }
    if (result.author === undefined) {
      result.author = line
    }
  }
  return result
}

export interface ContentBody {
  title?: string
  bullets: Bullet[]
}

/** "- item" shows immediately with the rest of the slide; "-> item" is a fragment, revealed one at a time via click/arrow key before the next slide. Returns null for a non-bullet line. */
function parseBulletLine(line: string): Bullet | null {
  if (line.startsWith('-> ')) return { text: line.slice(3).trim(), fragment: true }
  if (line.startsWith('- ')) return { text: line.slice(2).trim() }
  return null
}

/** "# Title" heading, then a bullet list — see `parseBulletLine` for the "- "/"-> " bullet syntax. */
export function parseContentBody(body: string): ContentBody {
  let title: string | undefined
  const bullets: Bullet[] = []
  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (title === undefined && line.startsWith('# ')) {
      title = line.slice(2).trim()
      continue
    }
    const bullet = parseBulletLine(line)
    if (bullet) bullets.push(bullet)
  }
  return { title, bullets }
}

export interface CodeBody {
  title?: string
  language?: string
  code?: string
  /** Code from any further fenced blocks after the first, in order. */
  steps?: string[]
}

/**
 * Optional "# Title" heading, then one or more fenced code blocks:
 * ```lang ... ```. The first block is the slide's base code; any further
 * blocks become "steps" that morph from one to the next (Shiki Magic Move)
 * before advancing to the next slide.
 */
export function parseCodeBody(body: string): CodeBody {
  const title = H1_PATTERN.exec(body)?.[1]?.trim()
  const fences = [...body.matchAll(/```([^\n`]*)\n([\s\S]*?)\n```/g)]
  const [first, ...rest] = fences
  const language = first?.[1]?.trim() || 'text'
  const code = first?.[2] ?? ''
  const steps = rest.length > 0 ? rest.map((fence) => fence[2]) : undefined
  return { title, language, code, steps }
}

export interface ImageBody {
  title?: string
  src?: string
  alt?: string
  caption?: string
}

/** Optional "# Title" heading, a markdown image, then an optional caption line. */
export function parseImageBody(body: string): ImageBody {
  const title = H1_PATTERN.exec(body)?.[1]?.trim()
  const imageMatch = IMAGE_PATTERN.exec(body)
  const alt = imageMatch?.[1]
  const src = imageMatch?.[2]
  const after = imageMatch ? body.slice(imageMatch.index + imageMatch[0].length) : ''
  const caption = after
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0)
    ?.replace(/^\*(.+)\*$/, '$1')
  return { title, src, alt, caption }
}

/**
 * Free-form Markdown → an ordered list of blocks (heading, bullets,
 * paragraph, fenced code, image), so a "mixed" slide can combine them in
 * any order. A standalone image line can carry a trailing position keyword
 * ("![alt](path) left"/"right"/"under", default "under") controlling where
 * MixedSlide.tsx places it relative to the rest of the slide's content — a
 * "background"-tagged image is never seen here, since extractBackground
 * strips it from the body before any layout parser runs. Fence-aware: lines
 * inside a code block are never read as headings, bullets, or images.
 */
export function parseMixedBody(body: string): ContentBlock[] {
  const lines = body.split('\n')
  const blocks: ContentBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) {
      i++
      continue
    }

    const fenceMatch = /^```(\S*)\s*$/.exec(line)
    if (fenceMatch) {
      const language = fenceMatch[1] || 'text'
      const codeLines: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== '```') {
        codeLines.push(lines[i])
        i++
      }
      i++
      blocks.push({ type: 'code', language, code: codeLines.join('\n') })
      continue
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, text: line.slice(3).trim() })
      i++
      continue
    }
    if (line.startsWith('# ')) {
      blocks.push({ type: 'heading', level: 1, text: line.slice(2).trim() })
      i++
      continue
    }

    const imageMatch = MIXED_IMAGE_PATTERN.exec(line)
    if (imageMatch) {
      const position = (imageMatch[3]?.toLowerCase() as ImageBlockPosition | undefined) ?? 'under'
      blocks.push({ type: 'image', src: imageMatch[2], alt: imageMatch[1], position })
      i++
      continue
    }

    if (parseBulletLine(line)) {
      const items: Bullet[] = []
      while (i < lines.length) {
        const bullet = parseBulletLine(lines[i].trim())
        if (!bullet) break
        items.push(bullet)
        i++
      }
      blocks.push({ type: 'bullets', items })
      continue
    }

    const paragraphLines: string[] = []
    while (i < lines.length) {
      const next = lines[i].trim()
      if (
        !next ||
        parseBulletLine(next) ||
        /^#{1,2}\s/.test(next) ||
        /^```/.test(next) ||
        MIXED_IMAGE_PATTERN.test(next)
      )
        break
      paragraphLines.push(next)
      i++
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') })
  }

  return blocks
}

export interface BlankBody {
  heading?: string
  body?: string
}

/** Optional "# Heading", then remaining text becomes the body. */
export function parseBlankBody(body: string): BlankBody {
  let heading: string | undefined
  const bodyLines: string[] = []
  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (heading === undefined && line.startsWith('# ')) {
      heading = line.slice(2).trim()
      continue
    }
    bodyLines.push(line)
  }
  return { heading, body: bodyLines.length > 0 ? bodyLines.join(' ') : undefined }
}

const TABLE_SEPARATOR_CELL = /^:?-+:?$/
const TABLE_ROW_VARIANTS = new Set<TableRowVariant>([
  'normal',
  'highlight',
  'warning',
  'danger',
  'deleted',
])

function splitTableRow(line: string): string[] {
  let trimmed = line.trim()
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1)
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1)
  return trimmed.split('|').map((cell) => cell.trim())
}

function isTableSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((cell) => TABLE_SEPARATOR_CELL.test(cell))
}

export interface TableBody {
  title?: string
  statement?: string
  columns: string[]
  rows: TableRow[]
  empty: boolean
  caption?: string
  ascii?: string
  image?: string
  imageAlt?: string
}

/**
 * A `table` slide written as Markdown instead of YAML: optional "# Title",
 * an optional fenced code block *before* the table becomes the SQL
 * `statement`, a GFM pipe table becomes `columns`/`rows` (a row with one
 * extra trailing cell matching a known variant name, e.g.
 * "| 1 | Oma | highlight |", sets that row's `variant`; zero data rows
 * means `empty`), then either a Markdown image or a fenced code block
 * *after* the table becomes the illustration slot (`image`/`imageAlt` or
 * `ascii`), and any remaining prose becomes the `caption`.
 */
export function parseTableBody(body: string): TableBody {
  const title = H1_PATTERN.exec(body)?.[1]?.trim()

  let inFence = false
  let fenceLines: string[] = []
  let seenTable = false
  let statement: string | undefined
  let ascii: string | undefined
  const tableLines: string[] = []
  const otherLines: string[] = []

  for (const raw of body.split('\n')) {
    if (isFenceBoundary(raw)) {
      if (inFence) {
        const content = fenceLines.join('\n')
        if (seenTable) ascii = content
        else statement = content
        fenceLines = []
      }
      inFence = !inFence
      continue
    }
    if (inFence) {
      fenceLines.push(raw)
      continue
    }
    const line = raw.trim()
    if (!line || line.startsWith('# ')) continue
    if (line.includes('|')) {
      tableLines.push(line)
      seenTable = true
      continue
    }
    otherLines.push(raw)
  }

  let columns: string[] = []
  const rows: TableRow[] = []
  if (tableLines.length > 0) {
    columns = splitTableRow(tableLines[0])
    for (const rowLine of tableLines.slice(1)) {
      const cells = splitTableRow(rowLine)
      if (isTableSeparatorRow(cells)) continue
      let variant: TableRowVariant | undefined
      let rowCells = cells
      if (cells.length === columns.length + 1) {
        const last = cells[cells.length - 1].toLowerCase() as TableRowVariant
        if (TABLE_ROW_VARIANTS.has(last)) {
          variant = last
          rowCells = cells.slice(0, -1)
        }
      }
      rows.push({ cells: rowCells, variant })
    }
  }

  const otherText = otherLines.join('\n')
  const imageMatch = IMAGE_PATTERN.exec(otherText)
  const image = imageMatch?.[2]
  const imageAlt = imageMatch?.[1]
  const captionLines = otherLines
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !IMAGE_PATTERN.test(line))
  const caption = captionLines.length > 0 ? captionLines.join(' ') : undefined

  return {
    title,
    statement,
    columns,
    rows,
    empty: rows.length === 0,
    caption,
    ascii,
    image,
    imageAlt,
  }
}

export interface SpeakerBody {
  heading?: string
  photo?: string
  facts?: string[]
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  bluesky?: string
  mastodon?: string
}

const STANDALONE_LINK_PATTERN = /^\[([^\]]+)]\(([^)]+)\)$/

const LINK_LABEL_ALIASES: Record<string, keyof Omit<SpeakerBody, 'heading' | 'photo' | 'facts'>> = {
  website: 'website',
  linkedin: 'linkedin',
  github: 'github',
  twitter: 'twitter',
  x: 'twitter',
  bluesky: 'bluesky',
  mastodon: 'mastodon',
}

/**
 * A `speaker` slide written as Markdown instead of YAML: optional
 * "# Heading", an optional Markdown image for the `photo`, a bullet list
 * for `facts`, and standalone `[label](url)` links whose label
 * (case-insensitive; "x" is an alias for "twitter") matches one of the
 * known social fields.
 */
export function parseSpeakerBody(body: string): SpeakerBody {
  const heading = H1_PATTERN.exec(body)?.[1]?.trim()
  const imageMatch = IMAGE_PATTERN.exec(body)
  const photo = imageMatch?.[2]

  const facts: string[] = []
  const result: SpeakerBody = { heading, photo }

  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    const bullet = parseBulletLine(line)
    if (bullet) {
      facts.push(bullet.text)
      continue
    }
    const linkMatch = STANDALONE_LINK_PATTERN.exec(line)
    if (linkMatch) {
      const key = LINK_LABEL_ALIASES[linkMatch[1].trim().toLowerCase()]
      if (key) result[key] = linkMatch[2].trim()
    }
  }

  return { ...result, facts: facts.length > 0 ? facts : undefined }
}
