import { useScreenRecording } from '../hooks/useScreenRecording'

interface Props {
  fileNamePrefix: string
  className?: string
}

export function RecordingButton({ fileNamePrefix, className }: Props) {
  const { state, start, stop } = useScreenRecording(fileNamePrefix)

  if (state === 'unsupported') return null

  const isRecording = state === 'recording'

  return (
    <button
      onClick={isRecording ? stop : () => void start()}
      className={`${className ?? ''} text-xs sm:text-sm transition-colors cursor-pointer p-3 -m-1 ${
        isRecording ? 'text-red-500 hover:text-red-400' : 'text-slate-600 hover:text-white'
      }`}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? '● Stop recording' : '● Record'}
    </button>
  )
}
