import { useState } from 'react'
import type { DrawStroke } from '../components/DrawingCanvas'

/**
 * Drawing strokes for the currently displayed slide, cleared whenever the
 * slide id changes. Uses the "adjust state during render" pattern (not an
 * effect) so the reset happens in the same render as the slide change,
 * satisfying the react-hooks/set-state-in-effect rule. Shared by
 * PresenterView (interactive) and TalkView (read-only) so both clear on
 * exactly the same condition.
 */
export function useSlideStrokes(slideId: string) {
  const [strokes, setStrokes] = useState<DrawStroke[]>([])
  const [strokesSlideId, setStrokesSlideId] = useState(slideId)

  if (slideId !== strokesSlideId) {
    setStrokesSlideId(slideId)
    setStrokes([])
  }

  return [strokes, setStrokes] as const
}
