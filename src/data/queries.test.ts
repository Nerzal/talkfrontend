import { describe, it, expect } from 'vitest'
import {
  getYears,
  getTalksByYear,
  getMonthsByYear,
  getTalksByYearAndMonth,
  getTalkById,
  getTags,
  getTalksByTag,
} from './queries'
import type { Talk } from './types'

function makeTalk(id: string, year: number, month: number, tags?: string[]): Talk {
  return { id, title: id, year, month, slides: [{ id: 's1', layout: 'blank' }], tags }
}

const talks: Talk[] = [
  makeTalk('a', 2025, 3, ['go']),
  makeTalk('b', 2026, 1, ['go', 'architecture']),
  makeTalk('c', 2026, 1),
  makeTalk('d', 2026, 7, ['architecture']),
]

describe('queries', () => {
  it('getYears returns unique years sorted descending', () => {
    expect(getYears(talks)).toEqual([2026, 2025])
  })

  it('getTalksByYear filters by year', () => {
    expect(getTalksByYear(talks, 2026).map((t) => t.id)).toEqual(['b', 'c', 'd'])
  })

  it('getMonthsByYear returns unique months sorted ascending', () => {
    expect(getMonthsByYear(talks, 2026)).toEqual([1, 7])
  })

  it('getTalksByYearAndMonth filters by year and month', () => {
    expect(getTalksByYearAndMonth(talks, 2026, 1).map((t) => t.id)).toEqual(['b', 'c'])
  })

  it('getTalkById finds a talk by its ID', () => {
    expect(getTalkById(talks, 'd')?.id).toBe('d')
  })

  it('getTalkById returns undefined for an unknown ID', () => {
    expect(getTalkById(talks, 'nope')).toBeUndefined()
  })

  it('getTags returns unique tags sorted alphabetically', () => {
    expect(getTags(talks)).toEqual(['architecture', 'go'])
  })

  it('getTags returns an empty array when no talk has tags', () => {
    expect(getTags([makeTalk('e', 2026, 1)])).toEqual([])
  })

  it('getTalksByTag filters by tag', () => {
    expect(getTalksByTag(talks, 'architecture').map((t) => t.id)).toEqual(['b', 'd'])
  })

  it('getTalksByTag returns an empty array for an unknown tag', () => {
    expect(getTalksByTag(talks, 'nope')).toEqual([])
  })
})
