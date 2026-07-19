import type { Talk, DefaultSlides } from './types'

export function applyDefaultSlides(talk: Talk, defaults: DefaultSlides): Talk {
  return { ...talk, slides: [defaults.intro, ...talk.slides, defaults.end] }
}
