import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Slide } from '../data/types'
import { SlideRenderer } from './SlideRenderer'
import { REFERENCE_WIDTH, REFERENCE_HEIGHT } from '../lib/referenceCanvas'

interface Props {
  slide: Slide
  stepIndex?: number
  overlay?: ReactNode
  className?: string
}

/**
 * Renders a slide at a fixed 1280x720 reference size, scaled down (via
 * ResizeObserver + CSS transform) to fill whatever box it's placed in —
 * used for the presenter view's current/next-slide thumbnails, which reuse
 * the exact same slide components the audience sees instead of a
 * separately maintained mini layout.
 */
export function ScaledSlidePreview({ slide, stepIndex = 0, overlay, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? el.clientWidth
      setScale(width / REFERENCE_WIDTH)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-black ${className ?? ''}`}
      style={{ aspectRatio: `${REFERENCE_WIDTH} / ${REFERENCE_HEIGHT}` }}
    >
      <div
        className="relative flex flex-col"
        style={{
          width: REFERENCE_WIDTH,
          height: REFERENCE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <SlideRenderer slide={slide} stepIndex={stepIndex} />
        {overlay}
      </div>
    </div>
  )
}
