import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TalkViewTopBar } from './TalkViewTopBar'

describe('TalkViewTopBar', () => {
  it('calls onBack when clicking close', () => {
    const onBack = vi.fn()
    render(<TalkViewTopBar onBack={onBack} />)
    fireEvent.click(screen.getByLabelText('Back to overview'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('does not show a presenter-view button when onOpenPresenter is not given', () => {
    render(<TalkViewTopBar onBack={vi.fn()} />)
    expect(screen.queryByLabelText('Open presenter view')).toBeNull()
  })

  it('calls onOpenPresenter when clicking the presenter-view button', () => {
    const onOpenPresenter = vi.fn()
    render(<TalkViewTopBar onBack={vi.fn()} onOpenPresenter={onOpenPresenter} />)
    fireEvent.click(screen.getByLabelText('Open presenter view'))
    expect(onOpenPresenter).toHaveBeenCalledOnce()
  })

  it('is rendered in normal document flow, not as an absolutely-positioned overlay', () => {
    const { container } = render(<TalkViewTopBar onBack={vi.fn()} />)
    expect(container.firstElementChild?.className).not.toContain('absolute')
  })
})
