import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Talk } from '../data/types'
import { usePresenter } from './usePresenter'

interface TalkPresenter {
  slideIndex: number
  isFirst: boolean
  isLast: boolean
  progress: number
  goNext: () => void
  goPrev: () => void
  goBack: () => void
}

export function useTalkPresenter(talk: Talk): TalkPresenter {
  const navigate = useNavigate()
  const [slideIndex, setSlideIndex] = useState(0)

  const goNext = useCallback(() => {
    setSlideIndex(i => Math.min(i + 1, talk.slides.length - 1))
  }, [talk.slides.length])

  const goPrev = useCallback(() => {
    setSlideIndex(i => Math.max(i - 1, 0))
  }, [])

  const goBack = useCallback(() => navigate(-1), [navigate])

  usePresenter({ onNext: goNext, onPrev: goPrev, onExit: goBack })

  return {
    slideIndex,
    isFirst: slideIndex === 0,
    isLast: slideIndex === talk.slides.length - 1,
    progress: ((slideIndex + 1) / talk.slides.length) * 100,
    goNext,
    goPrev,
    goBack,
  }
}
