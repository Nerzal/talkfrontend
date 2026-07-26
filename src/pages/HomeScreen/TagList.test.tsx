import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TagList } from './TagList'
import { TalksProvider } from '../../data/TalksContext'
import { mockTalksFetch } from '../../test/mockTalksFetch'

function renderTagList() {
  return render(
    <MemoryRouter initialEntries={['/tags']}>
      <TalksProvider>
        <TagList />
      </TalksProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  mockTalksFetch()
})

describe('TagList', () => {
  it('shows the Tags heading', async () => {
    renderTagList()
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Tags' })).toBeDefined())
  })

  it('shows all available tags as links', async () => {
    renderTagList()
    await waitFor(() => {
      const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'))
      expect(hrefs).toContain('/tags/event-sourcing')
      expect(hrefs).toContain('/tags/dokumentation')
    })
  })

  it('includes a toggle link back to the year view', async () => {
    renderTagList()
    await waitFor(() => expect(screen.getByRole('link', { name: 'By Year' })).toBeDefined())
  })
})
