import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorScreen } from './ErrorScreen'

describe('ErrorScreen', () => {
  it('shows the given error message', () => {
    render(<ErrorScreen message="Network error while loading" />)
    expect(screen.getByText('Network error while loading')).toBeDefined()
  })

  it('shows a generic error notice', () => {
    render(<ErrorScreen message="some error" />)
    expect(screen.getByText(/could not be loaded/i)).toBeDefined()
  })
})
