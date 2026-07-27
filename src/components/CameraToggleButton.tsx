import { useEffect, useRef } from 'react'
import { useCameraOverlay, isCameraSupported } from '../hooks/useCameraOverlay'

export function CameraToggleButton() {
  const { active, stream, toggle } = useCameraOverlay()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream
  }, [stream])

  if (!isCameraSupported()) return null

  return (
    <>
      <button
        onClick={toggle}
        aria-pressed={active}
        className={`text-xs sm:text-sm transition-colors cursor-pointer p-3 -m-1 ${
          active ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-600 hover:text-white'
        }`}
        aria-label={active ? 'Hide camera' : 'Show camera'}
      >
        ● Camera
      </button>
      {active && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-28 h-20 sm:w-40 sm:h-28 rounded-lg object-cover shadow-lg ring-1 ring-white/20 z-50"
        />
      )}
    </>
  )
}
