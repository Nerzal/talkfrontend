import type { Bullet, ContentBlock, MixedSlide as MixedSlideData } from '../../data/types'
import { highlightCode } from '../../lib/highlightCode'
import {
  assignFragmentOrder,
  flattenBulletBlocks,
  isFragmentRevealed,
} from '../../lib/assignFragmentOrder'

interface Props {
  slide: MixedSlideData
  stepIndex?: number
}

type OrderedBullet = Bullet & { order?: number }
type OrderedBlock =
  Exclude<ContentBlock, { type: 'bullets' }> | { type: 'bullets'; items: OrderedBullet[] }

/**
 * Numbers fragment bullets in document order across every bullets block in
 * the slide, not just within one — delegates the actual numbering to
 * assignFragmentOrder over the flattened list, then redistributes the
 * results back into each block.
 */
function assignBlockFragmentOrders(blocks: ContentBlock[]): OrderedBlock[] {
  const ordered = assignFragmentOrder(flattenBulletBlocks(blocks))

  let offset = 0
  return blocks.map((block) => {
    if (block.type !== 'bullets') return block
    const items = ordered.slice(offset, offset + block.items.length)
    offset += block.items.length
    return { ...block, items }
  })
}

function Block({ block, stepIndex }: { block: OrderedBlock; stepIndex: number }) {
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
          {block.items.map((item, i) => {
            const revealed = isFragmentRevealed(item.order, stepIndex)
            return (
              <li
                key={i}
                className={`flex items-start gap-3 sm:gap-4 text-base sm:text-lg md:text-xl text-slate-200 transition-opacity duration-300 ${revealed ? 'opacity-100' : 'opacity-0'}`}
              >
                <span className="text-indigo-400 mt-1 shrink-0 text-sm sm:text-base">▸</span>
                <span className="leading-snug">{item.text}</span>
              </li>
            )
          })}
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

export function MixedSlide({ slide, stepIndex = 0 }: Props) {
  const blocks = assignBlockFragmentOrders(slide.blocks)

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-start sm:justify-center gap-4 sm:gap-6 px-6 py-8 sm:px-16 sm:py-12 overflow-y-auto sm:overflow-hidden">
      {blocks.map((block, i) => (
        <Block key={i} block={block} stepIndex={stepIndex} />
      ))}
    </div>
  )
}
