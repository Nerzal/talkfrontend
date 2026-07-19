import { Link } from 'react-router-dom'
import { getTalksByYearAndMonth } from '../../data/queries'
import { monthName } from '../../lib/months'
import { Breadcrumb } from '../../components/Breadcrumb'
import { useTalks } from '../../data/TalksContext'

interface Props {
  year: number
  month: number
}

export function TalkList({ year, month }: Props) {
  const allTalks = useTalks()
  const talks = getTalksByYearAndMonth(allTalks, year, month)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <Breadcrumb year={year} month={month} />
        <h1 className="text-5xl font-extrabold mb-12 tracking-tight">
          {monthName(month)} {year}
        </h1>
        {talks.length === 0 ? (
          <p className="text-slate-500 text-xl">No talks this month.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {talks.map((talk) => (
              <Link key={talk.id} to={`/talk/${talk.id}`}>
                <div className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded-2xl p-6 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold group-hover:text-indigo-300 transition-colors">
                      {talk.title}
                    </h3>
                    <span className="text-slate-500 text-sm shrink-0 mt-0.5">
                      {talk.slides.length} slides
                    </span>
                  </div>
                  {talk.description && (
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                      {talk.description}
                    </p>
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
