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

export function SlideRenderer({ slide, stepIndex = 0 }: Props) {
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
