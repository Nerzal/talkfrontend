import { Link } from 'react-router-dom'
import { getTags, getTalksByTag } from '../../data/queries'
import { useTalks } from '../../data/TalksContext'
import { ViewToggle } from './ViewToggle'

export function TagList() {
  const talks = useTalks()
  const tags = getTags(talks)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-8 sm:py-16">
        <ViewToggle active="tag" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-12 tracking-tight">
          Tags
        </h1>
        {tags.length === 0 ? (
          <p className="text-slate-500 text-lg sm:text-xl">No tags yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {tags.map((tag) => {
              const count = getTalksByTag(talks, tag).length
              return (
                <Link key={tag} to={`/tags/${encodeURIComponent(tag)}`}>
                  <div className="group relative bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded-2xl p-5 sm:p-8 transition-all">
                    <div className="text-lg sm:text-2xl font-bold break-words pr-6">{tag}</div>
                    <div className="text-slate-400 mt-2 text-xs sm:text-sm">
                      {count} talk{count !== 1 ? 's' : ''}
                    </div>
                    <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-indigo-400 transition-colors text-xl">
                      →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
