import { describe, it, expect, vi, afterEach } from 'vitest'
import { randomSide, randomQuote, randomDelayMs } from './carlRandom'

describe('carlRandom', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('randomSide', () => {
    it('returns top for the lowest random value', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(randomSide()).toBe('top')
    })

    it('returns right for the highest random value', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      expect(randomSide()).toBe('right')
    })
  })

  describe('randomQuote', () => {
    it('picks the quote at the scaled index', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      expect(randomQuote(['a', 'b', 'c', 'd'])).toBe('c')
    })
  })

  describe('randomDelayMs', () => {
    it('returns the minimum when random is 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(randomDelayMs(1000, 5000)).toBe(1000)
    })

    it('returns a value scaled between min and max', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      expect(randomDelayMs(1000, 5000)).toBe(3000)
    })
  })
})
