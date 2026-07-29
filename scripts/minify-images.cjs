#!/usr/bin/env node
// Resizes and recompresses talk image assets in place. Talk slides only ever
// display an image inside a 1280x720 slide, so anything larger than
// MAX_DIMENSION on its long edge is pure dead weight (several talk assets are
// unresized AI-generated exports in the 8-10MB range).
const { readdirSync, statSync, renameSync, writeFileSync } = require('node:fs')
const { join, extname } = require('node:path')
const sharp = require('sharp')

const TALKS_DIR = join(__dirname, '..', 'public', 'talks')
const MAX_DIMENSION = 1600
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])
// Re-encoding an already-lossy-compressed image always finds a *few* more
// bytes to shave (fresh dithering/quantization noise), so re-running this
// script on its own output would silently keep degrading images forever.
// Only accept a re-encode once it clears a real savings bar.
const MIN_SAVINGS_RATIO = 0.15

function findImages(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...findImages(full))
    } else if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      out.push(full)
    }
  }
  return out
}

function encoderFor(ext, pipeline) {
  switch (ext) {
    case '.png':
      return pipeline.png({ compressionLevel: 9, palette: true, quality: 80 })
    case '.jpg':
    case '.jpeg':
      return pipeline.jpeg({ quality: 80, mozjpeg: true })
    case '.webp':
      return pipeline.webp({ quality: 80 })
    default:
      throw new Error(`unsupported extension: ${ext}`)
  }
}

async function minify(filePath) {
  const before = statSync(filePath).size
  const ext = extname(filePath).toLowerCase()
  const image = sharp(filePath)
  const metadata = await image.metadata()

  let pipeline = image
  if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }
  const buffer = await encoderFor(ext, pipeline).toBuffer()

  if (buffer.length >= before * (1 - MIN_SAVINGS_RATIO)) {
    return { filePath, before, after: before, skipped: true }
  }
  const tmpPath = `${filePath}.tmp`
  writeFileSync(tmpPath, buffer)
  renameSync(tmpPath, filePath)
  return { filePath, before, after: buffer.length, skipped: false }
}

async function main() {
  const images = findImages(TALKS_DIR)
  let totalBefore = 0
  let totalAfter = 0

  for (const filePath of images) {
    const result = await minify(filePath)
    totalBefore += result.before
    totalAfter += result.after
    const relative = result.filePath.slice(TALKS_DIR.length + 1)
    if (result.skipped) {
      console.log(`  skip  ${relative} (already optimal)`)
    } else {
      const pct = Math.round((1 - result.after / result.before) * 100)
      console.log(
        `  ${(result.before / 1024).toFixed(0)}KB -> ${(result.after / 1024).toFixed(0)}KB (-${pct}%)  ${relative}`,
      )
    }
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
