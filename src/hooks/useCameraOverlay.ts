import { useCallback, useEffect, useState } from 'react'
import { stopStream } from '../lib/stopStream'

export function isCameraSupported(): boolean {
  return (
    typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function'
  )
}

/** Toggleable local webcam preview (picture-in-picture bubble) — no server, purely local getUserMedia. */
export function useCameraOverlay() {
  const [stream, setStream] = useState<MediaStream | null>(null)

  const stop = useCallback(() => {
    setStream((current) => {
      stopStream(current)
      return null
    })
  }, [])

  const start = useCallback(async () => {
    if (!isCameraSupported()) return
    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(nextStream)
    } catch {
      // Permission denied, or no camera available — not an error to surface.
    }
  }, [])

  const toggle = useCallback(() => {
    if (stream) stop()
    else void start()
  }, [stream, start, stop])

  useEffect(() => {
    return () => stopStream(stream)
  }, [stream])

  return { active: stream !== null, stream, toggle }
}
