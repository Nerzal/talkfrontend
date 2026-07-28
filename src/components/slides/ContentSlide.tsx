import type { ContentSlide as ContentSlideData } from '../../data/types'
import { assignFragmentOrder, isFragmentRevealed } from '../../lib/assignFragmentOrder'
import { renderInlineMarkdown } from '../../lib/renderInlineMarkdown'

interface Props {
  slide: ContentSlideData
  stepIndex?: number
}

export function ContentSlide({ slide, stepIndex = 0 }: Props) {
  const bullets = assignFragmentOrder(slide.bullets)

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-start sm:justify-center px-6 py-8 sm:px-16 sm:py-12 overflow-y-auto sm:overflow-hidden">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-5 sm:mb-10 pb-3 sm:pb-4 border-b border-slate-800">
        {renderInlineMarkdown(slide.title)}
      </h2>
      <ul className="space-y-3 sm:space-y-6">
        {bullets.map((bullet, i) => {
          const revealed = isFragmentRevealed(bullet.order, stepIndex)
          return (
            <li
              key={i}
              className={`flex items-start gap-3 sm:gap-4 text-base sm:text-xl md:text-2xl text-slate-200 transition-opacity duration-300 ${revealed ? 'opacity-100' : 'opacity-0'}`}
            >
              <span className="text-indigo-400 mt-1 shrink-0 text-sm sm:text-base">▸</span>
              <span className="leading-snug">{renderInlineMarkdown(bullet.text)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
