import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { DrawPoint } from '../hooks/usePresenterChannel'
import { containReferenceRect } from '../lib/referenceCanvas'
import type { ContainRect } from '../lib/referenceCanvas'

export interface DrawStroke {
  points: DrawPoint[]
  color: string
}

export const DEFAULT_DRAW_COLOR = '#f97316'
const STROKE_WIDTH = 3

interface Props {
  strokes: DrawStroke[]
  interactive?: boolean
  color?: string
  onStrokeComplete?: (points: DrawPoint[]) => void
}

function toStrokePoints(stroke: DrawStroke): string {
  return stroke.points.map((p) => `${p.x},${p.y}`).join(' ')
}

/**
 * Renders finished annotation strokes as an SVG overlay (0..1 normalized
 * coordinates). Points are normalized against the centered, reference-
 * aspect-ratio ("contain") sub-rect of this component's own container —
 * not the raw container rect — so a stroke lines up whether it's captured
 * in a presenter window (already reference-aspect, via `ScaledSlidePreview`)
 * or replayed in an audience window (an arbitrary full-viewport box, any
 * aspect ratio). When `interactive`, it also captures new freehand strokes
 * via pointer events and reports the finished stroke through
 * `onStrokeComplete` — used only in the presenter view; the audience view
 * renders read-only strokes received over the sync channel.
 */
export function DrawingCanvas({
  strokes,
  interactive = false,
  color = DEFAULT_DRAW_COLOR,
  onStrokeComplete,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRectRef = useRef<{ left: number; top: number } | null>(null)
  const [activePoints, setActivePoints] = useState<DrawPoint[] | null>(null)
  const [subRect, setSubRect] = useState<ContainRect>({ left: 0, top: 0, width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? el.getBoundingClientRect()
      setSubRect(containReferenceRect(width, height))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Only measured once per gesture (on pointer down) rather than on every
  // pointer move, so dragging a stroke doesn't force a layout read at
  // pointermove rate — the container doesn't move mid-gesture.
  function toPoint(e: ReactPointerEvent): DrawPoint {
    const rect = dragRectRef.current ?? containerRef.current!.getBoundingClientRect()
    return {
      x: subRect.width ? (e.clientX - rect.left - subRect.left) / subRect.width : 0,
      y: subRect.height ? (e.clientY - rect.top - subRect.top) / subRect.height : 0,
    }
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!interactive) return
    dragRectRef.current = containerRef.current!.getBoundingClientRect()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setActivePoints([toPoint(e)])
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!interactive || !activePoints) return
    setActivePoints((pts) => (pts ? [...pts, toPoint(e)] : pts))
  }

  function finishStroke() {
    if (!interactive || !activePoints) return
    if (activePoints.length > 1) onStrokeComplete?.(activePoints)
    setActivePoints(null)
    dragRectRef.current = null
  }

  const rendered =
    activePoints && activePoints.length > 1
      ? [...strokes, { points: activePoints, color }]
      : strokes

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${interactive ? 'cursor-crosshair touch-none' : 'pointer-events-none'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishStroke}
      onPointerLeave={finishStroke}
      data-testid="drawing-canvas"
    >
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="absolute"
        style={{
          left: subRect.left,
          top: subRect.top,
          width: subRect.width,
          height: subRect.height,
        }}
      >
        {rendered.map((stroke, i) => (
          <polyline
            key={i}
            points={toStrokePoints(stroke)}
            fill="none"
            stroke={stroke.color}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  )
}
