import { lazy, Suspense, useMemo } from 'react'
import type { CodeSlide as CodeSlideData } from '../../data/types'
import { highlightCode } from '../../lib/highlightCode'

interface Props {
  slide: CodeSlideData
  stepIndex?: number
}

const MagicMoveCodeSlide = lazy(() => import('./MagicMoveCodeSlide'))

function StaticCodeSlide({ slide, code }: { slide: CodeSlideData; code: string }) {
  const html = useMemo(() => highlightCode(code, slide.language), [code, slide.language])

  return (
    <div className="flex-1 flex flex-col px-12 py-10">
      {slide.title && <h2 className="text-3xl font-bold text-white mb-6">{slide.title}</h2>}
      <pre className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-8 overflow-auto">
        <code
          className={`language-${slide.language} text-sm font-mono leading-relaxed whitespace-pre`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  )
}

export function CodeSlide({ slide, stepIndex = 0 }: Props) {
  if (slide.steps && slide.steps.length > 0) {
    const steps = [slide.code, ...slide.steps]
    const currentCode = steps[Math.min(stepIndex, steps.length - 1)]
    return (
      <Suspense fallback={<StaticCodeSlide slide={slide} code={currentCode} />}>
        <MagicMoveCodeSlide slide={slide} stepIndex={stepIndex} />
      </Suspense>
    )
  }

  return <StaticCodeSlide slide={slide} code={slide.code} />
}
