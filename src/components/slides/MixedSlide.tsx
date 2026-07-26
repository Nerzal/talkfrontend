import type { ContentBlock, MixedSlide as MixedSlideData } from '../../data/types'
import { highlightCode } from '../../lib/highlightCode'

interface Props {
  slide: MixedSlideData
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return block.level === 1 ? (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white pb-3 sm:pb-4 border-b border-slate-800">
          {block.text}
        </h2>
      ) : (
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{block.text}</h3>
      )
    case 'bullets':
      return (
        <ul className="space-y-2 sm:space-y-4">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 sm:gap-4 text-base sm:text-lg md:text-xl text-slate-200"
            >
              <span className="text-indigo-400 mt-1 shrink-0 text-sm sm:text-base">▸</span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'paragraph':
      return (
        <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed">
          {block.text}
        </p>
      )
    case 'code':
      return (
        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-6 overflow-auto">
          <code
            className={`language-${block.language} text-xs sm:text-sm font-mono leading-relaxed whitespace-pre`}
            dangerouslySetInnerHTML={{ __html: highlightCode(block.code, block.language) }}
          />
        </pre>
      )
    default: {
      const exhaustive: never = block
      throw new Error(`Unknown content block: ${JSON.stringify(exhaustive)}`)
    }
  }
}

export function MixedSlide({ slide }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-start sm:justify-center gap-4 sm:gap-6 px-6 py-8 sm:px-16 sm:py-12 overflow-y-auto sm:overflow-hidden">
      {slide.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}
