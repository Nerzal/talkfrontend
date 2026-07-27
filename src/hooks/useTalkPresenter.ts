import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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

function stepCount(talk: Talk, slideIndex: number): number {
  const slide = talk.slides[slideIndex]
  if (slide.layout === 'code' && slide.steps) return slide.steps.length + 1
  const fragments = fragmentCount(slide)
  return fragments > 0 ? fragments + 1 : 1
}

export function useTalkPresenter(talk: Talk, options?: UseTalkPresenterOptions): TalkPresenter {
  const navigate = useNavigate()
  const [slideIndex, setSlideIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const totalSteps = stepCount(talk, slideIndex)

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
