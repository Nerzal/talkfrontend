import type { ContentBlock, MixedSlide as MixedSlideData } from '../../data/types'
import { highlightCode } from '../../lib/highlightCode'

interface Props {
  slide: MixedSlideData
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return block.level === 1 ? (
        <h2 className="text-4xl font-bold text-white pb-4 border-b border-slate-800">
          {block.text}
        </h2>
      ) : (
        <h3 className="text-2xl font-bold text-white">{block.text}</h3>
      )
    case 'bullets':
      return (
        <ul className="space-y-4">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-xl text-slate-200">
              <span className="text-indigo-400 mt-1 shrink-0 text-base">▸</span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'paragraph':
      return <p className="text-xl text-slate-300 leading-relaxed">{block.text}</p>
    case 'code':
      return (
        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-6 overflow-auto">
          <code
            className={`language-${block.language} text-sm font-mono leading-relaxed whitespace-pre`}
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
    <div className="flex-1 flex flex-col justify-center gap-6 px-16 py-12">
      {slide.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}
