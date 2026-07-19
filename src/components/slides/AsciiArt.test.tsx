import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AsciiArt } from './AsciiArt'

describe('AsciiArt', () => {
  it('rendert alle Zeilen des Inhalts', () => {
    const content = `Zeile 1\nZeile 2\nZeile 3`
    render(<AsciiArt content={content} />)
    expect(screen.getByText('Zeile 1')).toBeDefined()
    expect(screen.getByText('Zeile 2')).toBeDefined()
    expect(screen.getByText('Zeile 3')).toBeDefined()
  })

  it('ersetzt leere Zeilen durch ein Leerzeichen', () => {
    const content = `Oben\n\nUnten`
    const { container } = render(<AsciiArt content={content} />)
    const divs = container.querySelectorAll('.font-mono')
    const texts = Array.from(divs).map(d => d.textContent)
    expect(texts).toContain(' ')
  })

  it('trimmt führende und abschließende Leerzeilen', () => {
    const content = `\n\nInhalt\n\n`
    render(<AsciiArt content={content} />)
    expect(screen.getByText('Inhalt')).toBeDefined()
  })
})
