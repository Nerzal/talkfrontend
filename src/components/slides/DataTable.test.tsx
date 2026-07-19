import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataTable } from './DataTable'
import type { TableRow } from '../../data/types'

const COLS = ['id', 'name', 'status']

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={COLS} rows={[]} />)
    expect(screen.getByText('id')).toBeDefined()
    expect(screen.getByText('name')).toBeDefined()
    expect(screen.getByText('status')).toBeDefined()
  })

  it('shows "0 rows" when empty=true', () => {
    render(<DataTable columns={COLS} rows={[]} empty />)
    expect(screen.getByText(/0 rows/)).toBeDefined()
  })

  it('renders row content', () => {
    const rows: TableRow[] = [
      { cells: ['1', 'Grandma', 'healthy'] },
      { cells: ['2', 'Wolf', 'full'] },
    ]
    render(<DataTable columns={COLS} rows={rows} />)
    expect(screen.getByText('Grandma')).toBeDefined()
    expect(screen.getByText('Wolf')).toBeDefined()
  })

  it('renders deleted rows with strikethrough', () => {
    const rows: TableRow[] = [{ cells: ['1', 'Grandma', 'deleted'], variant: 'deleted' }]
    render(<DataTable columns={COLS} rows={rows} />)
    const strikethrough = screen.getByText('Grandma').closest('span')
    expect(strikethrough?.className).toContain('line-through')
  })

  it('uses "normal" as the default variant', () => {
    const rows: TableRow[] = [{ cells: ['1', 'Test', 'ok'] }]
    render(<DataTable columns={COLS} rows={rows} />)
    expect(screen.getByText('Test')).toBeDefined()
  })
})
