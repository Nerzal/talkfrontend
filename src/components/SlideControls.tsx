interface Props {
  slideIndex: number
  totalSlides: number
  isFirst: boolean
  isLast: boolean
  onPrev: () => void
  onNext: () => void
  onBack: () => void
}

export function SlideControls({
  slideIndex,
  totalSlides,
  isFirst,
  isLast,
  onPrev,
  onNext,
  onBack,
}: Props) {
  return (
    <>
      <button
        onClick={onBack}
        className="absolute top-5 right-6 text-slate-600 hover:text-white text-2xl leading-none transition-colors cursor-pointer"
        aria-label="Back to overview"
      >
        ✕
      </button>
      <div className="absolute bottom-4 right-6 flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="text-slate-600 hover:text-white disabled:opacity-20 text-xl transition-colors cursor-pointer disabled:cursor-default"
          aria-label="Previous slide"
        >
          ←
        </button>
        <span className="text-slate-500 text-sm tabular-nums">
          {slideIndex + 1} / {totalSlides}
        </span>
        <button
          onClick={onNext}
          disabled={isLast}
          className="text-slate-600 hover:text-white disabled:opacity-20 text-xl transition-colors cursor-pointer disabled:cursor-default"
          aria-label="Next slide"
        >
          →
        </button>
      </div>
      <div className="absolute bottom-4 left-6 text-slate-700 text-xs">
        ← → Space · presenter remote
      </div>
    </>
  )
}
