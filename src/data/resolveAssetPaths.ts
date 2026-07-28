import type { Slide, Talk } from './types'

function isRelativePath(path: string): boolean {
  return !/^[a-z][a-z0-9+.-]*:\/\//i.test(path) && !path.startsWith('/')
}

function resolvePath(path: string, baseUrl: string): string {
  return isRelativePath(path) ? `${baseUrl}/${path}` : path
}

export function resolveSlideAssets(slide: Slide, baseUrl: string): Slide {
  let result = slide

  if (result.layout === 'image') {
    result = { ...result, src: resolvePath(result.src, baseUrl) }
  }
  if (result.layout === 'speaker' && result.photo) {
    result = { ...result, photo: resolvePath(result.photo, baseUrl) }
  }
  if (result.layout === 'table' && result.image) {
    result = { ...result, image: resolvePath(result.image, baseUrl) }
  }
  if (result.background) {
    result = { ...result, background: resolvePath(result.background, baseUrl) }
  }

  return result
}

export function resolveTalkAssets(talk: Talk, baseUrl: string): Talk {
  return { ...talk, slides: talk.slides.map((slide) => resolveSlideAssets(slide, baseUrl)) }
}
