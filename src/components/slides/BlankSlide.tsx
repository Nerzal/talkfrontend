import type { BlankSlide as BlankSlideData } from '../../data/types'

interface Props {
  slide: BlankSlideData
}

export function BlankSlide({ slide }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-16 py-12">
      {slide.heading && (
        <h1 className="text-6xl font-extrabold text-white">{slide.heading}</h1>
      )}
      {slide.body && (
        <p className="text-2xl text-slate-400 mt-6">{slide.body}</p>
      )}
    </div>
  )
}
