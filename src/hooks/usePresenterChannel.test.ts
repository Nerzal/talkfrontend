import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePresenterChannel } from './usePresenterChannel'
import type { PresenterMessage } from './usePresenterChannel'

describe('usePresenterChannel', () => {
  it('reports BroadcastChannel as supported in this test environment', () => {
    const { result } = renderHook(() => usePresenterChannel('talk-a'))
    expect(result.current.supported).toBe(true)
  })

  it('delivers a message posted on one instance to another instance on the same talk id', async () => {
    const received: PresenterMessage[] = []
    const { result: sender } = renderHook(() => usePresenterChannel('talk-sync'))
    renderHook(() => usePresenterChannel('talk-sync', (msg) => received.push(msg)))

    sender.current.post({ type: 'nav', slideIndex: 2, stepIndex: 1 })

    await waitFor(() => expect(received).toEqual([{ type: 'nav', slideIndex: 2, stepIndex: 1 }]))
  })

  it('does not deliver messages across different talk ids', async () => {
    const onMessage = vi.fn()
    const { result: sender } = renderHook(() => usePresenterChannel('talk-x'))
    renderHook(() => usePresenterChannel('talk-y', onMessage))

    sender.current.post({ type: 'request-state', requestId: 'r1' })
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(onMessage).not.toHaveBeenCalled()
  })

  it('stops delivering messages after unmount', async () => {
    const onMessage = vi.fn()
    const { result: sender } = renderHook(() => usePresenterChannel('talk-unmount'))
    const { unmount } = renderHook(() => usePresenterChannel('talk-unmount', onMessage))

    unmount()
    sender.current.post({ type: 'request-state', requestId: 'r1' })
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(onMessage).not.toHaveBeenCalled()
  })
})
