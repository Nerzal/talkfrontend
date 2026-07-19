import { Link } from 'react-router-dom'
import { getYears, getTalksByYear } from '../../data/queries'
import { useTalks } from '../../data/TalksContext'

export function YearList() {
  const talks = useTalks()
  const years = getYears(talks)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-extrabold mb-12 tracking-tight">Vorträge</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {years.map((year) => {
            const count = getTalksByYear(talks, year).length
            return (
              <Link key={year} to={`/${year}`}>
                <div className="group relative bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded-2xl p-8 transition-all">
                  <div className="text-5xl font-bold">{year}</div>
                  <div className="text-slate-400 mt-2 text-sm">
                    {count} Vortrag{count !== 1 ? 'e' : ''}
                  </div>
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-indigo-400 transition-colors text-xl">
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
