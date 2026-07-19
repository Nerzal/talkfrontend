import { useEffect, useState } from 'react'
import type { Talk } from '../data/types'
import { loadTalks } from '../data/loadTalks'
import { TALKS_DIR } from '../data/talksConfig'

export type LoadTalksState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; talks: Talk[] }

export function useLoadTalks(): LoadTalksState {
  const [state, setState] = useState<LoadTalksState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    loadTalks(TALKS_DIR)
      .then((talks) => {
        if (!cancelled) setState({ status: 'success', talks })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Unbekannter Fehler',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
