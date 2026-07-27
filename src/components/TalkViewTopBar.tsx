import { RecordingButton } from './RecordingButton'
import { CameraToggleButton } from './CameraToggleButton'

interface Props {
  onBack: () => void
  onOpenPresenter?: () => void
  talkId?: string
}

/**
 * Real (non-absolute) top bar, so it takes actual layout space above the
 * slide instead of floating over it — an absolutely-positioned overlay here
 * used to collide with slide headings/titles that sit near the top-left.
 */
export function TalkViewTopBar({ onBack, onOpenPresenter, talkId }: Props) {
  return (
    <div className="flex items-center justify-between px-2 py-1 sm:px-6 sm:py-2 shrink-0">
      <div className="flex items-center gap-1">
        {onOpenPresenter && (
          <button
            onClick={onOpenPresenter}
            className="text-slate-600 hover:text-white text-xs sm:text-sm transition-colors cursor-pointer p-3 -m-1"
            aria-label="Open presenter view"
          >
            Presenter view
          </button>
        )}
        {talkId && <RecordingButton fileNamePrefix={talkId} />}
        <CameraToggleButton />
      </div>
      <button
        onClick={onBack}
        className="text-slate-600 hover:text-white text-2xl leading-none transition-colors cursor-pointer p-3 -m-1"
        aria-label="Back to overview"
      >
        ✕
      </button>
    </div>
  )
}
