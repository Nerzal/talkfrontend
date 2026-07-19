import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingScreen } from './LoadingScreen'

describe('LoadingScreen', () => {
  it('shows a loading notice', () => {
    render(<LoadingScreen />)
    expect(screen.getByText(/loading/i)).toBeDefined()
  })
})
