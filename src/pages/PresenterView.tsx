import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Talk } from '../data/types'
import { getTalkById } from '../data/queries'
import { useTalks } from '../data/TalksContext'
import { useTalkPresenter, stepCount } from '../hooks/useTalkPresenter'
import { usePresenterChannel } from '../hooks/usePresenterChannel'
import type { DrawPoint, PresenterMessage } from '../hooks/usePresenterChannel'
import { useElapsedTimer } from '../hooks/useElapsedTimer'
import { useAutoFitFontSize } from '../hooks/useAutoFitFontSize'
import { useSlideStrokes } from '../hooks/useSlideStrokes'
import { formatDuration } from '../lib/formatDuration'
import { ScaledSlidePreview } from '../components/ScaledSlidePreview'
import { DrawingCanvas, DEFAULT_DRAW_COLOR } from '../components/DrawingCanvas'
import { RecordingButton } from '../components/RecordingButton'
import { CameraToggleButton } from '../components/CameraToggleButton'

export function PresenterView() {
  const { id } = useParams<{ id: string }>()
  const talks = useTalks()
  const talk = getTalkById(talks, id ?? '')

  if (!talk) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <p className="text-slate-400 text-xl">Talk not found.</p>
      </div>
    )
  }

  return <ActivePresenterView talk={talk} />
}

function ActivePresenterView({ talk }: { talk: Talk }) {
  const onExit = useCallback(() => {
    // Presenter view only ever opens via window.open() into a fresh tab, so
    // there's normally no history entry to go back to — close the tab
    // instead, unless it does have real history (e.g. the URL was visited
    // directly), in which case behave like a normal back button.
    if (window.history.length <= 1) {
      window.close()
    } else {
      window.history.back()
    }
  }, [])
  const { slideIndex, stepIndex, isFirst, isLast, goNext, goPrev, goBack, setNav } =
    useTalkPresenter(talk, {
      onExit,
    })
  const slide = talk.slides[slideIndex]
  const hasMoreSteps = stepIndex < stepCount(talk, slideIndex) - 1
  const previewSlide = hasMoreSteps ? slide : talk.slides[slideIndex + 1]
  const previewStepIndex = hasMoreSteps ? stepIndex + 1 : 0
  const timer = useElapsedTimer()
  const [strokes, setStrokes] = useSlideStrokes(slide.id)
  const [drawing, setDrawing] = useState(false)
  const {
    containerRef: notesContainerRef,
    contentRef: notesContentRef,
    fontSize: notesFontSize,
  } = useAutoFitFontSize([slide.notes])
  const remoteNavRef = useRef(false)

  const onChannelMessage = (msg: PresenterMessage, reply: (msg: PresenterMessage) => void) => {
    if (msg.type === 'request-state') {
      reply({ type: 'nav', slideIndex, stepIndex })
    } else if (msg.type === 'nav') {
      remoteNavRef.current = true
      setNav(msg.slideIndex, msg.stepIndex)
    }
  }
  const { post } = usePresenterChannel(talk.id, onChannelMessage)

  // Mirror this view's own navigation (keyboard/click, either here or in the
  // audience window) to the other window — but not when this slideIndex/
  // stepIndex change was itself just applied from an incoming 'nav' message,
  // or every remote move would echo straight back to its sender.
  const didMountRef = useRef(false)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    if (remoteNavRef.current) {
      remoteNavRef.current = false
      return
    }
    post({ type: 'nav', slideIndex, stepIndex })
  }, [post, slideIndex, stepIndex])

  const handleStrokeComplete = useCallback(
    (points: DrawPoint[]) => {
      setStrokes((s) => [...s, { points, color: DEFAULT_DRAW_COLOR }])
      post({ type: 'draw-stroke', slideId: slide.id, points, color: DEFAULT_DRAW_COLOR })
    },
    [post, slide.id, setStrokes],
  )

  const handleClearDrawing = useCallback(() => {
    setStrokes([])
    post({ type: 'draw-clear', slideId: slide.id })
  }, [post, slide.id, setStrokes])

  const openAudienceView = useCallback(() => {
    window.open(`/talk/${talk.id}`, '_blank', 'noopener')
  }, [talk.id])

  return (
    <div className="fixed inset-0 bg-slate-950 text-white flex flex-col p-4 gap-4 overflow-y-auto">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold">{talk.title}</h1>
          <p className="text-slate-500 text-sm">
            Slide {slideIndex + 1} / {talk.slides.length}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="tabular-nums text-2xl font-mono" aria-label="Elapsed time">
            {formatDuration(timer.elapsedMs)}
          </span>
          <button
            onClick={timer.running ? timer.pause : timer.resume}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sm cursor-pointer"
          >
            {timer.running ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={timer.reset}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sm cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={openAudienceView}
            className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-sm cursor-pointer"
          >
            Open audience view
          </button>
          <RecordingButton fileNamePrefix={talk.id} className="text-slate-300" />
          <CameraToggleButton />
          <button
            onClick={goBack}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-2 min-h-0">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm">Current slide (audience sees this)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrawing((d) => !d)}
                aria-pressed={drawing}
                className={`px-3 py-1 rounded text-sm cursor-pointer ${
                  drawing ? 'bg-orange-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                Pen
              </button>
              <button
                onClick={handleClearDrawing}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sm cursor-pointer"
              >
                Clear drawing
              </button>
            </div>
          </div>
          <ScaledSlidePreview
            slide={slide}
            stepIndex={stepIndex}
            className="w-full"
            overlay={
              <DrawingCanvas
                strokes={strokes}
                interactive={drawing}
                onStrokeComplete={handleStrokeComplete}
              />
            }
          />
        </div>

        <div className="flex flex-col gap-4 min-h-0">
          <div>
            <span className="text-slate-500 text-sm">
              {hasMoreSteps ? 'Next (this slide)' : 'Next slide'}
            </span>
            {previewSlide ? (
              <ScaledSlidePreview
                slide={previewSlide}
                stepIndex={previewStepIndex}
                className="w-full mt-2"
              />
            ) : (
              <div className="mt-2 aspect-video rounded bg-slate-900 flex items-center justify-center text-slate-600 text-sm">
                End of talk
              </div>
            )}
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            <span className="text-slate-500 text-sm">Speaker notes</span>
            <div
              ref={notesContainerRef}
              className="mt-2 flex-1 min-h-[6rem] overflow-y-auto rounded bg-slate-900 p-3"
            >
              <div
                ref={notesContentRef}
                className="text-slate-300 whitespace-pre-wrap font-medium leading-snug"
                style={{ fontSize: notesFontSize }}
              >
                {slide.notes || 'No notes for this slide.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-sm cursor-pointer disabled:cursor-default"
        >
          ← Previous
        </button>
        <button
          onClick={goNext}
          disabled={isLast}
          className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-sm cursor-pointer disabled:cursor-default"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
