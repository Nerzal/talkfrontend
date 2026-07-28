import { load } from 'js-yaml'

const FIRST_KEY_PATTERN = /^([A-Za-z_][\w-]*)\s*:(?:\s|$)/

/**
 * Field names that only ever appear on `table`/`speaker` slides (see
 * buildSlide.ts) — used to recognize a plain-YAML body from its first line
 * without false-triggering on ordinary prose that happens to contain a
 * colon (e.g. "Note: ..."), since those don't start with one of these exact
 * (mostly lowercase) keys.
 */
const STRUCTURED_KEYS = new Set([
  'title',
  'statement',
  'columns',
  'rows',
  'empty',
  'caption',
  'ascii',
  'image',
  'imageAlt',
  'heading',
  'photo',
  'facts',
  'website',
  'linkedin',
  'github',
  'twitter',
  'bluesky',
  'mastodon',
])

function firstNonBlankLine(body: string): string | undefined {
  return body
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0)
}

export interface StructuredYaml {
  kind: 'table' | 'speaker'
  config: Record<string, unknown>
}

/**
 * `table`/`speaker` slides can be written as plain YAML instead of Markdown
 * — their data (row variants, ascii art, social links) doesn't always map
 * cleanly onto Markdown prose (see parseTableBody/parseSpeakerBody in
 * parseSlideBody.ts for the Markdown alternative). A body is recognized as
 * YAML here when its first line looks like one of their known fields
 * ("title:", "heading:", ...), so an ordinary Markdown paragraph that
 * happens to contain a colon (e.g. "Note: ...") isn't misread as YAML.
 * Returns undefined when the body isn't YAML-shaped, meaning it should be
 * parsed as Markdown instead.
 */
export function parseStructuredYaml(body: string): StructuredYaml | undefined {
  const trimmed = body.trim()
  const first = firstNonBlankLine(trimmed)
  const key = first ? FIRST_KEY_PATTERN.exec(first)?.[1] : undefined
  if (!key || !STRUCTURED_KEYS.has(key)) return undefined

  try {
    const config = load(trimmed)
    if (config && typeof config === 'object' && !Array.isArray(config)) {
      return {
        kind: 'columns' in config ? 'table' : 'speaker',
        config: config as Record<string, unknown>,
      }
    }
  } catch {
    // Not actually valid YAML after all — treat the body as Markdown instead.
  }
  return undefined
}
