import { load } from 'js-yaml'

export interface Frontmatter {
  data: Record<string, unknown>
  rest: string
}

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function extractFrontmatter(source: string): Frontmatter {
  const match = FRONTMATTER_PATTERN.exec(source)
  if (!match) {
    throw new Error('Talk markdown must start with a YAML frontmatter block delimited by "---"')
  }
  const data = (load(match[1]) ?? {}) as Record<string, unknown>
  return { data, rest: source.slice(match[0].length) }
}
