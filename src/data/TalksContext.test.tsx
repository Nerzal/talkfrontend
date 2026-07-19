import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor, renderHook } from '@testing-library/react'
import { TalksProvider, useTalks } from './TalksContext'
import { mockTalksFetch } from '../test/mockTalksFetch'

afterEach(() => {
  vi.unstubAllGlobals()
})

function Consumer() {
  const talks = useTalks()
  return <p>{talks.length} Talks geladen</p>
}

describe('TalksProvider', () => {
  it('zeigt zunächst den Ladebildschirm', () => {
    mockTalksFetch()
    render(
      <TalksProvider>
        <Consumer />
      </TalksProvider>
    )
    expect(screen.getByText(/geladen/i)).toBeDefined()
  })

  it('rendert die Kinder mit den geladenen Talks sobald verfügbar', async () => {
    mockTalksFetch()
    render(
      <TalksProvider>
        <Consumer />
      </TalksProvider>
    )
    await waitFor(() => expect(screen.getByText('1 Talks geladen')).toBeDefined())
  })

  it('zeigt eine Fehlermeldung, wenn das Laden fehlschlägt', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, status: 500, json: async () => null } as Response)))
    render(
      <TalksProvider>
        <Consumer />
      </TalksProvider>
    )
    await waitFor(() => expect(screen.getByText(/konnten nicht geladen werden/i)).toBeDefined())
  })
})

describe('useTalks', () => {
  it('wirft einen Fehler außerhalb von TalksProvider', () => {
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
