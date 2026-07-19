import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HomeScreen } from './index'
import { TalksProvider } from '../../data/TalksContext'
import { mockTalksFetch } from '../../test/mockTalksFetch'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TalksProvider>
        <Routes>
          <Route path="/:year/:month" element={<HomeScreen />} />
          <Route path="/:year" element={<HomeScreen />} />
          <Route path="/" element={<HomeScreen />} />
        </Routes>
      </TalksProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  mockTalksFetch()
})

describe('HomeScreen', () => {
  describe('YearList (Pfad: /)', () => {
    it('zeigt die Hauptüberschrift', async () => {
      renderAt('/')
      await waitFor(() => expect(screen.getByRole('heading', { name: 'Vorträge' })).toBeDefined())
    })

    it('zeigt alle verfügbaren Jahre als Links', async () => {
      renderAt('/')
      await waitFor(() => {
        const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'))
        expect(hrefs).toContain('/2026')
      })
    })
  })

  describe('MonthList (Pfad: /:year)', () => {
    it('zeigt das Jahr als Überschrift', async () => {
      renderAt('/2026')
      await waitFor(() => expect(screen.getByRole('heading', { name: '2026' })).toBeDefined())
    })

    it('zeigt den Monat Juli für 2026', async () => {
      renderAt('/2026')
      await waitFor(() => expect(screen.getByText('Juli')).toBeDefined())
    })

    it('enthält Breadcrumb mit Link zur Hauptseite', async () => {
      renderAt('/2026')
      await waitFor(() => expect(screen.getByRole('link', { name: 'Vorträge' })).toBeDefined())
    })
  })

  describe('TalkList (Pfad: /:year/:month)', () => {
    it('zeigt Monatsüberschrift', async () => {
      renderAt('/2026/7')
      await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeDefined())
    })

    it('zeigt den Wolf-Vortrag', async () => {
      renderAt('/2026/7')
      await waitFor(() =>
        expect(screen.getByText('HILFE! Der Wolf hat Großmutter deleted')).toBeDefined(),
      )
    })

    it('zeigt Folien-Anzahl des Vortrags', async () => {
      renderAt('/2026/7')
      await waitFor(() => expect(screen.getByText(/Folien/)).toBeDefined())
    })

    it('enthält Link zum Vortrag', async () => {
      renderAt('/2026/7')
      await waitFor(() => {
        const link = screen.getByRole('link', { name: /Wolf/ })
        expect(link.getAttribute('href')).toBe('/talk/wolf-deleted-oma-2026-07')
      })
    })

    it('zeigt Tags des Vortrags', async () => {
      renderAt('/2026/7')
      await waitFor(() => expect(screen.getByText('event-sourcing')).toBeDefined())
    })

    it('zeigt Meldung bei leerem Monat', async () => {
      renderAt('/2026/1')
      await waitFor(() => expect(screen.getByText(/Keine Vorträge/)).toBeDefined())
    })
  })
})
