import type { BlankSlide as BlankSlideData } from '../../data/types'
import { renderInlineMarkdown } from '../../lib/renderInlineMarkdown'

interface Props {
  slide: BlankSlideData
}

export function BlankSlide({ slide }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-start sm:justify-center text-center px-6 py-8 sm:px-16 sm:py-12 overflow-y-auto sm:overflow-hidden">
      {slide.heading && (
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white">
          {renderInlineMarkdown(slide.heading)}
        </h1>
      )}
      {slide.body && (
        <p className="text-base sm:text-xl md:text-2xl text-slate-400 mt-4 sm:mt-6">
          {renderInlineMarkdown(slide.body)}
        </p>
      )}
    </div>
  )
}
