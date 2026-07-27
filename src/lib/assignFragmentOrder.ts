import type { Bullet, ContentBlock } from '../data/types'

/**
 * Numbers fragment items in document order (0, 1, 2, ...), leaving
 * non-fragment items without an order. Used to know which click reveals
 * which fragment when rendering a slide.
 */
export function assignFragmentOrder<T extends { fragment?: boolean }>(
  items: T[],
): (T & { order?: number })[] {
  let next = 0
  return items.map((item) => (item.fragment ? { ...item, order: next++ } : item))
}

/** Whether a bullet is visible yet: non-fragments always are, fragments once their order is reached. */
export function isFragmentRevealed(order: number | undefined, stepIndex: number): boolean {
  return order === undefined || order < stepIndex
}

/** Flattens every "bullets" block's items into one list, in document order — the mixed-slide equivalent of a content slide's flat `bullets` array. */
export function flattenBulletBlocks(blocks: ContentBlock[]): Bullet[] {
  return blocks.flatMap((block) => (block.type === 'bullets' ? block.items : []))
}
