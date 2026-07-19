import type { TableSlide as TableSlideData } from '../../data/types'
import { AsciiArt } from './AsciiArt'
import { DataTable } from './DataTable'

interface Props {
  slide: TableSlideData
}

export function TableSlide({ slide }: Props) {
  return (
    <div className="flex-1 flex flex-col px-14 py-10 gap-5">
      {slide.title && <h2 className="text-3xl font-bold text-white">{slide.title}</h2>}
      {slide.statement && (
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-lg px-5 py-3">
          <span className="text-slate-500 font-mono text-sm shrink-0">SQL ›</span>
          <code className="text-emerald-400 font-mono text-sm">{slide.statement}</code>
        </div>
      )}
      <div className="flex-1 flex gap-6 items-center min-h-0">
        <div className="flex-1 min-w-0">
          <DataTable columns={slide.columns} rows={slide.rows} empty={slide.empty} />
        </div>
        {slide.ascii && <AsciiArt content={slide.ascii} />}
      </div>
      {slide.caption && (
        <p className="text-center text-slate-400 text-lg italic">{slide.caption}</p>
      )}
    </div>
  )
}
