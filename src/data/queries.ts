import type { Talk } from './types'

export function getYears(talks: Talk[]): number[] {
  return [...new Set(talks.map((t) => t.year))].sort((a, b) => b - a)
}

export function getTalksByYear(talks: Talk[], year: number): Talk[] {
  return talks.filter((t) => t.year === year)
}

export function getMonthsByYear(talks: Talk[], year: number): number[] {
  return [...new Set(getTalksByYear(talks, year).map((t) => t.month))].sort((a, b) => a - b)
}

export function getTalksByYearAndMonth(talks: Talk[], year: number, month: number): Talk[] {
  return getTalksByYear(talks, year).filter((t) => t.month === month)
}

export function getTalkById(talks: Talk[], id: string): Talk | undefined {
  return talks.find((t) => t.id === id)
}
