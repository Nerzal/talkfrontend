import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { QrCode } from './QrCode'
import { generateQrMatrix } from '../../lib/qrCode'

describe('QrCode', () => {
  it('renders an svg with a matching viewBox', () => {
    const { container } = render(<QrCode value="https://github.com/nerzal" />)
    const svg = container.querySelector('svg')
    const moduleCount = generateQrMatrix('https://github.com/nerzal').length

    expect(svg?.getAttribute('viewBox')).toBe(`0 0 ${moduleCount} ${moduleCount}`)
  })

  it('renders one rect per dark module', () => {
    const { container } = render(<QrCode value="https://github.com/nerzal" />)
    const matrix = generateQrMatrix('https://github.com/nerzal')
    const darkCount = matrix.flat().filter(Boolean).length

    expect(container.querySelectorAll('rect')).toHaveLength(darkCount)
  })

  it('applies the given size', () => {
    const { container } = render(<QrCode value="https://example.com" size={128} />)
    const svg = container.querySelector('svg')

    expect(svg?.getAttribute('width')).toBe('128')
    expect(svg?.getAttribute('height')).toBe('128')
  })
})
