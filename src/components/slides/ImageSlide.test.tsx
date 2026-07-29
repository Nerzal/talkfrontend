import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageSlide } from './ImageSlide'
import type { ImageSlide as ImageSlideData } from '../../data/types'

describe('ImageSlide', () => {
  it('renders title, image and caption', () => {
    const slide: ImageSlideData = {
      id: 's1',
      layout: 'image',
      title: 'A photo',
      src: 'a.png',
      alt: 'A photo of a wolf',
      caption: 'Taken in the woods',
    }
    render(<ImageSlide slide={slide} />)

    expect(screen.getByText('A photo')).toBeDefined()
    expect(screen.getByAltText('A photo of a wolf')).toBeDefined()
    expect(screen.getByText('Taken in the woods')).toBeDefined()
  })

  it('tolerates a missing title/caption', () => {
    const slide: ImageSlideData = { id: 's1', layout: 'image', src: 'a.png', alt: 'A photo' }
    render(<ImageSlide slide={slide} />)

    expect(screen.getByAltText('A photo')).toBeDefined()
  })

  it('applies maxHeight/maxWidth as inline style when set', () => {
    const slide: ImageSlideData = {
      id: 's1',
      layout: 'image',
      src: 'a.png',
      alt: 'A photo',
      maxHeight: '50%',
      maxWidth: '30%',
    }
    render(<ImageSlide slide={slide} />)

    const img = screen.getByAltText('A photo')
    expect(img.style.maxHeight).toBe('50%')
    expect(img.style.maxWidth).toBe('30%')
  })
})
