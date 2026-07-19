import { Link } from 'react-router-dom'
import { monthName } from '../lib/months'

interface Props {
  year: number
  month?: number
}

export function Breadcrumb({ year, month }: Props) {
  return (
    <nav className="flex items-center gap-2 text-slate-500 text-sm mb-12">
      <Link to="/" className="hover:text-white transition-colors">
        Talks
      </Link>
      <span>›</span>
      {month !== undefined ? (
        <>
          <Link to={`/${year}`} className="hover:text-white transition-colors">
            {year}
          </Link>
          <span>›</span>
          <span className="text-white">{monthName(month)}</span>
        </>
      ) : (
        <span className="text-white">{year}</span>
      )}
    </nav>
  )
}
