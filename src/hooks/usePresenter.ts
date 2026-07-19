import { useEffect } from 'react'

interface UsePresenterOptions {
  onNext: () => void
  onPrev: () => void
  onExit?: () => void
  enabled?: boolean
}

export function usePresenter({ onNext, onPrev, onExit, enabled = true }: UsePresenterOptions) {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault()
          onNext()
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          onPrev()
          break
        case 'Escape':
          if (onExit) {
            e.preventDefault()
            onExit()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNext, onPrev, onExit, enabled])
}
