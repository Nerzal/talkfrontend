import { Link } from 'react-router-dom'

interface Props {
  tag: string
}

export function TagBreadcrumb({ tag }: Props) {
  return (
    <nav className="flex items-center gap-2 text-slate-500 text-sm mb-6 sm:mb-12">
      <Link to="/" className="hover:text-white transition-colors">
        Talks
      </Link>
      <span>›</span>
      <Link to="/tags" className="hover:text-white transition-colors">
        Tags
      </Link>
      <span>›</span>
      <span className="text-white">{tag}</span>
    </nav>
  )
}
