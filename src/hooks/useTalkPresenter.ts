import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Talk } from '../data/types'
import { usePresenter } from './usePresenter'

interface TalkPresenter {
  slideIndex: number
  stepIndex: number
  isFirst: boolean
  isLast: boolean
  progress: number
  goNext: () => void
  goPrev: () => void
  goBack: () => void
}

function stepCount(talk: Talk, slideIndex: number): number {
  const slide = talk.slides[slideIndex]
  return slide.layout === 'code' && slide.steps ? slide.steps.length + 1 : 1
}

export function useTalkPresenter(talk: Talk): TalkPresenter {
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

  const goBack = useCallback(() => {
    void navigate(-1)
  }, [navigate])

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
  }
}
