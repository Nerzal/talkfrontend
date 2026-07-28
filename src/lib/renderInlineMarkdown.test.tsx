import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderInlineMarkdown } from './renderInlineMarkdown'

describe('renderInlineMarkdown', () => {
  it('renders plain text unchanged when there is no bold marker', () => {
    const { container } = render(<>{renderInlineMarkdown('just plain text')}</>)
    expect(container.textContent).toBe('just plain text')
    expect(container.querySelector('strong')).toBeNull()
  })

  it('renders "**bold**" as a <strong> element', () => {
    const { container } = render(<>{renderInlineMarkdown('hello **world**!')}</>)
    expect(container.textContent).toBe('hello world!')
    expect(container.querySelector('strong')?.textContent).toBe('world')
  })

  it('renders multiple bold spans in one string', () => {
    const { container } = render(<>{renderInlineMarkdown('**a** and **b**')}</>)
    const strongs = container.querySelectorAll('strong')
    expect(strongs).toHaveLength(2)
    expect(strongs[0].textContent).toBe('a')
    expect(strongs[1].textContent).toBe('b')
  })
})
