import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export interface Crumb {
  label: string
  to?: string
}

interface Props {
  crumbs: Crumb[]
}

export function Breadcrumb({ crumbs }: Props) {
  return (
    <nav className="flex items-center gap-2 text-slate-500 text-sm mb-6 sm:mb-12">
      {crumbs.map((crumb, index) => (
        <Fragment key={crumb.label}>
          {index > 0 && <span>›</span>}
          {crumb.to ? (
            <Link to={crumb.to} className="hover:text-white transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-white">{crumb.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
