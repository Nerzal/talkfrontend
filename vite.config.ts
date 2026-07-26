/// <reference types="vitest" />
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const require = createRequire(import.meta.url)
const { generateTalksIndex } = require('./scripts/talksIndex.cjs') as {
  generateTalksIndex: (talksDir: string) => string[]
}

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const talksDir = path.join(rootDir, 'public', 'talks')

// Regenerates public/talks/index.json (see scripts/talksIndex.cjs) whenever a
// talk folder is added or removed while `vite dev` is running, so dropping a
// new <id>/talk.md in is enough — no manual index.json edit, no restart.
function talksIndexPlugin(): Plugin {
  return {
    name: 'talks-index',
    configureServer(server) {
      let timer: ReturnType<typeof setTimeout> | undefined
      const regenerate = () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          generateTalksIndex(talksDir)
          server.ws.send({ type: 'full-reload' })
        }, 200)
      }
      const isTalkFolderChange = (file: string) => {
        const relative = path.relative(talksDir, file)
        if (relative.startsWith('..')) return false
        const parts = relative.split(path.sep)
        // A talk folder itself was added/removed, or its talk.md was added/removed.
        return parts.length === 1 || (parts.length === 2 && parts[1] === 'talk.md')
      }

      for (const event of ['add', 'unlink', 'addDir', 'unlinkDir'] as const) {
        server.watcher.on(event, (file: string) => {
          if (isTalkFolderChange(file)) regenerate()
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), talksIndexPlugin()],
  build: {
    // MagicMoveCodeSlide lazy-loads Shiki + its grammars into their own
    // chunk, only fetched when a talk actually uses code-step slides — it's
    // large but never part of the main bundle, so the default warning here
    // would be a false alarm.
    chunkSizeWarningLimit: 1500,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
