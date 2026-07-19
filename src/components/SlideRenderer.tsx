import type { Slide } from '../data/types'
import { TitleSlide } from './slides/TitleSlide'
import { ContentSlide } from './slides/ContentSlide'
import { CodeSlide } from './slides/CodeSlide'
import { ImageSlide } from './slides/ImageSlide'
import { BlankSlide } from './slides/BlankSlide'
import { TableSlide } from './slides/TableSlide'

interface Props {
  slide: Slide
}

export function SlideRenderer({ slide }: Props) {
  switch (slide.layout) {
    case 'title':
      return <TitleSlide slide={slide} />
    case 'content':
      return <ContentSlide slide={slide} />
    case 'code':
      return <CodeSlide slide={slide} />
    case 'image':
      return <ImageSlide slide={slide} />
    case 'blank':
      return <BlankSlide slide={slide} />
    case 'table':
      return <TableSlide slide={slide} />
  }
}
