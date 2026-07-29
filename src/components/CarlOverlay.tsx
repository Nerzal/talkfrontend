import { useEffect, useRef, useState } from 'react'
import clippyUrl from '../assets/clippy.svg'
import { randomDelayMs, randomQuote, randomSide, type CarlSide } from '../lib/carlRandom'

interface Props {
  presentationEnabled: boolean
  currentSlideAllowsCarl: boolean
  slideIndex: number
}

const MIN_INTERVAL_MS = 40_000
const MAX_INTERVAL_MS = 360_000
const VISIBLE_DURATION_MS = 7_000
const MAX_APPEARANCES = 5

const QUOTES = [
  'Wurde Agentic AI schon erwähnt?',
  'Sieht so aus, als würdest du eine Präsentation halten.',
  'Soll ich das für dich in die Cloud verschieben?',
  'Bist du bald fertig?',
  'Er trinkt wieder Bier, oder? ODER?',
  'Produktiv-Datenbank erfolgreich gelöscht.',
  'Hallo! Ich bin Karl.',
  'Die Slide sieht wie ein Datum aus! 03.05.1965 oder?',
  'Will jemand mein NFT kaufen? Bitte? Komm schon!',
  'Hat er schon Cyber gesagt?',
  'AGI ist für nächsten Dienstag angekündigt. Soll ich den Termin eintragen?',
  'Warnung: Diese Slide wurde zu 99 % von mir halluziniert.',
  'Ich habe deinen Code vorsichtshalber in Rust neu geschrieben. Gern geschehen!',
  'Ich habe dein Dokument auf unseren Servern gesichert. Verluste vorbeugen undso.',
]

const EDGE_CLASSES: Record<CarlSide, string> = {
  top: 'inset-x-0 top-4 justify-center',
  bottom: 'inset-x-0 bottom-4 justify-center',
  left: 'inset-y-0 left-4 items-center',
  right: 'inset-y-0 right-4 items-center',
}

const HIDDEN_TRANSFORM: Record<CarlSide, string> = {
  top: 'translateY(-150%)',
  bottom: 'translateY(150%)',
  left: 'translateX(-150%)',
  right: 'translateX(150%)',
}

const SHOWN_TRANSFORM: Record<CarlSide, string> = {
  top: 'translateY(0)',
  bottom: 'translateY(0)',
  left: 'translateX(0)',
  right: 'translateX(0)',
}

export function CarlOverlay({ presentationEnabled, currentSlideAllowsCarl, slideIndex }: Props) {
  const enabled = presentationEnabled && currentSlideAllowsCarl
  const [visible, setVisible] = useState(false)
  const [side, setSide] = useState<CarlSide>('bottom')
  const [quote, setQuote] = useState('')
  const appearTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const appearanceCountRef = useRef(0)
  const slideIndexRef = useRef(slideIndex)
  const lastShownSlideIndexRef = useRef<number | null>(null)
  const [prevEnabled, setPrevEnabled] = useState(enabled)

  useEffect(() => {
    slideIndexRef.current = slideIndex
  }, [slideIndex])

  if (enabled !== prevEnabled) {
    setPrevEnabled(enabled)
    if (!enabled && visible) setVisible(false)
  }

  useEffect(() => {
    if (!enabled) return

    const scheduleAppearance = () => {
      if (appearanceCountRef.current >= MAX_APPEARANCES) return

      appearTimeoutRef.current = setTimeout(
        () => {
          if (appearanceCountRef.current >= MAX_APPEARANCES) return
          if (slideIndexRef.current === lastShownSlideIndexRef.current) {
            // Already shown once on this slide — a re-appearance attempt
            // resets the timer instead of showing again, so Karl never
            // appears twice on the same slide.
            scheduleAppearance()
            return
          }
          appearanceCountRef.current += 1
          lastShownSlideIndexRef.current = slideIndexRef.current
          setSide(randomSide())
          setQuote(randomQuote(QUOTES))
          setVisible(true)
          hideTimeoutRef.current = setTimeout(() => {
            setVisible(false)
            scheduleAppearance()
          }, VISIBLE_DURATION_MS)
        },
        randomDelayMs(MIN_INTERVAL_MS, MAX_INTERVAL_MS),
      )
    }

    scheduleAppearance()

    return () => {
      clearTimeout(appearTimeoutRef.current)
      clearTimeout(hideTimeoutRef.current)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden" aria-hidden="true">
      <div className={`absolute flex ${EDGE_CLASSES[side]}`}>
        <div
          data-testid="carl-slider"
          className="flex flex-col items-center gap-2 transition-transform duration-700 ease-out"
          style={{ transform: visible ? SHOWN_TRANSFORM[side] : HIDDEN_TRANSFORM[side] }}
        >
          <div className="relative max-w-[180px] rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-center text-xs font-medium text-slate-900 shadow-lg sm:text-sm">
            {quote}
            <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-slate-900 bg-white" />
          </div>
          <img src={clippyUrl} alt="Karl Klammer" className="h-32 w-24 drop-shadow-lg" />
        </div>
      </div>
    </div>
  )
}
