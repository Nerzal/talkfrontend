export const REFERENCE_WIDTH = 1280
export const REFERENCE_HEIGHT = 720
export const REFERENCE_ASPECT = REFERENCE_WIDTH / REFERENCE_HEIGHT

export interface ContainRect {
  left: number
  top: number
  width: number
  height: number
}

/**
 * The centered, aspect-ratio-preserved sub-rect of a container that matches
 * the shared 1280x720 reference canvas ("object-fit: contain" letterboxing).
 * `ScaledSlidePreview` already renders its slide inside an outer box locked
 * to this aspect ratio, so this is a no-op there (the sub-rect is the full
 * container); `DrawingCanvas` uses it so annotation coordinates line up
 * between a presenter window (always reference-aspect, via
 * `ScaledSlidePreview`) and an audience window (an arbitrary full-viewport
 * box) regardless of the audience screen's actual aspect ratio.
 */
export function containReferenceRect(containerWidth: number, containerHeight: number): ContainRect {
  if (!containerWidth || !containerHeight) {
    return { left: 0, top: 0, width: containerWidth, height: containerHeight }
  }
  const containerAspect = containerWidth / containerHeight
  if (containerAspect > REFERENCE_ASPECT) {
    const width = containerHeight * REFERENCE_ASPECT
    return { left: (containerWidth - width) / 2, top: 0, width, height: containerHeight }
  }
  const height = containerWidth / REFERENCE_ASPECT
  return { left: 0, top: (containerHeight - height) / 2, width: containerWidth, height }
}
