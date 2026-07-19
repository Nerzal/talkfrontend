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
  TitleSlide | ContentSlide | CodeSlide | ImageSlide | BlankSlide | TableSlide | SpeakerSlide

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
