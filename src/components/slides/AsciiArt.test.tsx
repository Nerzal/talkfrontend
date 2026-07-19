import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AsciiArt } from './AsciiArt'

describe('AsciiArt', () => {
  it('renders all lines of the content', () => {
    const content = `Line 1\nLine 2\nLine 3`
    render(<AsciiArt content={content} />)
    expect(screen.getByText('Line 1')).toBeDefined()
    expect(screen.getByText('Line 2')).toBeDefined()
    expect(screen.getByText('Line 3')).toBeDefined()
  })

  it('replaces empty lines with a space', () => {
    const content = `Top\n\nBottom`
    const { container } = render(<AsciiArt content={content} />)
    const divs = container.querySelectorAll('.font-mono')
    const texts = Array.from(divs).map((d) => d.textContent)
    expect(texts).toContain(' ')
  })

  it('trims leading and trailing blank lines', () => {
    const content = `\n\nContent\n\n`
    render(<AsciiArt content={content} />)
    expect(screen.getByText('Content')).toBeDefined()
  })
})
