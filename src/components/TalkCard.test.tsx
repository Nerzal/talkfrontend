import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TalkCard } from './TalkCard'
import type { Talk } from '../data/types'

const talk: Talk = {
  id: 'my-talk',
  title: 'My Talk',
  description: 'A short description.',
  year: 2026,
  month: 7,
  slides: [
    { id: 's1', layout: 'blank' },
    { id: 's2', layout: 'blank' },
  ],
  tags: ['go', 'architecture'],
}

function renderCard(t: Talk) {
  return render(
    <MemoryRouter>
      <TalkCard talk={t} />
    </MemoryRouter>,
  )
}

describe('TalkCard', () => {
  it('links to the talk view', () => {
    renderCard(talk)
    expect(screen.getByRole('link', { name: /My Talk/ }).getAttribute('href')).toBe('/talk/my-talk')
  })

  it('shows the slide count', () => {
    renderCard(talk)
    expect(screen.getByText('2 slides')).toBeDefined()
  })

  it('shows the description', () => {
    renderCard(talk)
    expect(screen.getByText('A short description.')).toBeDefined()
  })

  it('shows the tags', () => {
    renderCard(talk)
    expect(screen.getByText('go')).toBeDefined()
    expect(screen.getByText('architecture')).toBeDefined()
  })

  it('omits the tag list when there are no tags', () => {
    renderCard({ ...talk, tags: undefined })
    expect(screen.queryByText('go')).toBeNull()
  })
})
