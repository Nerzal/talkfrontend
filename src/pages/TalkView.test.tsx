import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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
  it('zeigt Fehlermeldung für unbekannte Vortrag-ID', async () => {
    renderTalkView('existiert-nicht')
    await waitFor(() => expect(screen.getByText(/nicht gefunden/i)).toBeDefined())
  })

  it('rendert die erste Folie des Wolf-Vortrags', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText(/Eine Geschichte über CRUD/)).toBeDefined())
  })

  it('zeigt den Fortschrittsbalken und Navigation', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByLabelText('Nächste Folie')).toBeDefined())
    expect(screen.getByLabelText('Vorherige Folie')).toBeDefined()
    expect(screen.getByLabelText('Zurück zur Übersicht')).toBeDefined()
  })

  it('deaktiviert Vorherige-Folie-Button auf der ersten Folie', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => {
      const prevBtn: HTMLButtonElement = screen.getByLabelText('Vorherige Folie')
      expect(prevBtn.disabled).toBe(true)
    })
  })

  it('zeigt Folien-Zähler', async () => {
    renderTalkView('wolf-deleted-oma-2026-07')
    await waitFor(() => expect(screen.getByText(/1 \//)).toBeDefined())
  })
})
