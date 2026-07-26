export interface TitleSlide {
  layout: 'title'
  id: string
  title: string
  subtitle?: string
  author?: string
}

export interface ContentSlide {
  layout: 'content'
  id: string
  title: string
  bullets: string[]
}

export interface CodeSlide {
  layout: 'code'
  id: string
  title?: string
  language: string
  code: string
  /** Additional versions of the code, morphed through one at a time (Shiki Magic Move) before advancing to the next slide. */
  steps?: string[]
}

export interface ImageSlide {
  layout: 'image'
  id: string
  title?: string
  src: string
  alt: string
  caption?: string
}

export interface BlankSlide {
  layout: 'blank'
  id: string
  heading?: string
  body?: string
}

export type TableRowVariant = 'normal' | 'highlight' | 'danger' | 'deleted' | 'warning'

export interface TableRow {
  cells: string[]
  variant?: TableRowVariant
}

export interface TableSlide {
  layout: 'table'
  id: string
  title?: string
  statement?: string
  columns: string[]
  rows: TableRow[]
  empty?: boolean
  caption?: string
  ascii?: string
}

export type ContentBlock =
  | { type: 'heading'; level: 1 | 2; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }

export interface MixedSlide {
  layout: 'mixed'
  id: string
  blocks: ContentBlock[]
}

export interface SpeakerSlide {
  layout: 'speaker'
  id: string
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
