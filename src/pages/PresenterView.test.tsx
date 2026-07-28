import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PresenterView } from './PresenterView'
import { TalksProvider } from '../data/TalksContext'
import { mockTalksFetch } from '../test/mockTalksFetch'
import { usePresenterChannel } from '../hooks/usePresenterChannel'
import type { PresenterMessage } from '../hooks/usePresenterChannel'

vi.mock('../hooks/usePresenterChannel', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../hooks/usePresenterChannel')>()
  return { ...actual, usePresenterChannel: vi.fn(actual.usePresenterChannel) }
})

type Handler = (msg: PresenterMessage, post: (msg: PresenterMessage) => void) => void

const FRAGMENT_TALK_MARKDOWN = `---
id: frag-test
title: Fragment Test
year: 2026
month: 1
---

--- content
# First
- shown immediately
-> fragment one
-> fragment two

--- blank
# Second Slide
All done
`

const FRAGMENT_DEFAULT_SLIDES_MARKDOWN = `--- blank intro
# Intro Slide

--- blank end
# End Slide
`

function mockFragmentTalkFetch() {
  const jsonFiles: Record<string, unknown> = { 'index.json': ['frag-test'] }
  const textFiles: Record<string, string> = {
    'default-slides.md': FRAGMENT_DEFAULT_SLIDES_MARKDOWN,
    'frag-test/talk.md': FRAGMENT_TALK_MARKDOWN,
  }
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const path = url.replace(/^.*\/talks\//, '')
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(jsonFiles[path]),
        text: () => Promise.resolve(textFiles[path]),
      } as Response)
    }),
  )
}

