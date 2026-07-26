import type { ComponentType } from 'react'
import type { SpeakerSlide as SpeakerSlideData } from '../../data/types'
import { QrCode } from './QrCode'
import { WebsiteIcon, GithubIcon, XIcon, BlueskyIcon, MastodonIcon } from './socialIcons'

interface Props {
  slide: SpeakerSlideData
}

type LinkKey = 'website' | 'linkedin' | 'github' | 'twitter' | 'bluesky' | 'mastodon'

interface LinkEntry {
  label: string
  url: string
  Icon?: ComponentType<{ className?: string }>
}

const LINK_LABELS: Record<LinkKey, string> = {
  website: 'Website',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  twitter: 'X',
  bluesky: 'Bluesky',
  mastodon: 'Mastodon',
}

const LINK_ICONS: Partial<Record<LinkKey, ComponentType<{ className?: string }>>> = {
  website: WebsiteIcon,
  github: GithubIcon,
  twitter: XIcon,
  bluesky: BlueskyIcon,
  mastodon: MastodonIcon,
}

const LINK_KEYS: LinkKey[] = ['website', 'linkedin', 'github', 'twitter', 'bluesky', 'mastodon']

function getLinks(slide: SpeakerSlideData): LinkEntry[] {
  return LINK_KEYS.filter((key) => slide[key]).map((key) => ({
    label: LINK_LABELS[key],
    url: slide[key]!,
    Icon: LINK_ICONS[key],
  }))
}

export function SpeakerSlide({ slide }: Props) {
  const links = getLinks(slide)

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-start sm:justify-center text-center px-6 py-8 sm:px-16 sm:py-12 gap-6 sm:gap-10 md:gap-14 overflow-y-auto sm:overflow-hidden">
      {slide.heading && (
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-white tracking-tight">
          {slide.heading}
        </h1>
      )}

      {(slide.photo ?? (slide.facts && slide.facts.length > 0)) && (
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
          {slide.photo && (
            <img
              src={slide.photo}
              alt={slide.heading ?? 'Speaker'}
              className="w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full object-cover border-4 border-slate-800"
            />
          )}
          {slide.facts && slide.facts.length > 0 && (
            <ul className="text-left text-base sm:text-xl md:text-2xl text-slate-300 space-y-2 sm:space-y-3">
              {slide.facts.map((fact) => (
                <li key={fact} className="flex items-start gap-3">
                  <span className="text-indigo-400">▹</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {links.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-14">
          {links.map((link) => (
            <div key={link.label} className="flex flex-col items-center gap-2 sm:gap-4">
              <div className="w-20 sm:w-28 md:w-32">
                <QrCode value={link.url} />
              </div>
              <span className="flex items-center gap-2 text-sm sm:text-lg text-slate-400">
                {link.Icon && <link.Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                {link.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
