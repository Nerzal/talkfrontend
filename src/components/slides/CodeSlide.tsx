import type { CodeSlide as CodeSlideData } from '../../data/types'

interface Props {
  slide: CodeSlideData
}

export function CodeSlide({ slide }: Props) {
  return (
    <div className="flex-1 flex flex-col px-12 py-10">
      {slide.title && (
        <h2 className="text-3xl font-bold text-white mb-6">{slide.title}</h2>
      )}
      <pre className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-8 overflow-auto">
        <code className="text-emerald-400 text-sm font-mono leading-relaxed whitespace-pre">
          {slide.code}
        </code>
      </pre>
    </div>
  )
}
