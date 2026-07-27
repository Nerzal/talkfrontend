import { describe, it, expect } from 'vitest'
import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
  it('formats zero as 00:00', () => {
    expect(formatDuration(0)).toBe('00:00')
  })

  it('formats seconds under a minute', () => {
    expect(formatDuration(45_000)).toBe('00:45')
  })

  it('formats minutes and seconds', () => {
    expect(formatDuration(125_000)).toBe('02:05')
  })

  it('formats durations over an hour as minutes', () => {
    expect(formatDuration(61 * 60_000)).toBe('61:00')
  })

  it('floors partial seconds', () => {
    expect(formatDuration(1_999)).toBe('00:01')
  })
})
