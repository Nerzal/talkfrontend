import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SlideRenderer } from './SlideRenderer'
import type { Slide } from '../data/types'

describe('SlideRenderer', () => {
  it('renders title layout with title and subtitle', () => {
    const slide: Slide = {
      id: 't1',
      layout: 'title',
      title: 'My Talk',
      subtitle: 'A subtitle',
      author: 'Test Author',
    }
    render(<SlideRenderer slide={slide} />)
    expect(screen.getByText('My Talk')).toBeDefined()
    expect(screen.getByText('A subtitle')).toBeDefined()
    expect(screen.getByText('Test Author')).toBeDefined()
  })

  it('renders content layout with bullet points', () => {
    const slide: Slide = {
      id: 'c1',
      layout: 'content',
      title: 'Agenda',
      bullets: ['Point A', 'Point B', 'Point C'],
    }
    render(<SlideRenderer slide={slide} />)
    expect(screen.getByText('Agenda')).toBeDefined()
    expect(screen.getByText('Point A')).toBeDefined()
    expect(screen.getByText('Point C')).toBeDefined()
  })

  it('renders code layout with code content', () => {
    const slide: Slide = {
      id: 'k1',
      layout: 'code',
      title: 'Example',
      language: 'typescript',
      code: 'const x = 42',
    }
    const { container } = render(<SlideRenderer slide={slide} />)
    expect(screen.getByText('Example')).toBeDefined()
    expect(container.querySelector('code')?.textContent).toBe('const x = 42')
  })

  it('renders blank layout with heading', () => {
    const slide: Slide = {
      id: 'b1',
      layout: 'blank',
      heading: 'Questions?',
      body: 'github.com/nerzal',
    }
    render(<SlideRenderer slide={slide} />)
    expect(screen.getByText('Questions?')).toBeDefined()
    expect(screen.getByText('github.com/nerzal')).toBeDefined()
  })

  it('renders speaker layout with heading and links', () => {
    const slide: Slide = {
      id: 'sp1',
      layout: 'speaker',
      heading: 'Nerzal',
      github: 'https://github.com/nerzal',
    }
    render(<SlideRenderer slide={slide} />)
    expect(screen.getByText('Nerzal')).toBeDefined()
    expect(screen.getByText('GitHub')).toBeDefined()
  })

  it('renders mixed layout with combined blocks', () => {
    const slide: Slide = {
      id: 'm1',
      layout: 'mixed',
      blocks: [
        { type: 'heading', level: 1, text: 'Mixed heading' },
        { type: 'bullets', items: ['One'] },
      ],
    }
    render(<SlideRenderer slide={slide} />)
    expect(screen.getByText('Mixed heading')).toBeDefined()
    expect(screen.getByText('One')).toBeDefined()
  })
})
