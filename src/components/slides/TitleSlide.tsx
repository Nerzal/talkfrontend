import type { TitleSlide as TitleSlideData } from '../../data/types'
import { renderInlineMarkdown } from '../../lib/renderInlineMarkdown'

interface Props {
  slide: TitleSlideData
}

export function TitleSlide({ slide }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-start sm:justify-center text-center px-6 py-8 sm:px-16 sm:py-12 overflow-y-auto sm:overflow-hidden">
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
        {renderInlineMarkdown(slide.title)}
      </h1>
      {slide.subtitle && (
        <p className="text-lg sm:text-2xl md:text-3xl text-slate-300 mt-4 sm:mt-6 font-light">
          {renderInlineMarkdown(slide.subtitle)}
        </p>
      )}
      {slide.author && (
        <p className="text-sm sm:text-lg text-slate-500 mt-8 sm:mt-16">
          {renderInlineMarkdown(slide.author)}
        </p>
      )}
    </div>
  )
}
