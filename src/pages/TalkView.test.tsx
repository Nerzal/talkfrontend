import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TalkView } from './TalkView'
import { TalksProvider } from '../data/TalksContext'
import { mockTalksFetch } from '../test/mockTalksFetch'

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

beforeEach(() => {
  mockTalksFetch()
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
    await waitFor(() => expect(screen.getByText(/Eine Geschichte über CRUD/)).toBeDefined())
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
})
