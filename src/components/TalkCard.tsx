import { Link } from 'react-router-dom'
import type { Talk } from '../data/types'

interface Props {
  talk: Talk
}

export function TalkCard({ talk }: Props) {
  return (
    <Link to={`/talk/${talk.id}`}>
      <div className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded-2xl p-4 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
          <h3 className="text-lg sm:text-xl font-bold group-hover:text-indigo-300 transition-colors">
            {talk.title}
          </h3>
          <span className="text-slate-500 text-xs sm:text-sm shrink-0 sm:mt-0.5">
            {talk.slides.length} slides
          </span>
        </div>
        {talk.description && (
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">{talk.description}</p>
        )}
        {talk.tags && talk.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {talk.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
