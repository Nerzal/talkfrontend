import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PresenterView } from './PresenterView'
import { TalksProvider } from '../data/TalksContext'
import { mockTalksFetch } from '../test/mockTalksFetch'

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

beforeEach(() => {
  mockTalksFetch()
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
    await waitFor(() => expect(screen.getByText(/Rotkäppchen/)).toBeDefined())
    expect(screen.getByText(/Slide 1 \//)).toBeDefined()
  })

  it('shows a placeholder when the current slide has no speaker notes', async () => {
    renderPresenterView('wolf-deleted-oma-2026-07')
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
})
