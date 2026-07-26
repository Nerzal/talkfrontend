import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MagicMoveCodeSlide from './MagicMoveCodeSlide'
import type { CodeSlide as CodeSlideData } from '../../data/types'

vi.mock('shiki/core', () => ({
  createHighlighterCore: vi.fn(() => Promise.resolve({ id: 'fake-highlighter' })),
}))
vi.mock('shiki/engine/javascript', () => ({
  createJavaScriptRegexEngine: vi.fn(() => ({})),
}))
vi.mock('@shikijs/magic-move/react', () => ({
  ShikiMagicMove: ({ code, lang }: { code: string; lang: string }) => (
    <div data-testid="shiki-magic-move">{`${lang}:${code}`}</div>
  ),
}))

describe('MagicMoveCodeSlide', () => {
  it('shows a plain-highlighted fallback for the current step before Shiki has loaded', async () => {
    const slide: CodeSlideData = {
      id: 's1',
      layout: 'code',
      language: 'go',
      code: 'step 1',
      steps: ['step 2'],
    }
    const { container } = render(<MagicMoveCodeSlide slide={slide} stepIndex={1} />)

    expect(container.querySelector('code')?.textContent).toBe('step 2')
    expect(screen.queryByTestId('shiki-magic-move')).toBeNull()

    // Let the mocked highlighter settle before the test ends, so the state
    // update doesn't leak into (and warn in) a later test.
    await screen.findByTestId('shiki-magic-move')
  })

  it('renders ShikiMagicMove with the resolved step code once Shiki has loaded', async () => {
    const slide: CodeSlideData = {
      id: 's1',
      layout: 'code',
      language: 'go',
      code: 'step 1',
      steps: ['step 2', 'step 3'],
    }
    render(<MagicMoveCodeSlide slide={slide} stepIndex={2} />)

    expect((await screen.findByTestId('shiki-magic-move')).textContent).toBe('go:step 3')
  })

  it('normalizes a common language alias to the canonical Shiki name', async () => {
    const slide: CodeSlideData = {
      id: 's1',
      layout: 'code',
      language: 'ts',
      code: 'const x = 1',
      steps: ['const x = 2'],
    }
    render(<MagicMoveCodeSlide slide={slide} stepIndex={0} />)

    expect((await screen.findByTestId('shiki-magic-move')).textContent).toBe(
      'typescript:const x = 1',
    )
  })

  it('keeps showing the plain fallback for a language Shiki has no bundled grammar for', async () => {
    const slide: CodeSlideData = {
      id: 's1',
      layout: 'code',
      language: 'not-a-real-language',
      code: 'step 1',
      steps: ['step 2'],
    }
    const { container } = render(<MagicMoveCodeSlide slide={slide} stepIndex={0} />)

    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(screen.queryByTestId('shiki-magic-move')).toBeNull()
    expect(container.querySelector('code')?.textContent).toBe('step 1')
  })
})
