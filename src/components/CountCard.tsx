import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  to: string
  count: number
  children: ReactNode
}

export function CountCard({ to, count, children }: Props) {
  return (
    <Link to={to}>
      <div className="group relative bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 rounded-2xl p-5 sm:p-8 transition-all">
        {children}
        <div className="text-slate-400 mt-2 text-xs sm:text-sm">
          {count} talk{count !== 1 ? 's' : ''}
        </div>
        <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-indigo-400 transition-colors text-xl">
          →
        </span>
      </div>
    </Link>
  )
}
