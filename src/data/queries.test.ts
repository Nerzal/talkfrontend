import { describe, it, expect } from 'vitest'
import {
  getYears,
  getTalksByYear,
  getMonthsByYear,
  getTalksByYearAndMonth,
  getTalkById,
} from './queries'
import type { Talk } from './types'

function makeTalk(id: string, year: number, month: number): Talk {
  return { id, title: id, year, month, slides: [{ id: 's1', layout: 'blank' }] }
}

const talks: Talk[] = [
  makeTalk('a', 2025, 3),
  makeTalk('b', 2026, 1),
  makeTalk('c', 2026, 1),
  makeTalk('d', 2026, 7),
]

describe('queries', () => {
  it('getYears liefert eindeutige Jahre absteigend sortiert', () => {
    expect(getYears(talks)).toEqual([2026, 2025])
  })

  it('getTalksByYear filtert nach Jahr', () => {
    expect(getTalksByYear(talks, 2026).map((t) => t.id)).toEqual(['b', 'c', 'd'])
  })

  it('getMonthsByYear liefert eindeutige Monate aufsteigend sortiert', () => {
    expect(getMonthsByYear(talks, 2026)).toEqual([1, 7])
  })

  it('getTalksByYearAndMonth filtert nach Jahr und Monat', () => {
    expect(getTalksByYearAndMonth(talks, 2026, 1).map((t) => t.id)).toEqual(['b', 'c'])
  })

  it('getTalkById findet einen Talk anhand seiner ID', () => {
    expect(getTalkById(talks, 'd')?.id).toBe('d')
  })

  it('getTalkById liefert undefined für unbekannte ID', () => {
    expect(getTalkById(talks, 'nope')).toBeUndefined()
  })
})
