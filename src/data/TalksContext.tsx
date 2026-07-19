import { createContext, useContext, type ReactNode } from 'react'
import type { Talk } from './types'
import { useLoadTalks } from '../hooks/useLoadTalks'
import { LoadingScreen } from '../components/LoadingScreen'
import { ErrorScreen } from '../components/ErrorScreen'

const TalksContext = createContext<Talk[] | null>(null)

interface Props {
  children: ReactNode
}

export function TalksProvider({ children }: Props) {
  const state = useLoadTalks()

  if (state.status === 'loading') return <LoadingScreen />
  if (state.status === 'error') return <ErrorScreen message={state.message} />

  return <TalksContext.Provider value={state.talks}>{children}</TalksContext.Provider>
}

export function useTalks(): Talk[] {
  const talks = useContext(TalksContext)
  if (talks === null) {
    throw new Error('useTalks() must be called within <TalksProvider>')
  }
  return talks
}
