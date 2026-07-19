import type { TitleSlide as TitleSlideData } from '../../data/types'

interface Props {
  slide: TitleSlideData
}

export function TitleSlide({ slide }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-16 py-12">
      <h1 className="text-7xl font-extrabold text-white leading-tight tracking-tight">
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="text-3xl text-slate-300 mt-6 font-light">{slide.subtitle}</p>
      )}
      {slide.author && (
        <p className="text-lg text-slate-500 mt-16">{slide.author}</p>
      )}
    </div>
  )
}
