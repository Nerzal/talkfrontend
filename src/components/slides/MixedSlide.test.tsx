import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MixedSlide } from './MixedSlide'
import type { MixedSlide as MixedSlideData } from '../../data/types'

describe('MixedSlide', () => {
  it('renders headings, bullets, paragraphs and code in order', () => {
    const slide: MixedSlideData = {
      id: 's1',
      layout: 'mixed',
      blocks: [
        { type: 'heading', level: 1, text: 'Big heading' },
        { type: 'paragraph', text: 'Some intro text.' },
        { type: 'bullets', items: [{ text: 'Point 1' }, { text: 'Point 2' }] },
        { type: 'heading', level: 2, text: 'Smaller heading' },
        { type: 'code', language: 'go', code: 'func main() {}' },
      ],
    }
    const { container } = render(<MixedSlide slide={slide} />)

    expect(screen.getByText('Big heading').tagName).toBe('H2')
    expect(screen.getByText('Smaller heading').tagName).toBe('H3')
    expect(screen.getByText('Some intro text.')).toBeDefined()
    expect(screen.getByText('Point 1')).toBeDefined()
    expect(screen.getByText('Point 2')).toBeDefined()
    expect(container.querySelector('code')?.textContent).toBe('func main() {}')
  })

  it('renders blocks in the given order regardless of type', () => {
    const slide: MixedSlideData = {
      id: 's1',
      layout: 'mixed',
      blocks: [
        { type: 'paragraph', text: 'First' },
        { type: 'heading', level: 1, text: 'Second' },
      ],
    }
    const { container } = render(<MixedSlide slide={slide} />)

    const texts = Array.from(container.querySelectorAll('p, h2, h3')).map((el) => el.textContent)
    expect(texts).toEqual(['First', 'Second'])
  })

  it('numbers fragment bullets across separate bullet blocks and reveals them by stepIndex', () => {
    const slide: MixedSlideData = {
      id: 's1',
      layout: 'mixed',
      blocks: [
        { type: 'bullets', items: [{ text: 'Group A', fragment: true }] },
        { type: 'paragraph', text: 'Between' },
        { type: 'bullets', items: [{ text: 'Group B', fragment: true }] },
      ],
    }
    const opacityOf = (text: string) =>
      screen.getByText(text).closest('li')?.className.includes('opacity-0')

    const { rerender } = render(<MixedSlide slide={slide} stepIndex={0} />)
    expect(opacityOf('Group A')).toBe(true)
    expect(opacityOf('Group B')).toBe(true)

    rerender(<MixedSlide slide={slide} stepIndex={1} />)
    expect(opacityOf('Group A')).toBe(false)
    expect(opacityOf('Group B')).toBe(true)

    rerender(<MixedSlide slide={slide} stepIndex={2} />)
    expect(opacityOf('Group B')).toBe(false)
  })

  it('renders a "under"-position image inline with the rest of the content', () => {
    const slide: MixedSlideData = {
      id: 's1',
      layout: 'mixed',
      blocks: [
        { type: 'paragraph', text: 'Before' },
        { type: 'image', src: 'a.png', alt: 'A photo', position: 'under' },
        { type: 'paragraph', text: 'After' },
      ],
    }
    render(<MixedSlide slide={slide} />)

    expect(screen.getByAltText('A photo')).toBeDefined()
    expect(screen.getByText('Before')).toBeDefined()
    expect(screen.getByText('After')).toBeDefined()
  })

  it('renders a "left"-position image in its own column beside the other blocks', () => {
    const slide: MixedSlideData = {
      id: 's1',
      layout: 'mixed',
      blocks: [
        { type: 'image', src: 'a.png', alt: 'A photo', position: 'left' },
        { type: 'paragraph', text: 'Some text' },
      ],
    }
    const { container } = render(<MixedSlide slide={slide} />)

    const img = screen.getByAltText('A photo')
    const paragraph = screen.getByText('Some text')
    expect(img.closest('div')).not.toBe(paragraph.closest('div'))
    expect(container.querySelector('img')).toBeDefined()
  })

  it('renders "left" and "right" images in separate columns flanking the main content', () => {
    const slide: MixedSlideData = {
      id: 's1',
      layout: 'mixed',
      blocks: [
        { type: 'image', src: 'left.png', alt: 'Left photo', position: 'left' },
        { type: 'paragraph', text: 'Middle text' },
        { type: 'image', src: 'right.png', alt: 'Right photo', position: 'right' },
      ],
    }
    render(<MixedSlide slide={slide} />)

    expect(screen.getByAltText('Left photo')).toBeDefined()
    expect(screen.getByAltText('Right photo')).toBeDefined()
    expect(screen.getByText('Middle text')).toBeDefined()
  })
})
