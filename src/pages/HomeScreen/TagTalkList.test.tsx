import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TagTalkList } from './TagTalkList'
import { TalksProvider } from '../../data/TalksContext'
import { mockTalksFetch } from '../../test/mockTalksFetch'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TalksProvider>
        <Routes>
          <Route path="/tags/:tag" element={<TagTalkList />} />
        </Routes>
      </TalksProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  mockTalksFetch()
})

describe('TagTalkList', () => {
  it('shows the tag as heading', async () => {
    renderAt('/tags/event-sourcing')
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'event-sourcing' })).toBeDefined(),
    )
  })

  it('shows the talk tagged with the selected tag', async () => {
    renderAt('/tags/event-sourcing')
    await waitFor(() =>
      expect(screen.getByText('HILFE! Der Wolf hat Großmutter deleted')).toBeDefined(),
    )
  })

  it('includes a breadcrumb with a link back to the tag list', async () => {
    renderAt('/tags/event-sourcing')
    await waitFor(() => expect(screen.getByRole('link', { name: 'Tags' })).toBeDefined())
  })

  it('shows a message for a tag with no talks', async () => {
    renderAt('/tags/nope')
    await waitFor(() => expect(screen.getByText(/No talks with this tag/)).toBeDefined())
  })
})
