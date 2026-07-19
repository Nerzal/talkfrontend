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
  it('shows a link to Talks and the current year', () => {
    renderBreadcrumb(2026)
    expect(screen.getByRole('link', { name: 'Talks' })).toBeDefined()
    expect(screen.getByText('2026')).toBeDefined()
  })

  it('year is not a link at year level', () => {
    renderBreadcrumb(2026)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0].textContent).toBe('Talks')
  })

  it('shows year as link and month name at month level', () => {
    renderBreadcrumb(2026, 7)
    expect(screen.getByRole('link', { name: '2026' })).toBeDefined()
    expect(screen.getByText('July')).toBeDefined()
  })

  it('year link points to /:year', () => {
    renderBreadcrumb(2026, 7)
    const yearLink = screen.getByRole('link', { name: '2026' })
    expect(yearLink.getAttribute('href')).toBe('/2026')
  })

  it('renders all month names correctly', () => {
    const cases = [
      [1, 'January'],
      [2, 'February'],
      [3, 'March'],
      [6, 'June'],
      [12, 'December'],
    ] as const
    for (const [month, name] of cases) {
      const { unmount } = renderBreadcrumb(2025, month)
      expect(screen.getByText(name)).toBeDefined()
      unmount()
    }
  })
})
