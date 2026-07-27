interface Props {
  slideIndex: number
  totalSlides: number
  isFirst: boolean
  isLast: boolean
  onPrev: () => void
  onNext: () => void
}

export function SlideControls({ slideIndex, totalSlides, isFirst, isLast, onPrev, onNext }: Props) {
  return (
    <>
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-6 flex items-center gap-2 sm:gap-4">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="text-slate-600 hover:text-white disabled:opacity-20 text-xl transition-colors cursor-pointer disabled:cursor-default p-3 -m-1"
          aria-label="Previous slide"
        >
          ←
        </button>
        <span className="text-slate-500 text-xs sm:text-sm tabular-nums">
          {slideIndex + 1} / {totalSlides}
        </span>
        <button
          onClick={onNext}
          disabled={isLast}
          className="text-slate-600 hover:text-white disabled:opacity-20 text-xl transition-colors cursor-pointer disabled:cursor-default p-3 -m-1"
          aria-label="Next slide"
        >
          →
        </button>
      </div>
      <div className="hidden sm:block absolute bottom-4 left-6 text-slate-700 text-xs">
        ← → Space · presenter remote
      </div>
    </>
  )
}
