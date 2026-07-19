import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingScreen } from './LoadingScreen'

describe('LoadingScreen', () => {
  it('zeigt einen Ladehinweis', () => {
    render(<LoadingScreen />)
    expect(screen.getByText(/wird.*geladen|werden geladen/i)).toBeDefined()
  })
})
