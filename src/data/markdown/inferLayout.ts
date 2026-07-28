import type { Slide } from '../types'
import { isFenceBoundary } from './fence'
import { parseStructuredYaml } from './structuredYaml'

const HEADING2_PATTERN = /^##\s+.+$/
const BULLET_PATTERN = /^(?:-|->)\s+.+$/
const IMAGE_PATTERN = /!\[[^\]]*]\([^)]+\)(?:\s+(?:background|left|right|under))?/i
const TABLE_SEPARATOR_LINE = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/
const STANDALONE_LINK_PATTERN = /^\[([^\]]+)]\(([^)]+)\)$/

/** Link labels recognized as a `speaker` slide's social links — see parseSpeakerBody in parseSlideBody.ts. */
const SPEAKER_LINK_LABELS = new Set([
  'website',
  'linkedin',
  'github',
  'twitter',
  'x',
  'bluesky',
  'mastodon',
])

interface MarkdownBlocks {
  heading2: boolean
  bullet: boolean
  image: boolean
  code: boolean
}

/** Fence-aware scan for the Markdown block types that distinguish layouts. */
function scanMarkdownBlocks(body: string): MarkdownBlocks {
  const blocks: MarkdownBlocks = { heading2: false, bullet: false, image: false, code: false }
  let inFence = false

  for (const raw of body.split('\n')) {
    if (isFenceBoundary(raw)) {
      if (!inFence) blocks.code = true
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const line = raw.trim()
    if (!line) continue
    if (HEADING2_PATTERN.test(line)) blocks.heading2 = true
    if (BULLET_PATTERN.test(line)) blocks.bullet = true
    if (IMAGE_PATTERN.test(line)) blocks.image = true
  }

  return blocks
}

/** Fence-aware: does the body contain a GFM table separator row (e.g. "|---|---|")? A strong, low-false-positive signal since ordinary prose never produces a dashes-and-pipes-only line. */
function hasMarkdownTable(body: string): boolean {
  let inFence = false
  for (const raw of body.split('\n')) {
    if (isFenceBoundary(raw)) {
      inFence = !inFence
      continue
    }
    if (!inFence && TABLE_SEPARATOR_LINE.test(raw.trim())) return true
  }
  return false
}

/** Fence-aware: does the body contain a link on its own line labeled with one of `speaker`'s known social fields (e.g. "[github](https://...)")? Requiring the whole line to be just the link avoids misreading an inline link mention inside ordinary bullet/prose text. */
function hasSpeakerLinks(body: string): boolean {
  let inFence = false
  for (const raw of body.split('\n')) {
    if (isFenceBoundary(raw)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const match = STANDALONE_LINK_PATTERN.exec(raw.trim())
    if (match && SPEAKER_LINK_LABELS.has(match[1].trim().toLowerCase())) return true
  }
  return false
}

/**
 * Guesses a slide's layout from its own body when no explicit "--- <layout>"
 * keyword was given on the separator line, so a talk can be written as plain
 * Markdown ("# Heading" + bullets, a fenced code block, an image, a table,
 * ...) without naming a layout up front.
 *
 * `table`/`speaker` bodies can be plain YAML instead of Markdown (see
 * structuredYaml.ts) — recognized when the first line looks like one of
 * their known fields ("title:", "heading:", ...). Otherwise, a GFM table
 * separator row means `table`, and a standalone link labeled with a known
 * social field ("[github](...)") means `speaker`. Everything else is
 * scanned (fence-aware) for headings/bullets/images/code and matched to the
 * closest single-purpose layout; a genuine combination of block types (e.g.
 * bullets alongside a code block) falls back to `mixed`; plain prose or an
 * empty body falls back to `blank`.
 */
export function inferLayout(body: string): Slide['layout'] {
  const trimmed = body.trim()
  if (!trimmed) return 'blank'

  const structured = parseStructuredYaml(trimmed)
  if (structured) return structured.kind

  if (hasMarkdownTable(trimmed)) return 'table'
  if (hasSpeakerLinks(trimmed)) return 'speaker'

  const { heading2, bullet, image, code } = scanMarkdownBlocks(trimmed)

  if (image && !bullet && !code) return 'image'
  if (code && !bullet && !image) return 'code'
  if (bullet && !code && !image) return 'content'
  if (heading2 && !bullet && !code && !image) return 'title'
  if (!heading2 && !bullet && !code && !image) return 'blank'
  return 'mixed'
}
