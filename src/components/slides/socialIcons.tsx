import { siGithub, siX, siBluesky, siMastodon } from 'simple-icons'

interface Props {
  className?: string
}

function BrandIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

export function WebsiteIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.25" />
      <ellipse cx="12" cy="12" rx="4" ry="9.25" />
      <path d="M2.75 12h18.5" />
    </svg>
  )
}

export function GithubIcon({ className }: Props) {
  return <BrandIcon path={siGithub.path} className={className} />
}

export function XIcon({ className }: Props) {
  return <BrandIcon path={siX.path} className={className} />
}

export function BlueskyIcon({ className }: Props) {
  return <BrandIcon path={siBluesky.path} className={className} />
}

export function MastodonIcon({ className }: Props) {
  return <BrandIcon path={siMastodon.path} className={className} />
}
