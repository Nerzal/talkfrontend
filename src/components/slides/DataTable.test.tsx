import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataTable } from './DataTable'
import type { TableRow } from '../../data/types'

const COLS = ['id', 'name', 'status']

describe('DataTable', () => {
  it('rendert Spaltenköpfe', () => {
    render(<DataTable columns={COLS} rows={[]} />)
    expect(screen.getByText('id')).toBeDefined()
    expect(screen.getByText('name')).toBeDefined()
    expect(screen.getByText('status')).toBeDefined()
  })

  it('zeigt "0 Zeilen" wenn empty=true', () => {
    render(<DataTable columns={COLS} rows={[]} empty />)
    expect(screen.getByText(/0 Zeilen/)).toBeDefined()
  })

  it('rendert Zeilen-Inhalte', () => {
    const rows: TableRow[] = [
      { cells: ['1', 'Großmutter', 'gesund'] },
      { cells: ['2', 'Wolf', 'satt'] },
    ]
    render(<DataTable columns={COLS} rows={rows} />)
    expect(screen.getByText('Großmutter')).toBeDefined()
    expect(screen.getByText('Wolf')).toBeDefined()
  })

  it('rendert gelöschte Zeilen mit Durchstreichung', () => {
    const rows: TableRow[] = [{ cells: ['1', 'Großmutter', 'deleted'], variant: 'deleted' }]
    render(<DataTable columns={COLS} rows={rows} />)
    const strikethrough = screen.getByText('Großmutter').closest('span')
    expect(strikethrough?.className).toContain('line-through')
  })

  it('verwendet "normal" als Standard-Variante', () => {
    const rows: TableRow[] = [{ cells: ['1', 'Test', 'ok'] }]
    render(<DataTable columns={COLS} rows={rows} />)
    expect(screen.getByText('Test')).toBeDefined()
  })
})
