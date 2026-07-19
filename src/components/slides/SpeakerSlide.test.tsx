import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SpeakerSlide } from './SpeakerSlide'
import type { SpeakerSlide as SpeakerSlideData } from '../../data/types'

describe('SpeakerSlide', () => {
  it('renders the heading', () => {
    const slide: SpeakerSlideData = { id: 's1', layout: 'speaker', heading: 'Nerzal' }
    render(<SpeakerSlide slide={slide} />)
    expect(screen.getByText('Nerzal')).toBeDefined()
  })

  it('renders a link label and QR code for each configured link', () => {
    const slide: SpeakerSlideData = {
      id: 's1',
      layout: 'speaker',
      website: 'https://example.com',
      linkedin: 'https://www.linkedin.com/in/example',
      github: 'https://github.com/nerzal',
      twitter: 'https://x.com/nerzal',
      bluesky: 'https://bsky.app/profile/nerzal.bsky.social',
      mastodon: 'https://mastodon.social/@nerzal',
    }
    render(<SpeakerSlide slide={slide} />)
    expect(screen.getByText('Website')).toBeDefined()
    expect(screen.getByText('LinkedIn')).toBeDefined()
    expect(screen.getByText('GitHub')).toBeDefined()
    expect(screen.getByText('X')).toBeDefined()
    expect(screen.getByText('Bluesky')).toBeDefined()
    expect(screen.getByText('Mastodon')).toBeDefined()
    expect(screen.getAllByRole('img', { name: /QR code/ })).toHaveLength(6)
  })

  it('only renders links that are configured', () => {
    const slide: SpeakerSlideData = {
      id: 's1',
      layout: 'speaker',
      github: 'https://github.com/nerzal',
    }
    render(<SpeakerSlide slide={slide} />)
    expect(screen.getByText('GitHub')).toBeDefined()
    expect(screen.queryByText('Website')).toBeNull()
    expect(screen.queryByText('LinkedIn')).toBeNull()
    expect(screen.queryByText('X')).toBeNull()
    expect(screen.queryByText('Bluesky')).toBeNull()
    expect(screen.queryByText('Mastodon')).toBeNull()
  })

  it('renders a brand icon next to website, github, x, bluesky and mastodon labels', () => {
    const slide: SpeakerSlideData = {
      id: 's1',
      layout: 'speaker',
      website: 'https://example.com',
      github: 'https://github.com/nerzal',
      twitter: 'https://x.com/nerzal',
      bluesky: 'https://bsky.app/profile/nerzal.bsky.social',
      mastodon: 'https://mastodon.social/@nerzal',
    }
    render(<SpeakerSlide slide={slide} />)

    for (const label of ['Website', 'GitHub', 'X', 'Bluesky', 'Mastodon']) {
      const icon = screen.getByText(label).querySelector('svg[aria-hidden="true"]')
      expect(icon, `expected an icon next to "${label}"`).not.toBeNull()
    }
  })

  it('does not render an icon next to the LinkedIn label', () => {
    const slide: SpeakerSlideData = {
      id: 's1',
      layout: 'speaker',
      linkedin: 'https://www.linkedin.com/in/example',
    }
    render(<SpeakerSlide slide={slide} />)

    const icon = screen.getByText('LinkedIn').querySelector('svg[aria-hidden="true"]')
    expect(icon).toBeNull()
  })

  it('renders an optional photo', () => {
    const slide: SpeakerSlideData = {
      id: 's1',
      layout: 'speaker',
      heading: 'Nerzal',
      photo: '/speaker.jpg',
    }
    render(<SpeakerSlide slide={slide} />)
    const img = screen.getByAltText('Nerzal')
    expect(img.getAttribute('src')).toBe('/speaker.jpg')
  })

  it('does not render a photo when none is given', () => {
    const slide: SpeakerSlideData = { id: 's1', layout: 'speaker', heading: 'Nerzal' }
    const { container } = render(<SpeakerSlide slide={slide} />)
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders optional facts', () => {
    const slide: SpeakerSlideData = {
      id: 's1',
      layout: 'speaker',
      facts: ['Software Engineer', 'Open Source Enthusiast'],
    }
    render(<SpeakerSlide slide={slide} />)
    expect(screen.getByText('Software Engineer')).toBeDefined()
    expect(screen.getByText('Open Source Enthusiast')).toBeDefined()
  })

  it('renders nothing extra when only a heading is given', () => {
    const slide: SpeakerSlideData = { id: 's1', layout: 'speaker', heading: 'Thank you!' }
    const { container } = render(<SpeakerSlide slide={slide} />)
    expect(screen.getByText('Thank you!')).toBeDefined()
    expect(container.querySelector('svg')).toBeNull()
    expect(container.querySelector('ul')).toBeNull()
  })
})
