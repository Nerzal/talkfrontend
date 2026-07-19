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
    <div className="flex-1 flex flex-col items-center justify-center text-center px-16 py-12 gap-14">
      {slide.heading && (
        <h1 className="text-8xl font-extrabold text-white tracking-tight">{slide.heading}</h1>
      )}

      {(slide.photo ?? (slide.facts && slide.facts.length > 0)) && (
        <div className="flex items-center gap-10">
          {slide.photo && (
            <img
              src={slide.photo}
              alt={slide.heading ?? 'Speaker'}
              className="w-56 h-56 rounded-full object-cover border-4 border-slate-800"
            />
          )}
          {slide.facts && slide.facts.length > 0 && (
            <ul className="text-left text-2xl text-slate-300 space-y-3">
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
        <div className="flex gap-14">
          {links.map((link) => (
            <div key={link.label} className="flex flex-col items-center gap-4">
              <QrCode value={link.url} />
              <span className="flex items-center gap-2 text-lg text-slate-400">
                {link.Icon && <link.Icon className="w-5 h-5" />}
                {link.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
