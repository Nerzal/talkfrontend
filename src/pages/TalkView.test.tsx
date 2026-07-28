import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TalkView } from './TalkView'
import { TalksProvider } from '../data/TalksContext'
import { mockTalksFetch } from '../test/mockTalksFetch'
import { usePresenterChannel } from '../hooks/usePresenterChannel'
import type { PresenterMessage } from '../hooks/usePresenterChannel'

vi.mock('../hooks/usePresenterChannel', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../hooks/usePresenterChannel')>()
  return { ...actual, usePresenterChannel: vi.fn(actual.usePresenterChannel) }
})

type Handler = (msg: PresenterMessage, post: (msg: PresenterMessage) => void) => void

function renderTalkView(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/talk/${id}`]}>
      <TalksProvider>
        <Routes>
          <Route path="/talk/:id" element={<TalkView />} />
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

describe('TalkView', () => {
  it('shows an error message for an unknown talk ID', async () => {
    renderTalkView('does-not-exist')
    await waitFor(() => expect(screen.getByText(/not found/i)).toBeDefined())
  })

  it('renders the default intro slide first', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText(/Nerzal/)).toBeDefined())
  })

  it('renders the talk title slide after the intro', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => screen.getByLabelText('Next slide'))
    fireEvent.click(screen.getByLabelText('Next slide'))
    await waitFor(() => expect(screen.getByText(/Rotkäppchen, CRUD und die Sprache/)).toBeDefined())
  })

  it('shows the progress bar and navigation', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByLabelText('Next slide')).toBeDefined())
    expect(screen.getByLabelText('Previous slide')).toBeDefined()
    expect(screen.getByLabelText('Back to overview')).toBeDefined()
  })

  it('disables the previous-slide button on the first slide', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => {
      const prevBtn: HTMLButtonElement = screen.getByLabelText('Previous slide')
      expect(prevBtn.disabled).toBe(true)
    })
  })

  it('shows the slide counter', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText(/1 \//)).toBeDefined())
  })

  it('opens the presenter view in a new tab', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByLabelText('Open presenter view')).toBeDefined())

    fireEvent.click(screen.getByLabelText('Open presenter view'))

    expect(openSpy).toHaveBeenCalledWith(
      '/talk/wolf-deleted-oma-2026-07/presenter',
      '_blank',
      'noopener',
    )
  })

  it('follows a "nav" message from the presenter-sync channel', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText(/1 \//)).toBeDefined())

    act(() => {
      capturedHandler?.({ type: 'nav', slideIndex: 1, stepIndex: 0 }, vi.fn())
    })

    await waitFor(() => expect(screen.getByText(/Rotkäppchen, CRUD und die Sprache/)).toBeDefined())
  })

  it('broadcasts a "nav" message when navigating locally, but not on mount', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByLabelText('Next slide')).toBeDefined())

    expect(postSpy).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'nav' }))

    fireEvent.click(screen.getByLabelText('Next slide'))

    await waitFor(() =>
      expect(postSpy).toHaveBeenCalledWith({ type: 'nav', slideIndex: 1, stepIndex: 0 }),
    )
  })

  it('does not re-broadcast a "nav" message it just received from the other window', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText(/1 \//)).toBeDefined())

    act(() => {
      capturedHandler?.({ type: 'nav', slideIndex: 1, stepIndex: 0 }, vi.fn())
    })

    await waitFor(() => expect(screen.getByText(/Rotkäppchen, CRUD und die Sprache/)).toBeDefined())
    expect(postSpy).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'nav' }))
  })

  it('renders received drawing strokes as an overlay', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText(/1 \//)).toBeDefined())

    act(() => {
      capturedHandler?.(
        {
          type: 'draw-stroke',
          slideId: 'intro',
          points: [
            { x: 0.1, y: 0.1 },
            { x: 0.5, y: 0.5 },
          ],
          color: '#f97316',
        },
        vi.fn(),
      )
    })

    await waitFor(() => expect(document.querySelector('polyline')).not.toBeNull())
  })
})
