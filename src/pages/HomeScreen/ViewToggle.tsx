import { Link } from 'react-router-dom'

interface Props {
  active: 'year' | 'tag'
}

const BASE_CLASSES = 'px-4 py-2 rounded-full text-sm font-medium transition-colors border'
const ACTIVE_CLASSES = 'bg-indigo-500 border-indigo-500 text-white'
const INACTIVE_CLASSES = 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'

export function ViewToggle({ active }: Props) {
  return (
    <div className="flex gap-2 mb-6 sm:mb-8">
      <Link
        to="/"
        className={`${BASE_CLASSES} ${active === 'year' ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
      >
        By Year
      </Link>
      <Link
        to="/tags"
        className={`${BASE_CLASSES} ${active === 'tag' ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
      >
        By Tag
      </Link>
    </div>
  )
}
