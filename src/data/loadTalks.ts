import type { Talk, DefaultSlides } from './types'
import { applyDefaultSlides } from './applyDefaultSlides'
import { resolveSlideAssets, resolveTalkAssets } from './resolveAssetPaths'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load ${url} (status ${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function loadTalks(talksDir: string): Promise<Talk[]> {
  const [ids, defaults] = await Promise.all([
    fetchJson<string[]>(`${talksDir}/index.json`),
    fetchJson<DefaultSlides>(`${talksDir}/default-slides.json`),
  ])
  const resolvedDefaults: DefaultSlides = {
    intro: resolveSlideAssets(defaults.intro, talksDir),
    end: resolveSlideAssets(defaults.end, talksDir),
  }
  const talks = await Promise.all(
    ids.map(async (id) => {
      const talk = await fetchJson<Talk>(`${talksDir}/${id}/talk.json`)
      return resolveTalkAssets(talk, `${talksDir}/${id}`)
    }),
  )
  return talks.map((talk) => applyDefaultSlides(talk, resolvedDefaults))
}
