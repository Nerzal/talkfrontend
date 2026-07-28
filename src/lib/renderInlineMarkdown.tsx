import type { ReactNode } from 'react'

const BOLD_PATTERN = /\*\*(.+?)\*\*/g

/** Renders "**bold**" spans within otherwise plain slide text — the only inline Markdown syntax supported in prose fields (titles, bullets, captions, ...). */
export function renderInlineMarkdown(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  BOLD_PATTERN.lastIndex = 0
  while ((match = BOLD_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    parts.push(<strong key={match.index}>{match[1]}</strong>)
    lastIndex = BOLD_PATTERN.lastIndex
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))

  return parts
}
