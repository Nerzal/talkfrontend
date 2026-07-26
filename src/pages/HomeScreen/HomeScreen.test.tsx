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
  describe('YearList (path: /)', () => {
    it('shows the main heading', async () => {
      renderAt('/')
      await waitFor(() => expect(screen.getByRole('heading', { name: 'Talks' })).toBeDefined())
    })

    it('shows all available years as links', async () => {
      renderAt('/')
      await waitFor(() => {
        const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'))
        expect(hrefs).toContain('/2026')
      })
    })
  })

  describe('MonthList (path: /:year)', () => {
    it('shows the year as heading', async () => {
      renderAt('/2026')
      await waitFor(() => expect(screen.getByRole('heading', { name: '2026' })).toBeDefined())
    })

    it('shows July for 2026', async () => {
      renderAt('/2026')
      await waitFor(() => expect(screen.getByText('July')).toBeDefined())
    })

    it('includes a breadcrumb with a link to the home page', async () => {
      renderAt('/2026')
      await waitFor(() => expect(screen.getByRole('link', { name: 'Talks' })).toBeDefined())
    })
  })

  describe('TalkList (path: /:year/:month)', () => {
    it('shows the month heading', async () => {
      renderAt('/2026/7')
      await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeDefined())
    })

    it('shows the wolf talk', async () => {
      renderAt('/2026/7')
      await waitFor(() =>
        expect(screen.getByText('HILFE! Der Wolf hat Großmutter deleted')).toBeDefined(),
      )
    })

    it('shows the talk slide count', async () => {
      renderAt('/2026/7')
      await waitFor(() => expect(screen.getAllByText(/slides/).length).toBeGreaterThan(0))
    })

    it('includes a link to the talk', async () => {
      renderAt('/2026/7')
      await waitFor(() => {
        const link = screen.getByRole('link', { name: /Wolf/ })
        expect(link.getAttribute('href')).toBe('/talk/wolf-deleted-oma-2026-07')
      })
    })

    it('shows the talk tags', async () => {
      renderAt('/2026/7')
      await waitFor(() => expect(screen.getByText('event-sourcing')).toBeDefined())
    })

    it('shows a message for an empty month', async () => {
      renderAt('/2026/1')
      await waitFor(() => expect(screen.getByText(/No talks/)).toBeDefined())
    })
  })
})
