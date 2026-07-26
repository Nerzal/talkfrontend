import type { TableRow, TableRowVariant } from '../../data/types'

interface Props {
  columns: string[]
  rows: TableRow[]
  empty?: boolean
}

const ROW_BG: Record<TableRowVariant, string> = {
  highlight: 'bg-emerald-950 border-t border-emerald-900',
  danger: 'bg-red-950 border-t border-red-900',
  deleted: 'bg-red-950/20 border-t border-slate-800',
  warning: 'bg-amber-950 border-t border-amber-900',
  normal: 'bg-slate-900 border-t border-slate-800',
}

const ROW_TEXT: Record<TableRowVariant, string> = {
  highlight: 'text-emerald-300',
  danger: 'text-red-300',
  deleted: 'text-slate-500',
  warning: 'text-amber-300',
  normal: 'text-slate-200',
}

export function DataTable({ columns, rows, empty }: Props) {
  return (
    <div className="border border-slate-700 rounded-xl overflow-x-auto">
      <table className="w-full min-w-[420px]">
        <thead>
          <tr className="bg-slate-800 border-b border-slate-700">
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left px-3 py-2 sm:px-6 sm:py-4 text-slate-400 font-mono text-xs sm:text-sm uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {empty ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 sm:py-12 text-slate-600 text-base sm:text-xl italic"
              >
                — 0 rows —
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const variant = row.variant ?? 'normal'
              return (
                <tr key={i} className={ROW_BG[variant]}>
                  {row.cells.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-3 py-3 sm:px-6 sm:py-5 font-mono text-sm sm:text-xl ${ROW_TEXT[variant]}`}
                    >
                      {variant === 'deleted' ? (
                        <span className="line-through opacity-50">{cell}</span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
