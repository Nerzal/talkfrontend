import type { ContentSlide as ContentSlideData } from '../../data/types'

interface Props {
  slide: ContentSlideData
}

export function ContentSlide({ slide }: Props) {
  return (
    <div className="flex-1 flex flex-col justify-center px-16 py-12">
      <h2 className="text-4xl font-bold text-white mb-10 pb-4 border-b border-slate-800">
        {slide.title}
      </h2>
      <ul className="space-y-6">
        {slide.bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-4 text-2xl text-slate-200">
            <span className="text-indigo-400 mt-1 shrink-0 text-base">▸</span>
            <span className="leading-snug">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
