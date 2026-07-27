import type { Bullet, ContentBlock } from '../types'

const H1_PATTERN = /^#\s+(.+)$/m
const IMAGE_PATTERN = /!\[([^\]]*)\]\(([^)]+)\)/

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
 * paragraph, fenced code), so a "mixed" slide can combine them in any
 * order. Fence-aware: lines inside a code block are never read as headings
 * or bullets.
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
      if (!next || parseBulletLine(next) || /^#{1,2}\s/.test(next) || /^```/.test(next)) break
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
