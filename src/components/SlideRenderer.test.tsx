import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SlideRenderer } from './SlideRenderer'
import type { Slide } from '../data/types'

describe('SlideRenderer', () => {
  it('rendert title-Layout mit Titel und Untertitel', () => {
    const slide: Slide = {
      id: 't1',
      layout: 'title',
      title: 'Mein Vortrag',
      subtitle: 'Ein Untertitel',
      author: 'Test Author',
    }
    render(<SlideRenderer slide={slide} />)
    expect(screen.getByText('Mein Vortrag')).toBeDefined()
    expect(screen.getByText('Ein Untertitel')).toBeDefined()
    expect(screen.getByText('Test Author')).toBeDefined()
  })

  it('rendert content-Layout mit Bulletpoints', () => {
    const slide: Slide = {
      id: 'c1',
      layout: 'content',
      title: 'Agenda',
      bullets: ['Punkt A', 'Punkt B', 'Punkt C'],
    }
    render(<SlideRenderer slide={slide} />)
    expect(screen.getByText('Agenda')).toBeDefined()
    expect(screen.getByText('Punkt A')).toBeDefined()
    expect(screen.getByText('Punkt C')).toBeDefined()
  })

  it('rendert code-Layout mit Codeinhalt', () => {
    const slide: Slide = {
      id: 'k1',
      layout: 'code',
      title: 'Beispiel',
      language: 'typescript',
      code: 'const x = 42',
    }
    render(<SlideRenderer slide={slide} />)
    expect(screen.getByText('Beispiel')).toBeDefined()
    expect(screen.getByText('const x = 42')).toBeDefined()
  })

  it('rendert blank-Layout mit Heading', () => {
    const slide: Slide = {
      id: 'b1',
      layout: 'blank',
      heading: 'Fragen?',
      body: 'github.com/nerzal',
    }
    render(<SlideRenderer slide={slide} />)
    expect(screen.getByText('Fragen?')).toBeDefined()
    expect(screen.getByText('github.com/nerzal')).toBeDefined()
  })
})
