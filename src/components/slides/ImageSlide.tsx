import type { ImageSlide as ImageSlideData } from '../../data/types'

interface Props {
  slide: ImageSlideData
}

export function ImageSlide({ slide }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:px-16 sm:py-12 gap-4 sm:gap-6">
      {slide.title && (
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white self-start">
          {slide.title}
        </h2>
      )}
      <img
        src={slide.src}
        alt={slide.alt}
        className="max-h-[40vh] sm:max-h-[60vh] max-w-full object-contain rounded-lg"
      />
      {slide.caption && (
        <p className="text-slate-400 text-xs sm:text-sm text-center">{slide.caption}</p>
      )}
    </div>
  )
}
