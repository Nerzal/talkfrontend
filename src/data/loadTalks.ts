import type { Talk } from './types'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load ${url} (status ${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function loadTalks(talksDir: string): Promise<Talk[]> {
  const ids = await fetchJson<string[]>(`${talksDir}/index.json`)
  return Promise.all(ids.map((id) => fetchJson<Talk>(`${talksDir}/${id}.json`)))
}
