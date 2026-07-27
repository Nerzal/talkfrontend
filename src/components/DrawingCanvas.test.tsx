import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import { DrawingCanvas } from './DrawingCanvas'
import type { DrawStroke } from './DrawingCanvas'

const strokes: DrawStroke[] = [
  {
    points: [
      { x: 0.1, y: 0.1 },
      { x: 0.5, y: 0.5 },
    ],
    color: '#f97316',
  },
]

describe('DrawingCanvas', () => {
  it('renders one polyline per stroke', () => {
    const { container } = render(<DrawingCanvas strokes={strokes} />)
    expect(container.querySelectorAll('polyline')).toHaveLength(1)
  })

  it('renders no polylines when there are no strokes', () => {
    const { container } = render(<DrawingCanvas strokes={[]} />)
    expect(container.querySelectorAll('polyline')).toHaveLength(0)
  })

  it('is not pointer-interactive when not in interactive mode', () => {
    render(<DrawingCanvas strokes={[]} />)
    const canvas = screen.getByTestId('drawing-canvas')
    expect(canvas.className).toContain('pointer-events-none')
  })

  it('captures a pointer drag as a multi-point stroke and reports it on pointer up', () => {
    const onStrokeComplete = vi.fn()
    render(<DrawingCanvas strokes={[]} interactive onStrokeComplete={onStrokeComplete} />)
    const canvas = screen.getByTestId('drawing-canvas')

    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 })
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 60 })
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 60 })

    expect(onStrokeComplete).toHaveBeenCalledOnce()
    expect(onStrokeComplete.mock.calls[0][0]).toHaveLength(2)
  })

  it('measures the container via getBoundingClientRect to letterbox against the reference aspect ratio', () => {
    // jsdom has no PointerEvent implementation, so fireEvent.pointer* can't
    // carry clientX/clientY through to the handler in this test environment
    // — the exact letterbox math (containReferenceRect) is covered directly
    // and exhaustively in referenceCanvas.test.ts instead. This test just
    // confirms DrawingCanvas actually measures its own container (rather
    // than assuming it's already reference-aspect, which was the bug) when
    // capturing a stroke.
    const onStrokeComplete = vi.fn()
    render(<DrawingCanvas strokes={[]} interactive onStrokeComplete={onStrokeComplete} />)
    const canvas = screen.getByTestId('drawing-canvas')
    const rectSpy = vi.spyOn(canvas, 'getBoundingClientRect')

    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 })
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 60 })
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 60 })

    expect(rectSpy).toHaveBeenCalled()
  })

  it('does not report a stroke for a single-point tap', () => {
    const onStrokeComplete = vi.fn()
    render(<DrawingCanvas strokes={[]} interactive onStrokeComplete={onStrokeComplete} />)
    const canvas = screen.getByTestId('drawing-canvas')

    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 })
    fireEvent.pointerUp(canvas, { clientX: 10, clientY: 10 })

    expect(onStrokeComplete).not.toHaveBeenCalled()
  })

  it('ignores pointer events when not interactive', () => {
    const onStrokeComplete = vi.fn()
    render(<DrawingCanvas strokes={[]} onStrokeComplete={onStrokeComplete} />)
    const canvas = screen.getByTestId('drawing-canvas')

    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 })
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 60 })
    fireEvent.pointerUp(canvas, { clientX: 50, clientY: 60 })

    expect(onStrokeComplete).not.toHaveBeenCalled()
  })
})
