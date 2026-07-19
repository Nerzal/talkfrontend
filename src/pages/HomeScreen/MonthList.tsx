import { Link } from 'react-router-dom'
import { getMonthsByYear, getTalksByYearAndMonth } from '../../data/queries'
import { monthName } from '../../lib/months'
import { Breadcrumb } from '../../components/Breadcrumb'
import { useTalks } from '../../data/TalksContext'

interface Props {
  year: number
}

export function MonthList({ year }: Props) {
  const talks = useTalks()
  const months = getMonthsByYear(talks, year)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <Breadcrumb year={year} />
        <h1 className="text-5xl font-extrabold mb-12 tracking-tight">{year}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {months.map((month) => {
            const count = getTalksByYearAndMonth(talks, year, month).length
            return (
              <Link key={month} to={`/${year}/${month}`}>
                <div className="group relative bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded-2xl p-6 transition-all">
                  <div className="text-2xl font-bold">{monthName(month)}</div>
                  <div className="text-slate-400 mt-1 text-sm">
                    {count} Vortrag{count !== 1 ? 'e' : ''}
                  </div>
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-indigo-400 transition-colors">
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
