// Minimal static file server for the built SPA (no runtime dependencies,
// so it runs unmodified on a distroless nodejs base image).
import { createServer } from 'node:http'
import { createReadStream, statSync } from 'node:fs'
import { extname, join, normalize, sep, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), 'dist')
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080
const INDEX_HTML = join(ROOT, 'index.html')

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

function resolveSafePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const normalized = normalize(join(ROOT, decoded))
  if (normalized !== ROOT && !normalized.startsWith(ROOT + sep)) {
    return null
  }
  return normalized
}

function sendFile(res, filePath) {
  const type = MIME_TYPES[extname(filePath)] ?? 'application/octet-stream'
  const cacheControl = filePath === INDEX_HTML ? 'no-cache' : 'public, max-age=31536000, immutable'
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': cacheControl,
  })
  createReadStream(filePath).pipe(res)
}

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' })
    res.end()
    return
  }

  const requested = resolveSafePath(req.url ?? '/')
  const stat = requested ? statSync(requested, { throwIfNoEntry: false }) : undefined
  if (stat?.isFile()) {
    sendFile(res, requested)
    return
  }

  // Client-side routing: fall back to index.html for unknown paths.
  sendFile(res, INDEX_HTML)
})

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} on port ${PORT}`)
})
