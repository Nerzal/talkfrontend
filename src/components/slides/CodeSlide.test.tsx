import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { CodeSlide } from './CodeSlide'
import type { CodeSlide as CodeSlideData } from '../../data/types'

vi.mock('./MagicMoveCodeSlide', () => ({
  default: ({ slide, stepIndex }: { slide: CodeSlideData; stepIndex: number }) => (
    <div data-testid="magic-move">{`${slide.id}:${stepIndex}`}</div>
  ),
}))

describe('CodeSlide', () => {
  it('renders the title when present', () => {
    const slide: CodeSlideData = {
      id: 's1',
      layout: 'code',
      title: 'Example',
      language: 'go',
      code: 'func main() {}',
    }
    render(<CodeSlide slide={slide} />)
    expect(screen.getByText('Example')).toBeDefined()
  })

  it('omits the title when absent', () => {
    const slide: CodeSlideData = {
      id: 's1',
      layout: 'code',
      language: 'go',
      code: 'func main() {}',
    }
    const { container } = render(<CodeSlide slide={slide} />)
    expect(container.querySelector('h2')).toBeNull()
  })

  it('syntax-highlights the code for a known language', () => {
    const slide: CodeSlideData = {
      id: 's1',
      layout: 'code',
      language: 'go',
      code: 'func main() {}',
    }
    const { container } = render(<CodeSlide slide={slide} />)
    const code = container.querySelector('code')
    expect(code?.className).toContain('language-go')
    expect(code?.querySelectorAll('span.token').length).toBeGreaterThan(0)
    expect(within(code!).getByText('func')).toBeDefined()
  })

  it('renders the raw, escaped code for an unrecognized language', () => {
    const slide: CodeSlideData = {
      id: 's1',
      layout: 'code',
      language: 'not-a-real-language',
      code: '<b>hi</b>',
    }
    const { container } = render(<CodeSlide slide={slide} />)
    const code = container.querySelector('code')
    expect(code?.textContent).toBe('<b>hi</b>')
    expect(code?.querySelectorAll('span.token').length).toBe(0)
  })

  it('lazily renders the magic-move component when the slide has steps', async () => {
    const slide: CodeSlideData = {
      id: 's1',
      layout: 'code',
      language: 'go',
      code: 'step 1',
      steps: ['step 2', 'step 3'],
    }
    render(<CodeSlide slide={slide} stepIndex={1} />)

    expect((await screen.findByTestId('magic-move')).textContent).toBe('s1:1')
  })

  it('does not use the magic-move component when there are no steps', () => {
    const slide: CodeSlideData = {
      id: 's1',
      layout: 'code',
      language: 'go',
      code: 'func main() {}',
    }
    render(<CodeSlide slide={slide} stepIndex={0} />)

    expect(screen.queryByTestId('magic-move')).toBeNull()
  })
})
