import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScaledSlidePreview } from './ScaledSlidePreview'
import type { Slide } from '../data/types'

const slide: Slide = { id: 's1', layout: 'blank', heading: 'Hello there' }

describe('ScaledSlidePreview', () => {
  it('renders the given slide via SlideRenderer', () => {
    render(<ScaledSlidePreview slide={slide} />)
    expect(screen.getByText('Hello there')).toBeDefined()
  })

  it('renders the overlay alongside the slide content', () => {
    render(<ScaledSlidePreview slide={slide} overlay={<div data-testid="overlay" />} />)
    expect(screen.getByTestId('overlay')).toBeDefined()
  })

  it('works without ResizeObserver available (falls back to scale 1)', () => {
    const original = globalThis.ResizeObserver
    // @ts-expect-error - simulating an environment without ResizeObserver
    delete globalThis.ResizeObserver
    render(<ScaledSlidePreview slide={slide} />)
    expect(screen.getByText('Hello there')).toBeDefined()
    globalThis.ResizeObserver = original
  })
})
