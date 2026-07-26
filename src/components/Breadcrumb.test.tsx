import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Breadcrumb, type Crumb } from './Breadcrumb'

function renderBreadcrumb(crumbs: Crumb[]) {
  return render(
    <MemoryRouter>
      <Breadcrumb crumbs={crumbs} />
    </MemoryRouter>,
  )
}

describe('Breadcrumb', () => {
  it('shows a link to Talks and the current year', () => {
    renderBreadcrumb([{ label: 'Talks', to: '/' }, { label: '2026' }])
    expect(screen.getByRole('link', { name: 'Talks' })).toBeDefined()
    expect(screen.getByText('2026')).toBeDefined()
  })

  it('only the crumbs with a target render as links', () => {
    renderBreadcrumb([{ label: 'Talks', to: '/' }, { label: '2026' }])
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0].textContent).toBe('Talks')
  })

  it('shows year as link and month name at month level', () => {
    renderBreadcrumb([
      { label: 'Talks', to: '/' },
      { label: '2026', to: '/2026' },
      { label: 'July' },
    ])
    expect(screen.getByRole('link', { name: '2026' })).toBeDefined()
    expect(screen.getByText('July')).toBeDefined()
  })

  it('year link points to /:year', () => {
    renderBreadcrumb([
      { label: 'Talks', to: '/' },
      { label: '2026', to: '/2026' },
      { label: 'July' },
    ])
    const yearLink = screen.getByRole('link', { name: '2026' })
    expect(yearLink.getAttribute('href')).toBe('/2026')
  })

  it('supports an arbitrary number of crumbs', () => {
    renderBreadcrumb([{ label: 'Talks', to: '/' }, { label: 'Tags', to: '/tags' }, { label: 'go' }])
    expect(screen.getByRole('link', { name: 'Tags' }).getAttribute('href')).toBe('/tags')
    expect(screen.getByText('go')).toBeDefined()
  })
})
