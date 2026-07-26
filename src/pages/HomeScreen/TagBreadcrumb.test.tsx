import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TagBreadcrumb } from './TagBreadcrumb'

describe('TagBreadcrumb', () => {
  it('shows links to Talks and Tags, and the current tag', () => {
    render(
      <MemoryRouter>
        <TagBreadcrumb tag="event-sourcing" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Talks' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'Tags' }).getAttribute('href')).toBe('/tags')
    expect(screen.getByText('event-sourcing')).toBeDefined()
  })
})
