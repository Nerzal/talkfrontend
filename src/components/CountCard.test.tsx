import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CountCard } from './CountCard'

describe('CountCard', () => {
  it('links to the given target', () => {
    render(
      <MemoryRouter>
        <CountCard to="/2026" count={3}>
          <div>2026</div>
        </CountCard>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link').getAttribute('href')).toBe('/2026')
  })

  it('renders its children and pluralizes the talk count', () => {
    render(
      <MemoryRouter>
        <CountCard to="/2026" count={1}>
          <div>2026</div>
        </CountCard>
      </MemoryRouter>,
    )
    expect(screen.getByText('2026')).toBeDefined()
    expect(screen.getByText('1 talk')).toBeDefined()
  })

  it('pluralizes for counts other than one', () => {
    render(
      <MemoryRouter>
        <CountCard to="/2026" count={2}>
          <div>2026</div>
        </CountCard>
      </MemoryRouter>,
    )
    expect(screen.getByText('2 talks')).toBeDefined()
  })
})
