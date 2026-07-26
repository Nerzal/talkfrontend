import type { ContentSlide as ContentSlideData } from '../../data/types'

interface Props {
  slide: ContentSlideData
}

export function ContentSlide({ slide }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-start sm:justify-center px-6 py-8 sm:px-16 sm:py-12 overflow-y-auto sm:overflow-hidden">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-5 sm:mb-10 pb-3 sm:pb-4 border-b border-slate-800">
        {slide.title}
      </h2>
      <ul className="space-y-3 sm:space-y-6">
        {slide.bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex items-start gap-3 sm:gap-4 text-base sm:text-xl md:text-2xl text-slate-200"
          >
            <span className="text-indigo-400 mt-1 shrink-0 text-sm sm:text-base">▸</span>
            <span className="leading-snug">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
