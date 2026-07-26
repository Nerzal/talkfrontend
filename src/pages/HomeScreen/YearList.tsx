import { Link } from 'react-router-dom'
import { getYears, getTalksByYear } from '../../data/queries'
import { useTalks } from '../../data/TalksContext'
import { ViewToggle } from './ViewToggle'

export function YearList() {
  const talks = useTalks()
  const years = getYears(talks)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-8 sm:py-16">
        <ViewToggle active="year" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-12 tracking-tight">
          Talks
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {years.map((year) => {
            const count = getTalksByYear(talks, year).length
            return (
              <Link key={year} to={`/${year}`}>
                <div className="group relative bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded-2xl p-5 sm:p-8 transition-all">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold">{year}</div>
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
      </div>
    </div>
  )
}