function renderPresenterView(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/talk/${id}/presenter`]}>
      <TalksProvider>
        <Routes>
          <Route path="/talk/:id/presenter" element={<PresenterView />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </TalksProvider>
    </MemoryRouter>,
  )
}

let capturedHandler: Handler | undefined
let postSpy: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockTalksFetch()
  capturedHandler = undefined
  postSpy = vi.fn()
  vi.mocked(usePresenterChannel).mockImplementation((_talkId, onMessage) => {
    capturedHandler = onMessage
    return { post: postSpy, supported: true }
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('PresenterView', () => {
  it('shows an error message for an unknown talk ID', async () => {
    renderPresenterView('does-not-exist')
    await waitFor(() => expect(screen.getByText(/not found/i)).toBeDefined())
  })

  it('shows the talk title and slide counter', async () => {
    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText(/HILFE!/)).toBeDefined())
    expect(screen.getByText(/Slide 1 \//)).toBeDefined()
  })

  it('shows a placeholder when the current slide has no speaker notes', async () => {
    mockFragmentTalkFetch()
    renderPresenterView('frag-test')
    await waitFor(() => expect(screen.getByText('No notes for this slide.')).toBeDefined())
  })

  it('shows the elapsed timer starting near zero', async () => {
    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByLabelText('Elapsed time')).toBeDefined())
    expect(screen.getByLabelText('Elapsed time').textContent).toMatch(/^00:0[0-2]$/)
  })

  it('advances the slide counter when clicking Next', async () => {
    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText('Next →')).toBeDefined())

    fireEvent.click(screen.getByText('Next →'))

    await waitFor(() => expect(screen.getByText(/Slide 2 \//)).toBeDefined())
  })

  it('toggles the pen tool', async () => {
    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText('Pen')).toBeDefined())

    const penButton = screen.getByText('Pen')
    expect(penButton.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(penButton)
    expect(penButton.getAttribute('aria-pressed')).toBe('true')
  })

  it('opens the audience view in a new tab', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText('Open audience view')).toBeDefined())

    fireEvent.click(screen.getByText('Open audience view'))

    expect(openSpy).toHaveBeenCalledWith('/talk/wolf-deleted-oma-2026-07', '_blank', 'noopener')
  })

  it('closes the tab on Close when there is no history to go back to', async () => {
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})
    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText('Close')).toBeDefined())

    fireEvent.click(screen.getByText('Close'))

    expect(closeSpy).toHaveBeenCalledOnce()
  })

  it('goes back through history on Close when real history exists', async () => {
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(2)

    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText('Close')).toBeDefined())

    fireEvent.click(screen.getByText('Close'))

    expect(backSpy).toHaveBeenCalledOnce()
    expect(closeSpy).not.toHaveBeenCalled()
  })

  it("requests the audience view's current state on mount", async () => {
    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText('Next →')).toBeDefined())

    expect(postSpy).toHaveBeenCalledWith({ type: 'request-state' })
  })

  it('replies to a "request-state" message with its current slide position', async () => {
    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText('Next →')).toBeDefined())

    fireEvent.click(screen.getByText('Next →'))
    await waitFor(() => expect(screen.getByText(/Slide 2 \//)).toBeDefined())

    const reply = vi.fn()
    act(() => {
      capturedHandler?.({ type: 'request-state' }, reply)
    })

    expect(reply).toHaveBeenCalledWith({ type: 'nav', slideIndex: 1, stepIndex: 0 })
  })

  it('broadcasts a "nav" message when navigating locally, but not on mount', async () => {
    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText('Next →')).toBeDefined())

    expect(postSpy).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'nav' }))

    fireEvent.click(screen.getByText('Next →'))

    await waitFor(() =>
      expect(postSpy).toHaveBeenCalledWith({ type: 'nav', slideIndex: 1, stepIndex: 0 }),
    )
  })

  it('follows a "nav" message from the audience-sync channel without re-broadcasting it', async () => {
    renderPresenterView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText(/Slide 1 \//)).toBeDefined())

    act(() => {
      capturedHandler?.({ type: 'nav', slideIndex: 1, stepIndex: 0 }, vi.fn())
    })

    await waitFor(() => expect(screen.getByText(/Slide 2 \//)).toBeDefined())
    expect(postSpy).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'nav' }))
  })

  it('keeps the next-slide preview on the current slide while fragments remain, revealing them ahead of the audience view', async () => {
    mockFragmentTalkFetch()
    renderPresenterView('frag-test')
    await waitFor(() => expect(screen.getByText('Next →')).toBeDefined())

    // Intro has no fragments, so the first click lands on the fragment slide.
    fireEvent.click(screen.getByText('Next →'))
    await waitFor(() => expect(screen.getAllByText('First').length).toBeGreaterThan(0))

    // Still 2 fragments left to reveal -> preview stays on this slide, one step ahead.
    expect(screen.getByText('Next (this slide)')).toBeDefined()
    let fragmentOne = screen.getAllByText('fragment one').map((el) => el.closest('li'))
    let fragmentTwo = screen.getAllByText('fragment two').map((el) => el.closest('li'))
    expect(fragmentOne[0]?.className).toContain('opacity-0')
    expect(fragmentOne[1]?.className).toContain('opacity-100')
    expect(fragmentTwo[0]?.className).toContain('opacity-0')
    expect(fragmentTwo[1]?.className).toContain('opacity-0')

    // 1 fragment left -> preview still on this slide, now showing both revealed.
    fireEvent.click(screen.getByText('Next →'))
    expect(screen.getByText('Next (this slide)')).toBeDefined()
    fragmentOne = screen.getAllByText('fragment one').map((el) => el.closest('li'))
    fragmentTwo = screen.getAllByText('fragment two').map((el) => el.closest('li'))
    expect(fragmentOne[0]?.className).toContain('opacity-100')
    expect(fragmentOne[1]?.className).toContain('opacity-100')
    expect(fragmentTwo[0]?.className).toContain('opacity-0')
    expect(fragmentTwo[1]?.className).toContain('opacity-100')

    // Nothing left to animate -> preview finally switches to the actual next slide.
    fireEvent.click(screen.getByText('Next →'))
    await waitFor(() => expect(screen.getByText('Next slide')).toBeDefined())
    expect(screen.getByText('Second Slide')).toBeDefined()
  })
})
