import type { ImageSlide as ImageSlideData } from '../../data/types'

interface Props {
  slide: ImageSlideData
}

export function ImageSlide({ slide }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-16 py-12 gap-6">
      {slide.title && (
        <h2 className="text-3xl font-bold text-white self-start">{slide.title}</h2>
      )}
      <img
        src={slide.src}
        alt={slide.alt}
        className="max-h-[60vh] max-w-full object-contain rounded-lg"
      />
      {slide.caption && (
        <p className="text-slate-400 text-sm">{slide.caption}</p>
      )}
    </div>
  )
}
