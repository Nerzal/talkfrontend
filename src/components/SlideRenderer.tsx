import type { Slide } from '../data/types'
import { TitleSlide } from './slides/TitleSlide'
import { ContentSlide } from './slides/ContentSlide'
import { CodeSlide } from './slides/CodeSlide'
import { ImageSlide } from './slides/ImageSlide'
import { BlankSlide } from './slides/BlankSlide'
import { TableSlide } from './slides/TableSlide'
import { SpeakerSlide } from './slides/SpeakerSlide'
import { MixedSlide } from './slides/MixedSlide'

interface Props {
  slide: Slide
  stepIndex?: number
}

function renderSlide(slide: Slide, stepIndex: number) {
  switch (slide.layout) {
    case 'title':
      return <TitleSlide slide={slide} />
    case 'content':
      return <ContentSlide slide={slide} stepIndex={stepIndex} />
    case 'code':
      return <CodeSlide slide={slide} stepIndex={stepIndex} />
    case 'image':
      return <ImageSlide slide={slide} />
    case 'blank':
      return <BlankSlide slide={slide} />
    case 'table':
      return <TableSlide slide={slide} />
    case 'speaker':
      return <SpeakerSlide slide={slide} />
    case 'mixed':
      return <MixedSlide slide={slide} stepIndex={stepIndex} />
  }
}

export function SlideRenderer({ slide, stepIndex = 0 }: Props) {
  const content = renderSlide(slide, stepIndex)

  if (!slide.background) return content

  return (
    <div className="relative flex-1 min-h-0 flex flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.background})` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative flex-1 min-h-0 flex flex-col">{content}</div>
    </div>
  )
}
