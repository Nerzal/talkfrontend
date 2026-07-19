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
  it('zeigt den Folien-Zähler', () => {
    render(<SlideControls {...defaultProps} slideIndex={2} totalSlides={10} isFirst={false} />)
    expect(screen.getByText('3 / 10')).toBeDefined()
  })

  it('Vorherige-Button ist deaktiviert auf der ersten Folie', () => {
    render(<SlideControls {...defaultProps} isFirst />)
    const btn: HTMLButtonElement = screen.getByLabelText('Vorherige Folie')
    expect(btn.disabled).toBe(true)
  })

  it('Nächste-Button ist deaktiviert auf der letzten Folie', () => {
    render(<SlideControls {...defaultProps} isFirst={false} isLast />)
    const btn: HTMLButtonElement = screen.getByLabelText('Nächste Folie')
    expect(btn.disabled).toBe(true)
  })

  it('ruft onNext auf bei Klick auf Nächste', () => {
    const onNext = vi.fn()
    render(<SlideControls {...defaultProps} isFirst={false} onNext={onNext} />)
    fireEvent.click(screen.getByLabelText('Nächste Folie'))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('ruft onPrev auf bei Klick auf Vorherige', () => {
    const onPrev = vi.fn()
    render(<SlideControls {...defaultProps} isFirst={false} onPrev={onPrev} />)
    fireEvent.click(screen.getByLabelText('Vorherige Folie'))
    expect(onPrev).toHaveBeenCalledOnce()
  })

  it('ruft onBack auf bei Klick auf Schließen', () => {
    const onBack = vi.fn()
    render(<SlideControls {...defaultProps} onBack={onBack} />)
    fireEvent.click(screen.getByLabelText('Zurück zur Übersicht'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('zeigt Keyboard-Hinweis', () => {
    render(<SlideControls {...defaultProps} />)
    expect(screen.getByText(/Presenter-Fernbedienung/)).toBeDefined()
  })
})
