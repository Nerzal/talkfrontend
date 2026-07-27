import { useCallback, useEffect, useRef } from 'react'

export interface DrawPoint {
  x: number
  y: number
}

export type PresenterMessage =
  | { type: 'nav'; slideIndex: number; stepIndex: number }
  | { type: 'request-state' }
  | { type: 'draw-stroke'; slideId: string; points: DrawPoint[]; color: string }
  | { type: 'draw-clear'; slideId: string }

type Post = (message: PresenterMessage) => void

function channelName(talkId: string): string {
  return `talkfrontend-presenter:${talkId}`
}

function isBroadcastChannelSupported(): boolean {
  return typeof BroadcastChannel !== 'undefined'
}

/**
 * Same-browser presenter/audience sync for one talk, over a BroadcastChannel
 * scoped to that talk's id. There is no server involved — this only reaches
 * other tabs/windows of the same browser profile on the same device (e.g.
 * a presenter window on the laptop screen driving an audience window on the
 * projector). Cross-device remote control would need a signaling backend,
 * which this static, fetch-only app deliberately doesn't have.
 *
 * `onMessage` also receives `post`, so a handler can reply (e.g. to
 * "request-state") without needing to close over this same hook call's own
 * returned `post` before it's declared.
 */
export function usePresenterChannel(
  talkId: string,
  onMessage?: (msg: PresenterMessage, post: Post) => void,
) {
  const channelRef = useRef<BroadcastChannel | null>(null)
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  const post = useCallback<Post>((message) => {
    channelRef.current?.postMessage(message)
  }, [])

  useEffect(() => {
    if (!isBroadcastChannelSupported()) return

    const channel = new BroadcastChannel(channelName(talkId))
    channelRef.current = channel

    channel.onmessage = (event: MessageEvent<PresenterMessage>) => {
      onMessageRef.current?.(event.data, post)
    }

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [talkId, post])

  return { post, supported: isBroadcastChannelSupported() }
}
