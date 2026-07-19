import { describe, it, expect } from 'vitest'
import { generateQrMatrix } from './qrCode'

describe('generateQrMatrix', () => {
  it('returns a square matrix', () => {
    const matrix = generateQrMatrix('https://github.com/nerzal')

    expect(matrix.length).toBeGreaterThan(0)
    for (const row of matrix) {
      expect(row).toHaveLength(matrix.length)
    }
  })

  it('contains both dark and light modules', () => {
    const matrix = generateQrMatrix('https://github.com/nerzal')
    const flat = matrix.flat()

    expect(flat).toContain(true)
    expect(flat).toContain(false)
  })

  it('produces different matrices for different content', () => {
    const a = generateQrMatrix('https://github.com/nerzal')
    const b = generateQrMatrix('https://example.com')

    expect(a).not.toEqual(b)
  })

  it('produces the same matrix for the same content', () => {
    const a = generateQrMatrix('https://github.com/nerzal')
    const b = generateQrMatrix('https://github.com/nerzal')

    expect(a).toEqual(b)
  })
})
