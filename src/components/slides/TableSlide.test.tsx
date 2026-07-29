import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TableSlide } from './TableSlide'
import type { TableSlide as TableSlideData } from '../../data/types'

function baseSlide(overrides: Partial<TableSlideData> = {}): TableSlideData {
  return {
    layout: 'table',
    id: 's01',
    title: 'CREATE',
    statement: "INSERT INTO t VALUES (1, 'x')",
    columns: ['id', 'name'],
    rows: [{ cells: ['1', 'x'] }],
    caption: 'A caption',
    ...overrides,
  }
}

describe('TableSlide', () => {
  it('renders title, statement, columns, rows and caption', () => {
    render(<TableSlide slide={baseSlide()} />)
    expect(screen.getByText('CREATE')).toBeDefined()
    expect(screen.getByText("INSERT INTO t VALUES (1, 'x')")).toBeDefined()
    expect(screen.getByText('id')).toBeDefined()
    expect(screen.getByText('x')).toBeDefined()
    expect(screen.getByText('A caption')).toBeDefined()
  })

  it('renders ascii art when no image is set', () => {
    render(<TableSlide slide={baseSlide({ ascii: 'ascii line' })} />)
    expect(screen.getByText('ascii line')).toBeDefined()
  })

  it('renders nothing in the illustration slot when neither image nor ascii is set', () => {
    const { container } = render(<TableSlide slide={baseSlide()} />)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('.text-amber-300, .text-amber-100')).toBeNull()
  })

  it('renders an image instead of ascii art when both are set, so it does not need its own slide', () => {
    render(
      <TableSlide
        slide={baseSlide({ ascii: 'ascii line', image: 'assets/pic.png', imageAlt: 'A picture' })}
      />,
    )
    const img = screen.getByAltText('A picture')
    expect(img.getAttribute('src')).toBe('assets/pic.png')
    expect(screen.queryByText('ascii line')).toBeNull()
  })

  it('applies maxHeight/maxWidth as inline style on the illustration image', () => {
    render(
      <TableSlide
        slide={baseSlide({
          image: 'assets/pic.png',
          imageAlt: 'A picture',
          maxHeight: '10%',
          maxWidth: '10%',
        })}
      />,
    )
    const img = screen.getByAltText('A picture')
    expect(img.style.maxHeight).toBe('10%')
    expect(img.style.maxWidth).toBe('10%')
  })
})
