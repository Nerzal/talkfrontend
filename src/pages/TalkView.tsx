import { useParams } from 'react-router-dom'
import type { Talk } from '../data/types'
import { getTalkById } from '../data/queries'
import { useTalks } from '../data/TalksContext'
import { useTalkPresenter } from '../hooks/useTalkPresenter'
import { SlideRenderer } from '../components/SlideRenderer'
import { SlideControls } from '../components/SlideControls'

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
  const { slideIndex, stepIndex, isFirst, isLast, progress, goNext, goPrev, goBack } =
    useTalkPresenter(talk)
  const slide = talk.slides[slideIndex]

  return (
    <div className="fixed inset-0 bg-black flex flex-col select-none">
      <div
        key={slide.id}
        className="flex-1 flex flex-col"
        style={{ animation: 'slideIn 0.2s ease-out' }}
      >
        <SlideRenderer slide={slide} stepIndex={stepIndex} />
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
        onBack={goBack}
      />
    </div>
  )
}
