import type { Slide, Talk } from './types'

function isRelativePath(path: string): boolean {
  return !/^[a-z][a-z0-9+.-]*:\/\//i.test(path) && !path.startsWith('/')
}

function resolvePath(path: string, baseUrl: string): string {
  return isRelativePath(path) ? `${baseUrl}/${path}` : path
}

export function resolveSlideAssets(slide: Slide, baseUrl: string): Slide {
  if (slide.layout === 'image') {
    return { ...slide, src: resolvePath(slide.src, baseUrl) }
  }
  if (slide.layout === 'speaker' && slide.photo) {
    return { ...slide, photo: resolvePath(slide.photo, baseUrl) }
  }
  if (slide.layout === 'table' && slide.image) {
    return { ...slide, image: resolvePath(slide.image, baseUrl) }
  }
  return slide
}

export function resolveTalkAssets(talk: Talk, baseUrl: string): Talk {
  return { ...talk, slides: talk.slides.map((slide) => resolveSlideAssets(slide, baseUrl)) }
}
