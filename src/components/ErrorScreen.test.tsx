import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorScreen } from './ErrorScreen'

describe('ErrorScreen', () => {
  it('zeigt die übergebene Fehlermeldung', () => {
    render(<ErrorScreen message="Netzwerkfehler beim Laden" />)
    expect(screen.getByText('Netzwerkfehler beim Laden')).toBeDefined()
  })

  it('zeigt einen allgemeinen Fehlerhinweis', () => {
    render(<ErrorScreen message="irgendein Fehler" />)
    expect(screen.getByText(/konnten nicht geladen werden/i)).toBeDefined()
  })
})
