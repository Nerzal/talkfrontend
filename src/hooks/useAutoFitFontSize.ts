import { useLayoutEffect, useRef, useState } from 'react'

const MIN_FONT_SIZE = 16
const MAX_FONT_SIZE = 72

/**
 * Binary-searches the largest font size (between MIN/MAX_FONT_SIZE) at which
 * contentRef's element still fits inside containerRef's box, re-running
 * whenever the container resizes or any of `deps` changes (e.g. new speaker
 * notes text) — used to keep speaker notes as large and readable as
 * available space allows instead of a fixed text size.
 */
export function useAutoFitFontSize(deps: unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(MAX_FONT_SIZE)

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const fit = () => {
      let low = MIN_FONT_SIZE
      let high = MAX_FONT_SIZE
      let best = MIN_FONT_SIZE
      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        content.style.fontSize = `${mid}px`
        const fits =
          content.scrollHeight <= container.clientHeight &&
          content.scrollWidth <= container.clientWidth
        if (fits) {
          best = mid
          low = mid + 1
        } else {
          high = mid - 1
        }
      }
      content.style.fontSize = `${best}px`
      setFontSize(best)
    }

    fit()

    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    return () => observer.disconnect()
  }, deps)

  return { containerRef, contentRef, fontSize }
}
