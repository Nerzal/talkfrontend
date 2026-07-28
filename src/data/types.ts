interface SlideBase {
  id: string
  /** Speaker notes, shown only in the presenter view, never to the audience. */
  notes?: string
}

export interface TitleSlide extends SlideBase {
  layout: 'title'
  title: string
  subtitle?: string
  author?: string
}

export interface Bullet {
  text: string
  /** Hidden until revealed one at a time via click/arrow key, instead of shown immediately with the rest of the slide. */
  fragment?: boolean
}

export interface ContentSlide extends SlideBase {
  layout: 'content'
  title: string
  bullets: Bullet[]
}

export interface CodeSlide extends SlideBase {
  layout: 'code'
  title?: string
  language: string
  code: string
  /** Additional versions of the code, morphed through one at a time (Shiki Magic Move) before advancing to the next slide. */
  steps?: string[]
}

export interface ImageSlide extends SlideBase {
  layout: 'image'
  title?: string
  src: string
  alt: string
  caption?: string
}

export interface BlankSlide extends SlideBase {
  layout: 'blank'
  heading?: string
  body?: string
}

export type TableRowVariant = 'normal' | 'highlight' | 'danger' | 'deleted' | 'warning'

export interface TableRow {
  cells: string[]
  variant?: TableRowVariant
}

export interface TableSlide extends SlideBase {
  layout: 'table'
  title?: string
  statement?: string
  columns: string[]
  rows: TableRow[]
  empty?: boolean
  caption?: string
  ascii?: string
  /** Replaces the ascii-art slot with a real image instead — mutually exclusive with `ascii` in practice, but both are independently optional. */
  image?: string
  imageAlt?: string
}

export type ContentBlock =
  | { type: 'heading'; level: 1 | 2; text: string }
  | { type: 'bullets'; items: Bullet[] }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }

export interface MixedSlide extends SlideBase {
  layout: 'mixed'
  blocks: ContentBlock[]
}

export interface SpeakerSlide extends SlideBase {
  layout: 'speaker'
  heading?: string
  photo?: string
  facts?: string[]
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  bluesky?: string
  mastodon?: string
}

export type Slide =
  | TitleSlide
  | ContentSlide
  | CodeSlide
  | ImageSlide
  | BlankSlide
  | TableSlide
  | SpeakerSlide
  | MixedSlide

export interface Talk {
  id: string
  title: string
  description?: string
  year: number
  month: number
  slides: Slide[]
  tags?: string[]
}

export interface DefaultSlides {
  intro: Slide
  end: Slide
}
