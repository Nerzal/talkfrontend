export type CarlSide = 'top' | 'bottom' | 'left' | 'right'

const SIDES: readonly CarlSide[] = ['top', 'bottom', 'left', 'right']

export function randomSide(): CarlSide {
  return SIDES[Math.floor(Math.random() * SIDES.length)]
}

export function randomQuote(quotes: readonly string[]): string {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export function randomDelayMs(minMs: number, maxMs: number): number {
  return minMs + Math.random() * (maxMs - minMs)
}
