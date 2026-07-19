import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Breadcrumb } from './Breadcrumb'

function renderBreadcrumb(year: number, month?: number) {
  return render(
    <MemoryRouter>
      <Breadcrumb year={year} month={month} />
    </MemoryRouter>,
  )
}

describe('Breadcrumb', () => {
  it('zeigt Link zu Vorträge und aktuelles Jahr', () => {
    renderBreadcrumb(2026)
    expect(screen.getByRole('link', { name: 'Vorträge' })).toBeDefined()
    expect(screen.getByText('2026')).toBeDefined()
  })

  it('Jahr ist kein Link auf Jahres-Ebene', () => {
    renderBreadcrumb(2026)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0].textContent).toBe('Vorträge')
  })

  it('zeigt Jahr als Link und Monatsname auf Monats-Ebene', () => {
    renderBreadcrumb(2026, 7)
    expect(screen.getByRole('link', { name: '2026' })).toBeDefined()
    expect(screen.getByText('Juli')).toBeDefined()
  })

  it('Jahr-Link verweist auf /:year', () => {
    renderBreadcrumb(2026, 7)
    const yearLink = screen.getByRole('link', { name: '2026' })
    expect(yearLink.getAttribute('href')).toBe('/2026')
  })

  it('rendert alle deutschen Monatsnamen korrekt', () => {
    const cases = [
      [1, 'Januar'],
      [2, 'Februar'],
      [3, 'März'],
      [6, 'Juni'],
      [12, 'Dezember'],
    ] as const
    for (const [month, name] of cases) {
      const { unmount } = renderBreadcrumb(2025, month)
      expect(screen.getByText(name)).toBeDefined()
      unmount()
    }
  })
})
