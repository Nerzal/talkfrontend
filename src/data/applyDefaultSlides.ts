import type { Talk, DefaultSlides } from './types'

/** Reserved id a talk's own slide can use (`--- 0`) to be pinned before the shared default intro slide instead of taking its normal document-order position — e.g. for a title card, sponsor mention, or content warning. */
const PRE_INTRO_ID = '0'

export function applyDefaultSlides(talk: Talk, defaults: DefaultSlides): Talk {
  const preIntroIndex = talk.slides.findIndex((slide) => slide.id === PRE_INTRO_ID)
  if (preIntroIndex === -1) {
    return { ...talk, slides: [defaults.intro, ...talk.slides, defaults.end] }
  }

  const preIntro = talk.slides[preIntroIndex]
  const rest = talk.slides.filter((_, index) => index !== preIntroIndex)
  return { ...talk, slides: [preIntro, defaults.intro, ...rest, defaults.end] }
}
