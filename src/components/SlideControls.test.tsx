import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SlideControls } from './SlideControls'

const defaultProps = {
  slideIndex: 0,
  totalSlides: 5,
  isFirst: true,
  isLast: false,
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onBack: vi.fn(),
}

describe('SlideControls', () => {
  it('shows the slide counter', () => {
    render(<SlideControls {...defaultProps} slideIndex={2} totalSlides={10} isFirst={false} />)
    expect(screen.getByText('3 / 10')).toBeDefined()
  })

  it('disables the previous button on the first slide', () => {
    render(<SlideControls {...defaultProps} isFirst />)
    const btn: HTMLButtonElement = screen.getByLabelText('Previous slide')
    expect(btn.disabled).toBe(true)
  })

  it('disables the next button on the last slide', () => {
    render(<SlideControls {...defaultProps} isFirst={false} isLast />)
    const btn: HTMLButtonElement = screen.getByLabelText('Next slide')
    expect(btn.disabled).toBe(true)
  })

  it('calls onNext when clicking next', () => {
    const onNext = vi.fn()
    render(<SlideControls {...defaultProps} isFirst={false} onNext={onNext} />)
    fireEvent.click(screen.getByLabelText('Next slide'))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('calls onPrev when clicking previous', () => {
    const onPrev = vi.fn()
    render(<SlideControls {...defaultProps} isFirst={false} onPrev={onPrev} />)
    fireEvent.click(screen.getByLabelText('Previous slide'))
    expect(onPrev).toHaveBeenCalledOnce()
  })

  it('calls onBack when clicking close', () => {
    const onBack = vi.fn()
    render(<SlideControls {...defaultProps} onBack={onBack} />)
    fireEvent.click(screen.getByLabelText('Back to overview'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('shows keyboard hint', () => {
    render(<SlideControls {...defaultProps} />)
    expect(screen.getByText(/presenter remote/)).toBeDefined()
  })
})
