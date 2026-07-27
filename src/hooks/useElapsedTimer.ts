import { useCallback, useEffect, useRef, useState } from 'react'

export interface ElapsedTimer {
  elapsedMs: number
  running: boolean
  pause: () => void
  resume: () => void
  reset: () => void
}

const TICK_MS = 500

/** Elapsed-time stopwatch for the presenter view, local to that window — no cross-window sync needed. */
export function useElapsedTimer(): ElapsedTimer {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [running, setRunning] = useState(true)
  const startRef = useRef(0)
  const accumulatedRef = useRef(0)

  useEffect(() => {
    if (!running) return
    startRef.current = Date.now()
    const interval = setInterval(() => {
      setElapsedMs(accumulatedRef.current + (Date.now() - startRef.current))
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [running])

  const pause = useCallback(() => {
    accumulatedRef.current += Date.now() - startRef.current
    setElapsedMs(accumulatedRef.current)
    setRunning(false)
  }, [])

  const resume = useCallback(() => {
    setRunning(true)
  }, [])

  const reset = useCallback(() => {
    accumulatedRef.current = 0
    startRef.current = Date.now()
    setElapsedMs(0)
  }, [])

  return { elapsedMs, running, pause, resume, reset }
}
