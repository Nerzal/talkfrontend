import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Slide, Talk } from '../data/types'
import { usePresenter } from './usePresenter'
import { flattenBulletBlocks } from '../lib/assignFragmentOrder'

interface TalkPresenter {
  slideIndex: number
  stepIndex: number
  isFirst: boolean
  isLast: boolean
  progress: number
  goNext: () => void
  goPrev: () => void
  goBack: () => void
  /** Overrides the current position directly — used to follow a presenter view's navigation. */
  setNav: (slideIndex: number, stepIndex: number) => void
}

interface UseTalkPresenterOptions {
  /** Overrides how Escape/the back button exit — defaults to browser-history back(). Used by PresenterView, which opens in a fresh window.open() tab with no history to go back to. */
  onExit?: () => void
}

function fragmentCount(slide: Slide): number {
  const bullets =
    slide.layout === 'content'
      ? slide.bullets
      : slide.layout === 'mixed'
        ? flattenBulletBlocks(slide.blocks)
        : []
  return bullets.filter((bullet) => bullet.fragment).length
}

export function stepCount(talk: Talk, slideIndex: number): number {
  const slide = talk.slides[slideIndex]
  if (slide.layout === 'code' && slide.steps) return slide.steps.length + 1
  const fragments = fragmentCount(slide)
  return fragments > 0 ? fragments + 1 : 1
}

const SLIDE_PARAM = 'slide'

function clampSlideIndex(index: number, totalSlides: number): number {
  return Math.min(Math.max(index, 0), totalSlides - 1)
}

function readSlideIndexFromUrl(searchParams: URLSearchParams, totalSlides: number): number {
  const raw = searchParams.get(SLIDE_PARAM)
  const parsed = raw !== null ? Number(raw) : NaN
  return Number.isInteger(parsed) ? clampSlideIndex(parsed, totalSlides) : 0
}

export function useTalkPresenter(talk: Talk, options?: UseTalkPresenterOptions): TalkPresenter {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [slideIndex, setSlideIndex] = useState(() =>
    readSlideIndexFromUrl(searchParams, talk.slides.length),
  )
  const [stepIndex, setStepIndex] = useState(0)
  const totalSteps = stepCount(talk, slideIndex)

  // Keeps the URL in sync so reloading or sharing the link resumes on this
  // slide instead of jumping back to the start — replace (not push) so
  // stepping through slides doesn't spam browser history.
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set(SLIDE_PARAM, String(slideIndex))
        return next
      },
      { replace: true },
    )
  }, [slideIndex, setSearchParams])

  const goNext = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((s) => s + 1)
      return
    }
    if (slideIndex >= talk.slides.length - 1) return
    setSlideIndex((i) => i + 1)
    setStepIndex(0)
  }, [stepIndex, totalSteps, slideIndex, talk.slides.length])

  const goPrev = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((s) => s - 1)
      return
    }
    if (slideIndex <= 0) return
    setSlideIndex((i) => i - 1)
    setStepIndex(0)
  }, [stepIndex, slideIndex])

  const navigateBack = useCallback(() => {
    void navigate(-1)
  }, [navigate])

  const goBack = options?.onExit ?? navigateBack

  const setNav = useCallback((newSlideIndex: number, newStepIndex: number) => {
    setSlideIndex(newSlideIndex)
    setStepIndex(newStepIndex)
  }, [])

  usePresenter({ onNext: goNext, onPrev: goPrev, onExit: goBack })

  return {
    slideIndex,
    stepIndex,
    isFirst: slideIndex === 0 && stepIndex === 0,
    isLast: slideIndex === talk.slides.length - 1 && stepIndex === totalSteps - 1,
    progress: ((slideIndex + 1) / talk.slides.length) * 100,
    goNext,
    goPrev,
    goBack,
    setNav,
  }
}
