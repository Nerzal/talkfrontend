import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor, renderHook } from '@testing-library/react'
import { TalksProvider, useTalks } from './TalksContext'
import { mockTalksFetch } from '../test/mockTalksFetch'

afterEach(() => {
  vi.unstubAllGlobals()
})

function Consumer() {
  const talks = useTalks()
  return <p>{talks.length} talks loaded</p>
}

describe('TalksProvider', () => {
  it('shows the loading screen initially', () => {
    mockTalksFetch()
    render(
      <TalksProvider>
        <Consumer />
      </TalksProvider>,
    )
    expect(screen.getByText(/loading/i)).toBeDefined()
  })

  it('renders children with the loaded talks once available', async () => {
    mockTalksFetch()
    render(
      <TalksProvider>
        <Consumer />
      </TalksProvider>,
    )
    await waitFor(() => expect(screen.getByText('1 talks loaded')).toBeDefined())
  })

  it('shows an error message when loading fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve(null) } as Response),
      ),
    )
    render(
      <TalksProvider>
        <Consumer />
      </TalksProvider>,
    )
    await waitFor(() => expect(screen.getByText(/could not be loaded/i)).toBeDefined())
  })
})

describe('useTalks', () => {
  it('throws an error outside of TalksProvider', () => {
    const { result } = renderHook(() => {
      try {
        return useTalks()
      } catch (err) {
        return err
      }
    })
    expect(result.current).toBeInstanceOf(Error)
  })
})
