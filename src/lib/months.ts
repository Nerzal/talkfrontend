export const MONTHS_DE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const

export function monthName(month: number): string {
  return MONTHS_DE[month - 1] ?? `Monat ${month}`
}
