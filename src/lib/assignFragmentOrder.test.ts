import { describe, it, expect } from 'vitest'
import { assignFragmentOrder } from './assignFragmentOrder'

interface Item {
  text: string
  fragment?: boolean
}

describe('assignFragmentOrder', () => {
  it('numbers only fragment items, in document order', () => {
    const items: Item[] = [
      { text: 'A' },
      { text: 'B', fragment: true },
      { text: 'C' },
      { text: 'D', fragment: true },
    ]

    expect(assignFragmentOrder(items)).toEqual([
      { text: 'A' },
      { text: 'B', fragment: true, order: 0 },
      { text: 'C' },
      { text: 'D', fragment: true, order: 1 },
    ])
  })

  it('leaves a list with no fragments untouched', () => {
    const items: Item[] = [{ text: 'A' }, { text: 'B' }]

    expect(assignFragmentOrder(items)).toEqual(items)
  })
})
