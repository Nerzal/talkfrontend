export interface MixedAudio {
  track: MediaStreamTrack | null
  close: () => void
}

/**
 * Combines the audio tracks of multiple streams (e.g. display audio + mic)
 * into a single track via Web Audio, since MediaRecorder needs one audio
 * track per stream to encode them together rather than picking just one.
 */
export function mixAudioTracks(streams: MediaStream[]): MixedAudio {
  const tracksByStream = streams.map((stream) => stream.getAudioTracks())
  const audioTracks = tracksByStream.flat()
  if (audioTracks.length === 0) return { track: null, close: () => {} }
  if (audioTracks.length === 1) return { track: audioTracks[0], close: () => {} }

  const context = new AudioContext()
  const destination = context.createMediaStreamDestination()
  streams.forEach((stream, index) => {
    if (tracksByStream[index].length > 0)
      context.createMediaStreamSource(stream).connect(destination)
  })

  return {
    track: destination.stream.getAudioTracks()[0] ?? null,
    close: () => void context.close(),
  }
}
