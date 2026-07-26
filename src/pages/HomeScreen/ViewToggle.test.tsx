import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ViewToggle } from './ViewToggle'

function renderToggle(active: 'year' | 'tag') {
  return render(
    <MemoryRouter>
      <ViewToggle active={active} />
    </MemoryRouter>,
  )
}

describe('ViewToggle', () => {
  it('links to / and /tags', () => {
    renderToggle('year')
    expect(screen.getByRole('link', { name: 'By Year' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'By Tag' }).getAttribute('href')).toBe('/tags')
  })

  it('highlights the active year tab', () => {
    renderToggle('year')
    expect(screen.getByRole('link', { name: 'By Year' }).className).toContain('bg-indigo-500')
    expect(screen.getByRole('link', { name: 'By Tag' }).className).not.toContain('bg-indigo-500')
  })

  it('highlights the active tag tab', () => {
    renderToggle('tag')
    expect(screen.getByRole('link', { name: 'By Tag' }).className).toContain('bg-indigo-500')
    expect(screen.getByRole('link', { name: 'By Year' }).className).not.toContain('bg-indigo-500')
  })
})
