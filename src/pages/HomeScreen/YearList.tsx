import { getYears, getTalksByYear } from '../../data/queries'
import { CountCard } from '../../components/CountCard'
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
              <CountCard key={year} to={`/${year}`} count={count}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold">{year}</div>
              </CountCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}
