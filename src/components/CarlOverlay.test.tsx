import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CarlOverlay } from './CarlOverlay'

const MIN_INTERVAL_MS = 40_000
const VISIBLE_DURATION_MS = 7_000
const MAX_APPEARANCES = 5

describe('CarlOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders nothing when presentation has Carl disabled', () => {
    const { container } = render(
      <CarlOverlay presentationEnabled={false} currentSlideAllowsCarl={true} slideIndex={1} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when the current slide does not allow Carl', () => {
    const { container } = render(
      <CarlOverlay presentationEnabled={true} currentSlideAllowsCarl={false} slideIndex={1} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('slides in from a random side after a random delay, then slides back out', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    render(<CarlOverlay presentationEnabled={true} currentSlideAllowsCarl={true} slideIndex={1} />)

    const slider = screen.getByTestId('carl-slider')

    act(() => {
      vi.advanceTimersByTime(MIN_INTERVAL_MS)
    })
    expect(slider.style.transform).toBe('translateY(0)')
    expect(screen.getByAltText('Karl Klammer')).toBeDefined()

    act(() => {
      vi.advanceTimersByTime(VISIBLE_DURATION_MS)
    })
    expect(slider.style.transform).toBe('translateY(-150%)')
  })

  it('stops scheduling once disabled', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const { rerender } = render(
      <CarlOverlay presentationEnabled={true} currentSlideAllowsCarl={true} slideIndex={1} />,
    )
    act(() => {
      vi.advanceTimersByTime(MIN_INTERVAL_MS)
    })
    expect(screen.getByTestId('carl-slider').style.transform).toBe('translateY(0)')

    rerender(
      <CarlOverlay presentationEnabled={false} currentSlideAllowsCarl={true} slideIndex={1} />,
    )
    expect(screen.queryByTestId('carl-slider')).toBeNull()
  })

  it('never appears more than the maximum number of times', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const { rerender } = render(
      <CarlOverlay presentationEnabled={true} currentSlideAllowsCarl={true} slideIndex={0} />,
    )
    const slider = screen.getByTestId('carl-slider')

    for (let i = 0; i < MAX_APPEARANCES; i++) {
      // A new slide each time — otherwise the same-slide guard would block
      // every appearance after the first regardless of the max-count cap.
      rerender(
        <CarlOverlay presentationEnabled={true} currentSlideAllowsCarl={true} slideIndex={i + 1} />,
      )
      act(() => {
        vi.advanceTimersByTime(MIN_INTERVAL_MS)
      })
      expect(slider.style.transform).toBe('translateY(0)')
      act(() => {
        vi.advanceTimersByTime(VISIBLE_DURATION_MS)
      })
      expect(slider.style.transform).toBe('translateY(-150%)')
    }

    rerender(
      <CarlOverlay presentationEnabled={true} currentSlideAllowsCarl={true} slideIndex={99} />,
    )
    act(() => {
      vi.advanceTimersByTime(MIN_INTERVAL_MS * 2)
    })
    expect(slider.style.transform).toBe('translateY(-150%)')
  })

  it('never shows twice on the same slide, resetting the timer when it tries to', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const { rerender } = render(
      <CarlOverlay presentationEnabled={true} currentSlideAllowsCarl={true} slideIndex={1} />,
    )
    const slider = screen.getByTestId('carl-slider')

    act(() => {
      vi.advanceTimersByTime(MIN_INTERVAL_MS)
    })
    expect(slider.style.transform).toBe('translateY(0)')
    act(() => {
      vi.advanceTimersByTime(VISIBLE_DURATION_MS)
    })
    expect(slider.style.transform).toBe('translateY(-150%)')

    // Still the same slide — the next scheduled attempt should reset the
    // timer instead of showing Karl again.
    act(() => {
      vi.advanceTimersByTime(MIN_INTERVAL_MS)
    })
    expect(slider.style.transform).toBe('translateY(-150%)')
    act(() => {
      vi.advanceTimersByTime(MIN_INTERVAL_MS)
    })
    expect(slider.style.transform).toBe('translateY(-150%)')

    // Once the slide actually changes, Karl is allowed to appear again.
    rerender(
      <CarlOverlay presentationEnabled={true} currentSlideAllowsCarl={true} slideIndex={2} />,
    )
    act(() => {
      vi.advanceTimersByTime(MIN_INTERVAL_MS)
    })
    expect(slider.style.transform).toBe('translateY(0)')
  })
})
