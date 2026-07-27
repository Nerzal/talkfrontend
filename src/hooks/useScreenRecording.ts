import { useCallback, useRef, useState } from 'react'
import { pickSaveLocation } from '../lib/pickSaveLocation'
import { mixAudioTracks } from '../lib/mixAudioTracks'
import { createRecordingSink } from '../lib/recordingSink'
import { stopStream } from '../lib/stopStream'

export type RecordingState = 'idle' | 'recording' | 'unsupported'

const CANDIDATE_MIME_TYPES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
]

// Periodic chunks so a chosen save location gets written to incrementally
// instead of holding the whole recording in memory until stop().
const TIMESLICE_MS = 1000

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return undefined
  return CANDIDATE_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type))
}

export function isScreenRecordingSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices?.getDisplayMedia === 'function' &&
    typeof MediaRecorder !== 'undefined'
  )
}

/**
 * Local screen + microphone recording via getDisplayMedia + getUserMedia +
 * MediaRecorder — the user picks which screen/window/tab to capture and
 * grants microphone access through the browser's own prompts, and the
 * finished recording is written to a location the user chooses (File System
 * Access API) or, where unsupported, downloaded as a .webm file. No server
 * involved, nothing leaves the machine.
 */
export function useScreenRecording(fileNamePrefix: string) {
  const [state, setState] = useState<RecordingState>(
    isScreenRecordingSupported() ? 'idle' : 'unsupported',
  )
  const recorderRef = useRef<MediaRecorder | null>(null)

  const stop = useCallback(() => {
    recorderRef.current?.stop()
  }, [])

  const start = useCallback(async () => {
    if (!isScreenRecordingSupported()) return

    const fileName = `${fileNamePrefix}-recording.webm`
    // Requested first, while the click's user-activation is freshest.
    const fileHandle = await pickSaveLocation(fileName)

    let displayStream: MediaStream
    try {
      displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    } catch {
      // User cancelled the screen-share picker, or permission was denied — not an error to surface.
      return
    }

    let micStream: MediaStream | null = null
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      // Mic permission denied, or no microphone available — record without it.
    }

    const { track: audioTrack, close: closeAudioMix } = mixAudioTracks(
      micStream ? [displayStream, micStream] : [displayStream],
    )
    const combinedStream = new MediaStream([
      ...displayStream.getVideoTracks(),
      ...(audioTrack ? [audioTrack] : []),
    ])

    const sink = await createRecordingSink(fileHandle, fileName)

    const recorder = new MediaRecorder(combinedStream, { mimeType: pickMimeType() })
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) sink.write(event.data)
    }
    recorder.onstop = () => {
      void sink.finish(recorder.mimeType || 'video/webm').then(() => {
        stopStream(displayStream)
        stopStream(micStream)
        closeAudioMix()
        setState('idle')
      })
    }
    displayStream.getVideoTracks()[0]?.addEventListener('ended', stop)

    recorder.start(TIMESLICE_MS)
    recorderRef.current = recorder
    setState('recording')
  }, [fileNamePrefix, stop])

  return { state, start, stop }
}
