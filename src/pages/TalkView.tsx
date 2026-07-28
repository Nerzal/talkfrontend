import { useCallback, useEffect, useId, useRef } from 'react'
import { useParams } from 'react-router-dom'
import type { Talk } from '../data/types'
import { getTalkById } from '../data/queries'
import { useTalks } from '../data/TalksContext'
import { useTalkPresenter } from '../hooks/useTalkPresenter'
import { usePresenterChannel } from '../hooks/usePresenterChannel'
import { useSlideStrokes } from '../hooks/useSlideStrokes'
import { SlideRenderer } from '../components/SlideRenderer'
import { SlideControls } from '../components/SlideControls'
import { TalkViewTopBar } from '../components/TalkViewTopBar'
import { DrawingCanvas } from '../components/DrawingCanvas'
import { CarlOverlay } from '../components/CarlOverlay'

export function TalkView() {
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

  return <ActiveTalkView talk={talk} />
}

function ActiveTalkView({ talk }: { talk: Talk }) {
  const { slideIndex, stepIndex, isFirst, isLast, progress, goNext, goPrev, goBack, setNav } =
    useTalkPresenter(talk)
  const slide = talk.slides[slideIndex]
  const [strokes, setStrokes] = useSlideStrokes(slide.id)
  const remoteNavRef = useRef(false)
  const requestId = useId()
  const navigatedSinceRequestRef = useRef(false)

  const { post } = usePresenterChannel(talk.id, (msg, reply) => {
    if (msg.type === 'nav') {
      // A reply to our own mount-time "where are you" request can arrive
      // after we've already navigated locally (e.g. the presenter clicked
      // Next immediately) — applying it then would clobber that fresh
      // position with the other window's now-stale one, so drop it.
      if (msg.replyTo === requestId && navigatedSinceRequestRef.current) return
      remoteNavRef.current = true
      setNav(msg.slideIndex, msg.stepIndex)
    } else if (msg.type === 'request-state') {
      reply({ type: 'nav', slideIndex, stepIndex, replyTo: msg.requestId })
    } else if (msg.type === 'draw-stroke' && msg.slideId === slide.id) {
      setStrokes((s) => [...s, { points: msg.points, color: msg.color }])
    } else if (msg.type === 'draw-clear' && msg.slideId === slide.id) {
      setStrokes([])
    }
  })

  useEffect(() => {
    post({ type: 'request-state', requestId })
  }, [post, requestId])

  // Mirror this view's own navigation (keyboard/click, either here or in the
  // presenter window) to the other window — but not when this slideIndex/
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
    navigatedSinceRequestRef.current = true
    post({ type: 'nav', slideIndex, stepIndex })
  }, [slideIndex, stepIndex, post])

  const openPresenterView = useCallback(() => {
    window.open(`/talk/${talk.id}/presenter`, '_blank', 'noopener')
  }, [talk.id])

  return (
    <div className="fixed inset-0 bg-black flex flex-col select-none">
      <TalkViewTopBar onBack={goBack} onOpenPresenter={openPresenterView} talkId={talk.id} />
      <div
        key={slide.id}
        className="relative flex-1 flex flex-col min-h-0"
        style={{ animation: 'slideIn 0.2s ease-out' }}
      >
        <SlideRenderer slide={slide} stepIndex={stepIndex} />
        <DrawingCanvas strokes={strokes} />
      </div>
      <CarlOverlay
        presentationEnabled={talk.clippy === true}
        currentSlideAllowsCarl={slideIndex >= 3}
        slideIndex={slideIndex}
      />
      <div className="h-0.5 bg-slate-800">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <SlideControls
        slideIndex={slideIndex}
        totalSlides={talk.slides.length}
        isFirst={isFirst}
        isLast={isLast}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  )
}
