import { useCallback, useEffect } from 'react'
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

  const { post } = usePresenterChannel(talk.id, (msg) => {
    if (msg.type === 'nav') {
      setNav(msg.slideIndex, msg.stepIndex)
    } else if (msg.type === 'draw-stroke' && msg.slideId === slide.id) {
      setStrokes((s) => [...s, { points: msg.points, color: msg.color }])
    } else if (msg.type === 'draw-clear' && msg.slideId === slide.id) {
      setStrokes([])
    }
  })

  useEffect(() => {
    post({ type: 'request-state' })
  }, [post])

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
