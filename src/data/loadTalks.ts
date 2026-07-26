import type { Talk, DefaultSlides } from './types'
import { applyDefaultSlides } from './applyDefaultSlides'
import { resolveSlideAssets, resolveTalkAssets } from './resolveAssetPaths'
import { parseTalkMarkdown } from './markdown/parseTalkMarkdown'
import { parseDefaultSlidesMarkdown } from './markdown/parseDefaultSlidesMarkdown'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load ${url} (status ${res.status})`)
  }
  return res.json() as Promise<T>
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load ${url} (status ${res.status})`)
  }
  return res.text()
}

export async function loadTalks(talksDir: string): Promise<Talk[]> {
  const [ids, defaultsSource] = await Promise.all([
    fetchJson<string[]>(`${talksDir}/index.json`),
    fetchText(`${talksDir}/default-slides.md`),
  ])
  const defaults = parseDefaultSlidesMarkdown(defaultsSource)
  const resolvedDefaults: DefaultSlides = {
    intro: resolveSlideAssets(defaults.intro, talksDir),
    end: resolveSlideAssets(defaults.end, talksDir),
  }
  const talks = await Promise.all(
    ids.map(async (id) => {
      const source = await fetchText(`${talksDir}/${id}/talk.md`)
      const talk = parseTalkMarkdown(source)
      return resolveTalkAssets(talk, `${talksDir}/${id}`)
    }),
  )
  return talks.map((talk) => applyDefaultSlides(talk, resolvedDefaults))
}
