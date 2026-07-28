import { describe, it, expect } from 'vitest'
import { resolveSlideAssets, resolveTalkAssets } from './resolveAssetPaths'
import type { ImageSlide, SpeakerSlide, TableSlide, Talk } from './types'

describe('resolveSlideAssets', () => {
  it('prefixes a relative image src with the base URL', () => {
    const slide: ImageSlide = { id: 's1', layout: 'image', src: 'assets/foo.png', alt: 'Foo' }

    const result = resolveSlideAssets(slide, '/talks/my-talk')

    expect(result).toEqual({ ...slide, src: '/talks/my-talk/assets/foo.png' })
  })

  it('leaves an absolute image src unchanged', () => {
    const slide: ImageSlide = { id: 's1', layout: 'image', src: '/foo.png', alt: 'Foo' }

    const result = resolveSlideAssets(slide, '/talks/my-talk')

    expect(result.layout === 'image' && result.src).toBe('/foo.png')
  })

  it('leaves a full URL image src unchanged', () => {
    const slide: ImageSlide = {
      id: 's1',
      layout: 'image',
      src: 'https://example.com/foo.png',
      alt: 'Foo',
    }

    const result = resolveSlideAssets(slide, '/talks/my-talk')

    expect(result.layout === 'image' && result.src).toBe('https://example.com/foo.png')
  })

  it('prefixes a relative speaker photo with the base URL', () => {
    const slide: SpeakerSlide = { id: 's1', layout: 'speaker', photo: 'assets/me.jpg' }

    const result = resolveSlideAssets(slide, '/talks')

    expect(result).toEqual({ ...slide, photo: '/talks/assets/me.jpg' })
  })

  it('leaves a speaker slide without a photo unchanged', () => {
    const slide: SpeakerSlide = { id: 's1', layout: 'speaker', heading: 'Hi' }

    const result = resolveSlideAssets(slide, '/talks')

    expect(result).toEqual(slide)
  })

  it('prefixes a relative table image with the base URL', () => {
    const slide: TableSlide = {
      id: 's1',
      layout: 'table',
      columns: [],
      rows: [],
      image: 'assets/wolf.png',
    }

    const result = resolveSlideAssets(slide, '/talks/my-talk')

    expect(result).toEqual({ ...slide, image: '/talks/my-talk/assets/wolf.png' })
  })

  it('leaves a table slide without an image unchanged', () => {
    const slide: TableSlide = { id: 's1', layout: 'table', columns: [], rows: [], ascii: 'o/' }

    const result = resolveSlideAssets(slide, '/talks')

    expect(result).toEqual(slide)
  })

  it('leaves slides of other layouts unchanged', () => {
    const slide: Talk['slides'][number] = { id: 's1', layout: 'blank', heading: 'Hi' }

    const result = resolveSlideAssets(slide, '/talks')

    expect(result).toEqual(slide)
  })
})

describe('resolveTalkAssets', () => {
  it('resolves asset paths on every slide of the talk', () => {
    const talk: Talk = {
      id: 't',
      title: 'Talk',
      year: 2026,
      month: 1,
      slides: [
        { id: 's1', layout: 'image', src: 'assets/foo.png', alt: 'Foo' },
        { id: 's2', layout: 'blank', heading: 'Hi' },
      ],
    }

    const result = resolveTalkAssets(talk, '/talks/t')

    expect(result.slides[0]).toEqual({
      id: 's1',
      layout: 'image',
      src: '/talks/t/assets/foo.png',
      alt: 'Foo',
    })
    expect(result.slides[1]).toEqual(talk.slides[1])
  })

  it('does not mutate the original talk', () => {
    const talk: Talk = {
      id: 't',
      title: 'Talk',
      year: 2026,
      month: 1,
      slides: [{ id: 's1', layout: 'image', src: 'assets/foo.png', alt: 'Foo' }],
    }

    resolveTalkAssets(talk, '/talks/t')

    expect(talk.slides[0]).toEqual({
      id: 's1',
      layout: 'image',
      src: 'assets/foo.png',
      alt: 'Foo',
    })
  })
})
